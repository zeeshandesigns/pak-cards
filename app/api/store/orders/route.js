import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/lib/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";

/**
 * GET /api/store/orders
 * Get all orders for seller's store
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
          error: "You need an approved store to view orders",
        },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // Optional filter by status

    // Build where clause
    const where = { storeId };
    if (status) {
      where.status = status;
    }

    // Fetch orders with related data
    const orders = await prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                images: true,
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
      },
      orderBy: { createdAt: "desc" },
    });

    // Format orders for response
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      orderNumber: order.id.substring(0, 8).toUpperCase(),
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,

      // Buyer info
      buyer: {
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        image: order.user.image,
      },

      // Items
      items: order.items.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.price,
        deliveryType: item.product.deliveryType,
        image: item.product.images[0],
      })),

      // Delivery info
      codesDelivered: order.deliveredCodes.length,
      codesViewed: order.deliveredCodes.filter((c) => c.viewedAt !== null)
        .length,

      // Payment verification (if manual verification)
      paymentProof: order.paymentProof,
      paymentReference: order.paymentReference,
      verifiedAt: order.verifiedAt,
      rejectionReason: order.rejectionReason,
    }));

    return NextResponse.json(
      {
        success: true,
        count: formattedOrders.length,
        orders: formattedOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching store orders:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch orders",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
