import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/lib/middlewares/authSeller";

/**
 * GET /api/store/products
 * Get all products for the authenticated seller's store
 */
export async function GET(request) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Check if user has approved store
    const storeId = await authSeller(userId);
    if (!storeId) {
      return NextResponse.json(
        {
          error: "You need an approved store to view products",
        },
        { status: 403 }
      );
    }

    // Fetch products with ratings
    const products = await prisma.product.findMany({
      where: { storeId },
      include: {
        rating: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate metrics for each product
    const productsWithMetrics = products.map((product) => {
      const ratings = product.rating;
      const avgRating =
        ratings.length > 0
          ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length
          : 0;

      // Parse digital codes to get actual available count
      const digitalCodes = product.digitalCodes
        ? JSON.parse(product.digitalCodes)
        : [];
      const actualAvailableCodes = digitalCodes.filter((c) => !c.used).length;

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        mrp: product.mrp,
        images: product.images,
        inStock: product.inStock,
        deliveryType: product.deliveryType,
        requiresApproval: product.requiresApproval,
        availableCodes: product.availableCodes,
        actualAvailableCodes, // For verification
        stockType: product.stockType,
        createdAt: product.createdAt,
        avgRating: Math.round(avgRating * 10) / 10,
        ratingCount: ratings.length,
      };
    });

    return NextResponse.json(
      {
        success: true,
        count: productsWithMetrics.length,
        products: productsWithMetrics,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching store products:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch products",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
