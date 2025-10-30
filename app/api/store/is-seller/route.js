// check if the logged in user is a seller
import { auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// auth seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });
      
      if (!isSeller)
      {
          
          }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
