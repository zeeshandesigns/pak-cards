import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import authSeller from "@/lib/middlewares/authSeller";
import imagekit from "@/configs/imagekit";

/**
 * POST /api/store/products/create
 * Create a new gift card product
 */
export async function POST(request) {
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
          error: "You need an approved store to create products",
        },
        { status: 403 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const category = formData.get("category");
    const mrp = parseFloat(formData.get("mrp"));
    const price = parseFloat(formData.get("price"));
    const deliveryType = formData.get("deliveryType") || "auto_delivery";
    const requiresApproval = formData.get("requiresApproval") === "true";
    const digitalCodesJson = formData.get("digitalCodes"); // JSON string of codes

    // Get images (up to 4)
    const images = [];
    for (let i = 1; i <= 4; i++) {
      const image = formData.get(`image${i}`);
      if (image && image.size > 0) {
        images.push(image);
      }
    }

    // Validate required fields
    if (
      !name ||
      !description ||
      !category ||
      !mrp ||
      !price ||
      images.length === 0
    ) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: [
            "name",
            "description",
            "category",
            "mrp",
            "price",
            "at least 1 image",
          ],
        },
        { status: 400 }
      );
    }

    // Parse and validate digital codes
    let digitalCodes = [];
    try {
      if (digitalCodesJson) {
        const parsed = JSON.parse(digitalCodesJson);
        digitalCodes = parsed.map((code) => ({
          code: typeof code === "string" ? code : code.code,
          used: false,
        }));
      }
    } catch (e) {
      return NextResponse.json(
        {
          error:
            "Invalid digital codes format. Expected JSON array of strings or objects with 'code' property",
        },
        { status: 400 }
      );
    }

    if (digitalCodes.length === 0) {
      return NextResponse.json(
        {
          error: "At least one gift card code is required",
        },
        { status: 400 }
      );
    }

    // Upload images to ImageKit
    const imageUrls = [];
    for (let i = 0; i < images.length; i++) {
      try {
        const image = images[i];
        const buffer = Buffer.from(await image.arrayBuffer());
        const timestamp = Date.now();

        const response = await imagekit.upload({
          file: buffer,
          fileName: `product_${name.replace(/\s+/g, "_")}_${timestamp}_${
            i + 1
          }.${image.type.split("/")[1]}`,
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

        imageUrls.push(url);
      } catch (uploadError) {
        console.error(`Error uploading image ${i + 1}:`, uploadError);
        // Continue with other images
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to upload product images",
        },
        { status: 500 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        storeId,
        name,
        description,
        category,
        mrp,
        price,
        images: imageUrls,
        inStock: true,
        deliveryType,
        requiresApproval,
        digitalCodes: JSON.stringify(digitalCodes),
        availableCodes: digitalCodes.length,
        stockType: "digital",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Gift card product created successfully",
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          availableCodes: product.availableCodes,
          deliveryType: product.deliveryType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      {
        error: "Failed to create product",
        message: error.message,
      },
      { status: 500 }
    );
  }
}
