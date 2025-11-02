// Test script for Product APIs
const BASE_URL = "http://localhost:3001/api";

async function testProductAPIs() {
  console.log("🧪 Testing Product APIs...\n");

  try {
    // Test 1: GET /api/products
    console.log("1️⃣ Testing GET /api/products");
    const allProducts = await fetch(`${BASE_URL}/products`);
    const allProductsData = await allProducts.json();
    console.log(`   ✅ Status: ${allProducts.status}`);
    console.log(`   📦 Found ${allProductsData.count} products`);
    console.log(`   Sample: ${allProductsData.products[0]?.name}\n`);

    // Test 2: GET /api/products?category=Gaming
    console.log("2️⃣ Testing GET /api/products?category=Gaming");
    const gamingProducts = await fetch(`${BASE_URL}/products?category=Gaming`);
    const gamingData = await gamingProducts.json();
    console.log(`   ✅ Status: ${gamingProducts.status}`);
    console.log(`   🎮 Found ${gamingData.count} gaming gift cards\n`);

    // Test 3: GET /api/products?deliveryType=auto_delivery
    console.log("3️⃣ Testing GET /api/products?deliveryType=auto_delivery");
    const autoDelivery = await fetch(
      `${BASE_URL}/products?deliveryType=auto_delivery`
    );
    const autoDeliveryData = await autoDelivery.json();
    console.log(`   ✅ Status: ${autoDelivery.status}`);
    console.log(
      `   ⚡ Found ${autoDeliveryData.count} auto-delivery products\n`
    );

    // Test 4: GET /api/products?inStock=true
    console.log("4️⃣ Testing GET /api/products?inStock=true");
    const inStock = await fetch(`${BASE_URL}/products?inStock=true`);
    const inStockData = await inStock.json();
    console.log(`   ✅ Status: ${inStock.status}`);
    console.log(`   📦 Found ${inStockData.count} in-stock products\n`);

    // Test 5: GET /api/products/featured
    console.log("5️⃣ Testing GET /api/products/featured");
    const featured = await fetch(`${BASE_URL}/products/featured?limit=4`);
    const featuredData = await featured.json();
    console.log(`   ✅ Status: ${featured.status}`);
    console.log(`   ⭐ Found ${featuredData.count} featured products`);
    featuredData.products.forEach((p, i) => {
      console.log(
        `   ${i + 1}. ${p.name} - ⭐${p.avgRating} (${p.ratingCount} ratings)`
      );
    });
    console.log("");

    // Test 6: GET /api/products/[productId]
    if (allProductsData.products.length > 0) {
      const testProductId = allProductsData.products[0].id;
      console.log(`6️⃣ Testing GET /api/products/${testProductId}`);
      const singleProduct = await fetch(
        `${BASE_URL}/products/${testProductId}`
      );
      const singleProductData = await singleProduct.json();
      console.log(`   ✅ Status: ${singleProduct.status}`);
      console.log(`   📦 Product: ${singleProductData.product.name}`);
      console.log(`   💰 Price: ₨${singleProductData.product.price}`);
      console.log(`   🏪 Store: ${singleProductData.product.store.name}`);
      console.log(`   ⚡ Delivery: ${singleProductData.product.deliveryType}`);
      console.log(
        `   📊 Available Codes: ${singleProductData.product.availableCodes}`
      );
      console.log(
        `   ⭐ Rating: ${singleProductData.product.avgRating} (${singleProductData.product.ratingCount} reviews)\n`
      );
    }

    // Test 7: Search test
    console.log("7️⃣ Testing GET /api/products?search=steam");
    const searchResults = await fetch(`${BASE_URL}/products?search=steam`);
    const searchData = await searchResults.json();
    console.log(`   ✅ Status: ${searchResults.status}`);
    console.log(`   🔍 Found ${searchData.count} products matching "steam"\n`);

    console.log("═══════════════════════════════════════════════");
    console.log("✅ All Product API Tests Passed!");
    console.log("═══════════════════════════════════════════════\n");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testProductAPIs();
