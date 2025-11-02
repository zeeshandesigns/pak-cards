import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdmin } from "@/lib/middlewares/authSeller";
import { auth } from "@clerk/nextjs/server";

/**
 * POST /api/admin/stores/[storeId]/approve
 * Approve or reject a store application
 * Body: { action: "approve" | "reject", rejectionReason?: string }
 */
export async function POST(request, { params }) {
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

    const { storeId } = await params;
    const body = await request.json();
    const { action, rejectionReason } = body;

    // Validate action
    if (!action || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Use 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    // Check if store exists and is pending
    const store = await prisma.store.findUnique({
      where: { id: storeId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!store) {
      return NextResponse.json(
        { success: false, error: "Store not found" },
        { status: 404 }
      );
    }

    if (store.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          error: `Store is already ${store.status}. Only pending stores can be reviewed.`,
        },
        { status: 400 }
      );
    }

    // Update store status
    const newStatus = action === "approve" ? "approved" : "rejected";
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        status: newStatus,
        ...(action === "reject" && rejectionReason ? { rejectionReason } : {}),
      },
    });

    // TODO: Send email notification to store owner
    // This would be handled by an Inngest function in Phase 6

    return NextResponse.json(
      {
        success: true,
        message: `Store ${
          action === "approve" ? "approved" : "rejected"
        } successfully`,
        store: {
          id: updatedStore.id,
          name: updatedStore.name,
          status: updatedStore.status,
          ownerEmail: store.user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating store status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update store status",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
