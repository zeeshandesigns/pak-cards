import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/middlewares/authSeller";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/admin/dashboard
 * Fetch admin dashboard statistics and metrics
 * Admin only - platform-wide overview
 */
export async function GET(request) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check admin privileges
    const isAdminUser = await isAdmin(userId);
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    // Fetch all statistics in parallel
    const [
      totalStores,
      pendingStores,
      approvedStores,
      rejectedStores,
      totalOrders,
      pendingVerificationOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      totalRevenue,
      totalUsers,
      totalProducts,
      recentOrders,
      recentStores,
    ] = await Promise.all([
      // Store statistics
      prisma.store.count(),
      prisma.store.count({ where: { status: "pending" } }),
      prisma.store.count({ where: { status: "approved" } }),
      prisma.store.count({ where: { status: "rejected" } }),

      // Order statistics
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending_verification" } }),
      prisma.order.count({ where: { status: "processing" } }),
      prisma.order.count({ where: { status: "completed" } }),
      prisma.order.count({ where: { status: "cancelled" } }),

      // Revenue (sum of completed orders)
      prisma.order.aggregate({
        where: { status: "completed" },
        _sum: { totalAmount: true },
      }),

      // User and product counts
      prisma.user.count(),
      prisma.product.count(),

      // Recent activity (last 10 orders)
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      // Recently submitted stores
      prisma.store.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    // Calculate today's statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayOrders, todayRevenue, todayStores] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: today },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: today },
          status: "completed",
        },
        _sum: { totalAmount: true },
      }),
      prisma.store.count({
        where: {
          createdAt: { gte: today },
        },
      }),
    ]);

    // Calculate this month's statistics
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [monthOrders, monthRevenue] = await Promise.all([
      prisma.order.count({
        where: {
          createdAt: { gte: firstDayOfMonth },
        },
      }),
      prisma.order.aggregate({
        where: {
          createdAt: { gte: firstDayOfMonth },
          status: "completed",
        },
        _sum: { totalAmount: true },
      }),
    ]);

    return NextResponse.json(
      {
        success: true,
        dashboard: {
          // Store metrics
          stores: {
            total: totalStores,
            approved: approvedStores,
            pending: pendingStores,
            rejected: rejectedStores,
            approvalRate:
              totalStores > 0
                ? Math.round((approvedStores / totalStores) * 100)
                : 0,
          },

          // Order metrics
          orders: {
            total: totalOrders,
            pendingVerification: pendingVerificationOrders,
            processing: processingOrders,
            completed: completedOrders,
            cancelled: cancelledOrders,
            completionRate:
              totalOrders > 0
                ? Math.round((completedOrders / totalOrders) * 100)
                : 0,
          },

          // Revenue metrics
          revenue: {
            total: totalRevenue._sum.totalAmount || 0,
            today: todayRevenue._sum.totalAmount || 0,
            thisMonth: monthRevenue._sum.totalAmount || 0,
          },

          // Platform metrics
          platform: {
            totalUsers,
            totalProducts,
            activeStores: approvedStores,
          },

          // Today's activity
          today: {
            orders: todayOrders,
            revenue: todayRevenue._sum.totalAmount || 0,
            newStores: todayStores,
          },

          // This month's activity
          thisMonth: {
            orders: monthOrders,
            revenue: monthRevenue._sum.totalAmount || 0,
          },

          // Recent activity
          recentActivity: {
            orders: recentOrders.map((order) => ({
              id: order.id,
              totalAmount: order.totalAmount,
              status: order.status,
              paymentMethod: order.paymentMethod,
              createdAt: order.createdAt,
              user: order.user,
            })),
            stores: recentStores.map((store) => ({
              id: store.id,
              name: store.name,
              status: store.status,
              createdAt: store.createdAt,
              owner: store.user,
            })),
          },

          // Alerts (things needing attention)
          alerts: {
            pendingStoreApprovals: pendingStores,
            pendingPaymentVerifications: pendingVerificationOrders,
            needsAttention: pendingStores + pendingVerificationOrders > 0,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch dashboard data",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
