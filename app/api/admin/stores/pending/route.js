import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/middlewares/authSeller";
import { auth } from "@clerk/nextjs/server";

/**
 * GET /api/admin/stores/pending
 * Fetch all stores with pending approval status
 * Admin only - requires admin privileges
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

    // Fetch pending stores with user and product information
    const pendingStores = await prisma.store.findMany({
      where: {
        status: "pending",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        products: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // Oldest first (FIFO)
      },
    });

    // Format response with calculated fields
    const formattedStores = pendingStores.map((store) => ({
      ...store,
      productCount: store.products.length,
      products: undefined, // Remove full products array, just keep count
      waitingDays: Math.floor(
        (new Date() - new Date(store.createdAt)) / (1000 * 60 * 60 * 24)
      ),
    }));

    return NextResponse.json(
      {
        success: true,
        count: formattedStores.length,
        stores: formattedStores,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pending stores:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch pending stores",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
