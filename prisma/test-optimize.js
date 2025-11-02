require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { withOptimize } = require("@prisma/extension-optimize");

async function testOptimize() {
  console.log("🔍 Testing Prisma Optimize Integration...\n");

  try {
    // Create Prisma Client with Optimize extension
    const basePrisma = new PrismaClient();
    const prisma = basePrisma.$extends(
      withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
    );

    console.log("✅ Prisma Client created with Optimize extension");
    console.log(
      "✅ API Key configured:",
      process.env.OPTIMIZE_API_KEY ? "Yes" : "No\n"
    );

    // Test query 1: Simple count
    console.log("📊 Running test query 1: Count all products...");
    const productCount = await prisma.product.count();
    console.log(`   Found ${productCount} products\n`);

    // Test query 2: Query with relations
    console.log("📊 Running test query 2: Fetch products with store info...");
    const products = await prisma.product.findMany({
      where: {
        inStock: true,
      },
      include: {
        store: true,
      },
      take: 3,
    });
    console.log(
      `   Fetched ${products.length} products with store relations\n`
    );

    // Test query 3: Aggregation
    console.log("📊 Running test query 3: Aggregate product prices...");
    const priceStats = await prisma.product.aggregate({
      _avg: { price: true },
      _max: { price: true },
      _min: { price: true },
    });
    console.log(`   Average Price: ₨${priceStats._avg.price?.toFixed(2)}`);
    console.log(`   Max Price: ₨${priceStats._max.price}`);
    console.log(`   Min Price: ₨${priceStats._min.price}\n`);

    // Test query 4: Complex filter
    console.log("📊 Running test query 4: Filter by delivery type...");
    const autoDeliveryProducts = await prisma.product.findMany({
      where: {
        deliveryType: "auto_delivery",
        availableCodes: {
          gt: 0,
        },
      },
      select: {
        name: true,
        availableCodes: true,
        deliveryType: true,
      },
    });
    console.log(
      `   Found ${autoDeliveryProducts.length} auto-delivery products in stock`
    );
    autoDeliveryProducts.forEach((p) => {
      console.log(`   ⚡ ${p.name} - ${p.availableCodes} codes`);
    });
    console.log("");

    console.log("═══════════════════════════════════════════════");
    console.log("✅ Prisma Optimize Integration Successful!");
    console.log("═══════════════════════════════════════════════");
    console.log("\n📈 Performance Insights:");
    console.log("   • Query metrics are being sent to Prisma Optimize");
    console.log("   • Visit: https://optimize.prisma.io");
    console.log(
      "   • View query performance, slow queries, and recommendations"
    );
    console.log("\n💡 Benefits:");
    console.log("   • Real-time query performance monitoring");
    console.log("   • Identify slow queries and N+1 problems");
    console.log("   • Get optimization recommendations");
    console.log("   • Track database performance over time\n");

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    throw error;
  }
}

testOptimize().catch((e) => {
  console.error("❌ Error:", e);
  process.exit(1);
});
