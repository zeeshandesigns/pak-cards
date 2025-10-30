import { auth, getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ImageKit from "imagekit";
import imageki from "@/configs/imagekit";
import next from "next";

// creating the store
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // get form data
    const formData = await request.formData();
    const name = formData.get("name");
    const userName = formData.get("userName");
    const description = formData.get("description");
    const email = formData.get("email");
    const address = formData.get("address");
    const image = formData.get("image");
    const contact = formData.get("contact");

    if (!name || !userName || !description || !email || !address || !contact) {
      return NextResponse.json(
        { error: "Missing Store Information" },
        { status: 400 }
      );
    }

    // check if the user already has a store
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // if store is already present, return status of the store
    if (store) {
      return NextResponse.json({ status: store.status }, { status: 200 });
    }

    // check if the userName is already taken
    const isUserNameTaken = await prisma.store.findFirst({
      where: { userName: userName.toLowerCase() },
    });
    if (isUserNameTaken) {
      return NextResponse.json(
        { error: "UserName is already taken" },
        { status: 400 }
      );
    }

    // uploading images to imagekit
    const imagesURL = await Promise.all(
      images.map(async (image) => {
        const buffer = buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: image.name,
          folder: "products/",
        });
        const url = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "1024" },
          ],
        });
        return url;
      })
    );

    await prisma.product.create({
      data: {
        name,
        description,
        mrp,
        images: imagesURL,
        price,
        category,
        storeId,
      },
    });

    return NextResponse.json(
      { message: "Product Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// get all products for a seller
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const storeId = await authSeller(userId);

    if (!storeId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    const products = await prisma.product.findMany({
      where: { storeId: storeId },
      orderBy: { createdAt: "desc" },
    });
      
      return NextResponse.json({ products }, { status: 200 });  
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
