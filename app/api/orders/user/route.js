import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/orders/user
 * Get authenticated user's order history
 */
export async function GET(request) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // Optional filter by status
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where = { userId };
    if (status) {
      where.status = status;
    }

    // Fetch orders
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                category: true,
                deliveryType: true,
              },
            },
          },
        },
        deliveredCodes: {
          select: {
            id: true,
            productId: true,
            code: true,
            deliveredAt: true,
            viewedAt: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            username: true,
            logo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalCount = await prisma.order.count({ where });

    // Format orders
    const formattedOrders = orders.map((order) => {
      // Parse address
      let address;
      try {
        address = JSON.parse(order.address);
      } catch (e) {
        address = null;
      }

      return {
        id: order.id,
        orderNumber: order.id.substring(0, 8).toUpperCase(),
        status: order.status,
        paymentMethod: order.paymentMethod,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        address,

        // Store info
        store: order.store,

        // Items
        items: order.items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.price,
          image: item.product.images[0],
          category: item.product.category,
          deliveryType: item.product.deliveryType,
        })),

        // Delivery info
        codesDelivered: order.deliveredCodes.length,
        codesViewed: order.deliveredCodes.filter((c) => c.viewedAt !== null)
          .length,
        hasUnviewedCodes: order.deliveredCodes.some((c) => c.viewedAt === null),

        // Status info
        canViewCodes:
          order.status === "CODE_DELIVERED" || order.status === "COMPLETED",
        isPending: ["PENDING", "PAYMENT_PENDING", "PAYMENT_SUBMITTED"].includes(
          order.status
        ),
        isRejected: order.status === "PAYMENT_REJECTED",
        rejectionReason: order.rejectionReason,
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: formattedOrders.length,
        totalCount,
        hasMore: offset + formattedOrders.length < totalCount,
        orders: formattedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
