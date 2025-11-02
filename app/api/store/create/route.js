import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/configs/imagekit";

/**
 * POST /api/store/create
 * Create a new gift card store
 */
export async function POST(request) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    // Check if the user already has a store
    const existingStore = await prisma.store.findFirst({
      where: { userId },
    });

    // If store exists, return its status
    if (existingStore) {
      return NextResponse.json(
        {
          success: true,
          message: "Store already exists",
          status: existingStore.status,
          storeId: existingStore.id,
        },
        { status: 200 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const name = formData.get("name");
    const username = formData.get("userName");
    const description = formData.get("description");
    const email = formData.get("email");
    const address = formData.get("address");
    const contact = formData.get("contact");
    const image = formData.get("image");

    // Validate required fields
    if (!name || !username || !description || !email || !address || !contact) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: [
            "name",
            "userName",
            "description",
            "email",
            "address",
            "contact",
          ],
        },
        { status: 400 }
      );
    }

    // Check if username is taken
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (isUsernameTaken) {
      return NextResponse.json(
        {
          error: "Username is already taken",
        },
        { status: 400 }
      );
    }

    // Upload logo to ImageKit if provided
    let logoUrl = "https://via.placeholder.com/200";
    if (image && image.size > 0) {
      try {
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
          file: buffer,
          fileName: `store_${username}_${Date.now()}.${
            image.type.split("/")[1]
          }`,
          folder: "stores/logos/",
        });

        logoUrl = imagekit.url({
          path: response.filePath,
          transformation: [
            { quality: "auto" },
            { format: "webp" },
            { width: "400" },
            { height: "400" },
          ],
        });
      } catch (uploadError) {
        console.error("ImageKit upload error:", uploadError);
        // Continue with placeholder if upload fails
      }
    }

    // Create store with pending status
    const store = await prisma.store.create({
      data: {
        userId,
        name,
        username: username.toLowerCase(),
        description,
        email,
        address,
        contact,
        logo: logoUrl,
        status: "pending", // Requires admin approval
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Store created successfully. Awaiting admin approval.",
        store: {
          id: store.id,
          name: store.name,
          username: store.username,
          status: store.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json(
      {
        error: "Failed to create store",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
