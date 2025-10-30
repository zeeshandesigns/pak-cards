// stock toggle of a product in store
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID Missing" },
        { status: 400 }
      );
    }

    if (!storeId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // check if the product exists and belongs to the seller
    const product = await prisma.product.findFirst({
      where: { id: productId, storeId: storeId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product Not Found" }, { status: 404 });
    }

    await prisma.product.update({ 
      where: { id: productId },
      data: { inStock: !product.inStock },
    });
      
      return NextResponse.json(
        { message: "Stock Status Updated Successfully" },
        { status: 200 }
      );
      
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
