import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/configs/imagekit";
import { inngest } from "@/inngest/client";

/**
 * POST /api/orders/create
 * Create order with payment proof upload
 */
export async function POST(request) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const itemsJson = formData.get("items");
    const addressJson = formData.get("address");
    const paymentMethod = formData.get("paymentMethod");
    const paymentProofFile = formData.get("paymentProof");
    const paymentReference = formData.get("paymentReference");

    // Validate required fields
    if (!itemsJson || !addressJson || !paymentMethod) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["items", "address", "paymentMethod"],
        },
        { status: 400 }
      );
    }

    // Parse items and address
    let items, address;
    try {
      items = JSON.parse(itemsJson);
      address = JSON.parse(addressJson);
    } catch (e) {
      return NextResponse.json(
        {
          error: "Invalid JSON format for items or address",
        },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        {
          error: "Cart is empty",
        },
        { status: 400 }
      );
    }

    // Validate payment method
    const validPaymentMethods = ["COD", "BANK_TRANSFER", "STRIPE"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        {
          error: "Invalid payment method",
          validMethods: validPaymentMethods,
        },
        { status: 400 }
      );
    }

    // For BANK_TRANSFER, payment proof is required
    if (
      paymentMethod === "BANK_TRANSFER" &&
      (!paymentProofFile || paymentProofFile.size === 0)
    ) {
      return NextResponse.json(
        {
          error: "Payment proof is required for bank transfer",
        },
        { status: 400 }
      );
    }

    // Fetch all products to validate
    const productIds = items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
      include: {
        store: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Create product map
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Validate all items and calculate totals
    const orderItems = [];
    let totalPrice = 0;
    let hasManualVerification = false;
    let hasAutoDelivery = false;

    for (const item of items) {
      const product = productMap.get(item.productId);

      if (!product) {
        return NextResponse.json(
          {
            error: `Product not found: ${item.productId}`,
          },
          { status: 400 }
        );
      }

      if (product.store.status !== "approved") {
        return NextResponse.json(
          {
            error: `Store not approved for product: ${product.name}`,
          },
          { status: 400 }
        );
      }

      if (!product.inStock || product.availableCodes < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for: ${product.name}`,
            available: product.availableCodes,
          },
          { status: 400 }
        );
      }

      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;

      if (product.deliveryType === "manual_verification") {
        hasManualVerification = true;
      } else {
        hasAutoDelivery = true;
      }

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
        storeId: product.storeId,
      });
    }

    // Upload payment proof if provided
    let paymentProofUrl = null;
    if (paymentProofFile && paymentProofFile.size > 0) {
      try {
        const buffer = Buffer.from(await paymentProofFile.arrayBuffer());
        const timestamp = Date.now();

        const response = await imagekit.upload({
          file: buffer,
          fileName: `payment_proof_${userId}_${timestamp}.${
            paymentProofFile.type.split("/")[1]
          }`,
          folder: "payments/proofs/",
        });

        paymentProofUrl = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1200" },
          ],
        });
      } catch (uploadError) {
        console.error("Payment proof upload error:", uploadError);
        return NextResponse.json(
          {
            error: "Failed to upload payment proof",
          },
          { status: 500 }
        );
      }
    }

    // Determine initial order status
    let orderStatus;
    if (paymentMethod === "COD") {
      orderStatus = "PENDING";
    } else if (paymentMethod === "BANK_TRANSFER") {
      orderStatus = hasManualVerification
        ? "PAYMENT_SUBMITTED"
        : "PAYMENT_SUBMITTED";
    } else {
      orderStatus = "PAYMENT_PENDING"; // For STRIPE
    }

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: orderStatus,
          paymentMethod,
          paymentProof: paymentProofUrl,
          paymentReference,
          address: JSON.stringify(address),
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  deliveryType: true,
                  requiresApproval: true,
                },
              },
            },
          },
        },
      });

      return newOrder;
    });

    // Trigger appropriate Inngest events based on payment method and delivery type
    if (paymentMethod === "COD" && hasAutoDelivery) {
      // Trigger auto-delivery with delay for COD orders
      await inngest.send({
        name: "gift-card/auto-delivery",
        data: {
          orderId: order.id,
          userId: order.userId,
        },
      });
    }

    // Note: For BANK_TRANSFER with manual verification,
    // codes will be delivered after admin approves payment

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        order: {
          id: order.id,
          orderNumber: order.id.substring(0, 8).toUpperCase(),
          status: order.status,
          totalPrice: order.totalPrice,
          paymentMethod: order.paymentMethod,
          itemCount: order.items.length,
          nextSteps: getNextSteps(
            order.status,
            paymentMethod,
            hasManualVerification
          ),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to provide next steps based on order status
 */
function getNextSteps(status, paymentMethod, hasManualVerification) {
  if (paymentMethod === "COD") {
    return "Your gift codes will be delivered within 5-10 minutes after verification.";
  } else if (paymentMethod === "BANK_TRANSFER") {
    if (hasManualVerification) {
      return "Your payment is being verified. Codes will be delivered after admin approval (usually within 2-4 hours).";
    } else {
      return "Your payment is being verified. Codes will be delivered automatically after verification.";
    }
  } else if (paymentMethod === "STRIPE") {
    return "Please complete the payment to receive your gift codes.";
  }
  return "Your order is being processed.";
}
