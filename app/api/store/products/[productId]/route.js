import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/lib/middlewares/authSeller";

/**
 * PATCH /api/store/products/[productId]
 * Update product details
 */
export async function PATCH(request, { params }) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const { productId } = await params;

    if (!productId) {
      return NextResponse.json(
        {
          error: "Product ID is required",
        },
        { status: 400 }
      );
    }

    // Check if user has approved store
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json(
        {
          error: "You need an approved store",
        },
        { status: 403 }
      );
    }

    // Verify product belongs to seller's store
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
      select: { storeId: true },
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    if (existingProduct.storeId !== storeId) {
      return NextResponse.json(
        {
          error: "You don't have permission to update this product",
        },
        { status: 403 }
      );
    }

    // Get update data
    const body = await request.json();
    const updateData = {};

    // Only update allowed fields
    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "mrp",
      "inStock",
      "deliveryType",
      "requiresApproval",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Validate price if updating
    if (updateData.price && updateData.price < 0) {
      return NextResponse.json(
        {
          error: "Price must be positive",
        },
        { status: 400 }
      );
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error: "No valid fields to update",
        },
        { status: 400 }
      );
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          price: updatedProduct.price,
          inStock: updatedProduct.inStock,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      {
        error: "Failed to update product",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
