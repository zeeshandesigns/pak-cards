import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";

// get dashboard data for seller (total products, total orders, total earnings)

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    // get all orders for seller
    const orders = await prisma.order.findMany({ where: { storeId: storeId } });

    // calculate all products with ratings for seller
    const products = await prisma.product.findMany({
      where: { storeId: storeId },
    });

    const ratings = await prisma.rating.findMany({
      where: { productId: { in: products.map((product) => product.id) } },
      include: { user: true, product: true },
    });

    const dashboardData = {
      ratings,
      totalOrders: orders.length,
      totalProducts: products.length,
      totalEarnings: Math.round(
        orders.reduce((acc, order) => acc + order.totalPrice, 0)
      ),
    };
    return NextResponse.json({ dashboardData });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
