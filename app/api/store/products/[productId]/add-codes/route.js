import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/lib/middlewares/authSeller";

/**
 * POST /api/store/products/[productId]/add-codes
 * Add more gift card codes to an existing product
 */
export async function POST(request, { params }) {
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

    // Get product and verify ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        {
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    if (product.storeId !== storeId) {
      return NextResponse.json(
        {
          error: "You don't have permission to modify this product",
        },
        { status: 403 }
      );
    }

    // Get new codes from request body
    const body = await request.json();
    const { codes } = body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return NextResponse.json(
        {
          error: "Codes array is required and must not be empty",
        },
        { status: 400 }
      );
    }

    // Parse existing digital codes
    const existingCodes = product.digitalCodes
      ? JSON.parse(product.digitalCodes)
      : [];

    // Format new codes
    const newCodes = codes.map((code) => ({
      code: typeof code === "string" ? code : code.code,
      used: false,
    }));

    // Check for duplicate codes
    const existingCodeStrings = existingCodes.map((c) => c.code);
    const duplicates = newCodes.filter((c) =>
      existingCodeStrings.includes(c.code)
    );

    if (duplicates.length > 0) {
      return NextResponse.json(
        {
          error: "Some codes already exist",
          duplicates: duplicates.map((c) => c.code),
        },
        { status: 400 }
      );
    }

    // Merge codes
    const updatedCodes = [...existingCodes, ...newCodes];
    const newAvailableCount = updatedCodes.filter((c) => !c.used).length;

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        digitalCodes: JSON.stringify(updatedCodes),
        availableCodes: newAvailableCount,
        inStock: newAvailableCount > 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully added ${newCodes.length} codes`,
        product: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          totalCodes: updatedCodes.length,
          availableCodes: newAvailableCount,
          addedCodes: newCodes.length,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding codes:", error);
    return NextResponse.json(
      {
        error: "Failed to add codes",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
