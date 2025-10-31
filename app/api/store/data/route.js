import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";

// get store info and store products

export async function GET(request) {
  try {
    // get store username from query params
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username").toLowerCase();

    if (!username) {
      return NextResponse.json({ error: "Missing Username" }, { status: 400 });
    }

    // get store info and instock products with ratings
    const store = await prisma.store.findUnique({
      where: { username, isActive: true },
      include: {
        products: { include: { ratings: true }, where: { inStock: true } },
      },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    return NextResponse.json({ store });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
