import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/lib/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";

/**
 * GET /api/store/dashboard
 * Get dashboard data for seller (gift card specific metrics)
 */
export async function GET(request) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json(
        {
          error: "You need an approved store to view dashboard",
        },
        { status: 403 }
      );
    }

    // Get all orders for seller
    const orders = await prisma.order.findMany({
      where: { storeId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Get all products
    const products = await prisma.product.findMany({
      where: { storeId },
    });

    // Get all ratings
    const ratings = await prisma.rating.findMany({
      where: { productId: { in: products.map((p) => p.id) } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10, // Latest 10 ratings
    });

    // Get delivered codes count
    const deliveredCodes = await prisma.deliveredCode.count({
      where: {
        product: {
          storeId,
        },
      },
    });

    // Calculate gift card specific metrics
    const totalCodes = products.reduce((sum, p) => {
      const codes = p.digitalCodes ? JSON.parse(p.digitalCodes) : [];
      return sum + codes.length;
    }, 0);

    const availableCodes = products.reduce(
      (sum, p) => sum + p.availableCodes,
      0
    );

    const deliveredCodesCount = totalCodes - availableCodes;

    // Orders by status
    const ordersByStatus = {
      pending: orders.filter((o) => o.status === "PENDING").length,
      paymentPending: orders.filter((o) => o.status === "PAYMENT_PENDING")
        .length,
      paymentSubmitted: orders.filter((o) => o.status === "PAYMENT_SUBMITTED")
        .length,
      paymentVerified: orders.filter((o) => o.status === "PAYMENT_VERIFIED")
        .length,
      codeDelivered: orders.filter((o) => o.status === "CODE_DELIVERED").length,
      completed: orders.filter((o) => o.status === "COMPLETED").length,
      cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };

    // Calculate earnings (only from completed/delivered orders)
    const completedOrders = orders.filter(
      (o) => o.status === "CODE_DELIVERED" || o.status === "COMPLETED"
    );
    const totalEarnings = Math.round(
      completedOrders.reduce((acc, order) => acc + order.totalPrice, 0)
    );

    // Recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((order) => ({
        id: order.id,
        totalPrice: order.totalPrice,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: order.items.length,
      }));

    const dashboardData = {
      // Basic stats
      totalOrders: orders.length,
      totalProducts: products.length,
      totalEarnings,

      // Gift card specific
      totalCodes,
      availableCodes,
      deliveredCodes: deliveredCodesCount,
      codeUtilization:
        totalCodes > 0
          ? Math.round((deliveredCodesCount / totalCodes) * 100)
          : 0,

      // Order status breakdown
      ordersByStatus,

      // Products by delivery type
      autoDeliveryProducts: products.filter(
        (p) => p.deliveryType === "auto_delivery"
      ).length,
      manualVerificationProducts: products.filter(
        (p) => p.deliveryType === "manual_verification"
      ).length,

      // Recent data
      recentOrders,
      ratings: ratings.slice(0, 5), // Latest 5 ratings

      // Average rating
      avgRating:
        ratings.length > 0
          ? Math.round(
              (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length) *
                10
            ) / 10
          : 0,
    };

    return NextResponse.json(
      {
        success: true,
        dashboard: dashboardData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
