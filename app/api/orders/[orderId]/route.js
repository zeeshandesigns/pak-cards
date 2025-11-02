import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/orders/[orderId]
 * Get single order details with delivered codes
 * User must own the order
 */
export async function GET(request, { params }) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json(
        {
          error: "Order ID is required",
        },
        { status: 400 }
      );
    }

    // Fetch order with all details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                images: true,
                category: true,
                price: true,
                deliveryType: true,
                requiresApproval: true,
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
          orderBy: {
            deliveredAt: "asc",
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            username: true,
            logo: true,
            email: true,
            contact: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        {
          error: "Order not found",
        },
        { status: 404 }
      );
    }

    // Verify ownership
    if (order.userId !== userId) {
      return NextResponse.json(
        {
          error: "You don't have permission to view this order",
        },
        { status: 403 }
      );
    }

    // Parse address
    let address;
    try {
      address = JSON.parse(order.address);
    } catch (e) {
      address = null;
    }

    // Group codes by product
    const codesByProduct = new Map();
    order.deliveredCodes.forEach((code) => {
      if (!codesByProduct.has(code.productId)) {
        codesByProduct.set(code.productId, []);
      }
      codesByProduct.get(code.productId).push({
        id: code.id,
        code: code.code,
        deliveredAt: code.deliveredAt,
        viewedAt: code.viewedAt,
        isNew: code.viewedAt === null,
      });
    });

    // Format order response
    const formattedOrder = {
      id: order.id,
      orderNumber: order.id.substring(0, 8).toUpperCase(),
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalPrice: order.totalPrice,
      createdAt: order.createdAt,
      address,

      // Payment info
      paymentProof: order.paymentProof,
      paymentReference: order.paymentReference,
      verifiedAt: order.verifiedAt,
      verifiedBy: order.verifiedBy,
      rejectionReason: order.rejectionReason,

      // Store info
      store: order.store,

      // User info (for reference)
      user: order.user,

      // Items with codes
      items: order.items.map((item) => {
        const productCodes = codesByProduct.get(item.product.id) || [];

        return {
          productId: item.product.id,
          productName: item.product.name,
          productDescription: item.product.description,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.price * item.quantity,
          images: item.product.images,
          category: item.product.category,
          deliveryType: item.product.deliveryType,
          requiresApproval: item.product.requiresApproval,

          // Gift card codes
          codes: productCodes,
          codesDelivered: productCodes.length,
          codesExpected: item.quantity,
          allCodesDelivered: productCodes.length === item.quantity,
        };
      }),

      // Summary
      summary: {
        totalItems: order.items.length,
        totalQuantity: order.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        ),
        codesDelivered: order.deliveredCodes.length,
        codesViewed: order.deliveredCodes.filter((c) => c.viewedAt !== null)
          .length,
        hasUnviewedCodes: order.deliveredCodes.some((c) => c.viewedAt === null),
        canViewCodes:
          order.status === "CODE_DELIVERED" || order.status === "COMPLETED",
      },

      // Timeline/status info
      timeline: getOrderTimeline(order),
    };

    return NextResponse.json(
      {
        success: true,
        order: formattedOrder,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch order",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Generate order timeline based on status and timestamps
 */
function getOrderTimeline(order) {
  const timeline = [
    {
      status: "Order Placed",
      timestamp: order.createdAt,
      completed: true,
    },
  ];

  if (order.paymentMethod === "BANK_TRANSFER") {
    timeline.push({
      status: "Payment Submitted",
      timestamp: order.createdAt,
      completed: [
        "PAYMENT_SUBMITTED",
        "PAYMENT_VERIFIED",
        "CODE_DELIVERED",
        "COMPLETED",
      ].includes(order.status),
    });

    if (order.verifiedAt) {
      timeline.push({
        status: "Payment Verified",
        timestamp: order.verifiedAt,
        completed: true,
      });
    } else if (order.status === "PAYMENT_REJECTED") {
      timeline.push({
        status: "Payment Rejected",
        timestamp: order.updatedAt,
        completed: true,
        isRejected: true,
      });
    }
  }

  if (order.status === "CODE_DELIVERED" || order.status === "COMPLETED") {
    const firstCodeDelivery = order.deliveredCodes[0]?.deliveredAt;
    timeline.push({
      status: "Codes Delivered",
      timestamp: firstCodeDelivery || order.updatedAt,
      completed: true,
    });
  }

  return timeline;
}
