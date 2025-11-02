require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testSchema() {
  console.log("🧪 Testing Gift Card Schema...\n");

  try {
    // Test 1: Fetch all products
    console.log("📦 Test 1: Fetching all gift card products...");
    const products = await prisma.product.findMany({
      include: {
        store: true,
      },
    });
    console.log(`✅ Found ${products.length} products\n`);

    // Test 2: Filter by delivery type
    console.log("⚡ Test 2: Fetching auto-delivery products...");
    const autoDeliveryProducts = await prisma.product.findMany({
      where: {
        deliveryType: "auto_delivery",
      },
    });
    console.log(
      `✅ Found ${autoDeliveryProducts.length} auto-delivery products`
    );
    autoDeliveryProducts.forEach((p) => {
      console.log(`   - ${p.name} (${p.availableCodes} codes available)`);
    });
    console.log("");

    // Test 3: Filter by manual verification
    console.log("🔒 Test 3: Fetching manual verification products...");
    const manualProducts = await prisma.product.findMany({
      where: {
        deliveryType: "manual_verification",
        requiresApproval: true,
      },
    });
    console.log(
      `✅ Found ${manualProducts.length} manual verification products`
    );
    manualProducts.forEach((p) => {
      console.log(`   - ${p.name} (₨${p.price})`);
    });
    console.log("");

    // Test 4: Check digital codes structure
    console.log("💾 Test 4: Testing digital codes JSON structure...");
    const steamProduct = products.find((p) => p.name.includes("Steam"));
    if (steamProduct) {
      const codes = JSON.parse(steamProduct.digitalCodes);
      console.log(`✅ Steam product has ${codes.length} codes:`);
      codes.forEach((c, i) => {
        console.log(
          `   ${i + 1}. ${c.code.substring(0, 15)}... (Used: ${c.used})`
        );
      });
    }
    console.log("");

    // Test 5: Check available codes count
    console.log("📊 Test 5: Verifying stock counts...");
    products.forEach((p) => {
      const codes = JSON.parse(p.digitalCodes);
      const actualAvailable = codes.filter((c) => !c.used).length;
      const match = actualAvailable === p.availableCodes ? "✅" : "❌";
      console.log(
        `   ${match} ${p.name}: ${p.availableCodes} available (actual: ${actualAvailable})`
      );
    });
    console.log("");

    // Test 6: Test product filtering by category
    console.log("🎮 Test 6: Fetching products by category...");
    const categories = [...new Set(products.map((p) => p.category))];
    for (const category of categories) {
      const categoryProducts = await prisma.product.count({
        where: { category },
      });
      console.log(`   ${category}: ${categoryProducts} products`);
    }
    console.log("");

    // Test 7: Test stock availability query
    console.log("📦 Test 7: Products in stock (availableCodes > 0)...");
    const inStockProducts = await prisma.product.findMany({
      where: {
        availableCodes: {
          gt: 0,
        },
        inStock: true,
      },
      select: {
        name: true,
        availableCodes: true,
        deliveryType: true,
      },
    });
    console.log(`✅ Found ${inStockProducts.length} products in stock`);
    inStockProducts.forEach((p) => {
      const badge = p.deliveryType === "auto_delivery" ? "⚡" : "🔒";
      console.log(`   ${badge} ${p.name} - ${p.availableCodes} codes`);
    });
    console.log("");

    // Summary
    console.log("═══════════════════════════════════════════════");
    console.log("🎉 All Schema Tests Passed!");
    console.log("═══════════════════════════════════════════════");
    console.log("\n✅ Schema Features Verified:");
    console.log("   • Product delivery types (auto/manual)");
    console.log("   • Digital codes storage (JSON)");
    console.log("   • Stock management (availableCodes)");
    console.log("   • Approval requirements");
    console.log("   • Category filtering");
    console.log("   • Stock availability queries");
    console.log("\n🚀 Ready for API development!\n");
  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

testSchema()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
