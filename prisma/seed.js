const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...\n");

  // Create a test user (store owner)
  const testUser = await prisma.user.upsert({
    where: { id: "user_test_123" },
    update: {},
    create: {
      id: "user_test_123",
      name: "Test Store Owner",
      email: "owner@pakcards.com",
      image: "https://via.placeholder.com/150",
    },
  });
  console.log("✅ Created test user:", testUser.name);

  // Create a test store
  const testStore = await prisma.store.upsert({
    where: { username: "pakcards-official" },
    update: {},
    create: {
      userId: testUser.id,
      name: "PakCards Official Store",
      username: "pakcards-official",
      description: "Official PakCards gift card marketplace",
      address: "Karachi, Pakistan",
      logo: "https://via.placeholder.com/200",
      email: "store@pakcards.com",
      contact: "+92-300-1234567",
      status: "approved",
      isActive: true,
    },
  });
  console.log("✅ Created test store:", testStore.name, "\n");

  // Sample gift card codes for different products
  const steamCodes = [
    { code: "STEAM-1000-XXXX-YYYY-ZZZZ", used: false, orderId: null },
    { code: "STEAM-1000-AAAA-BBBB-CCCC", used: false, orderId: null },
    { code: "STEAM-1000-DDDD-EEEE-FFFF", used: false, orderId: null },
  ];

  const playstationCodes = [
    { code: "PSN-5000-XXXX-YYYY-ZZZZ", used: false, orderId: null },
    { code: "PSN-5000-AAAA-BBBB-CCCC", used: false, orderId: null },
  ];

  const netflixCodes = [
    { code: "NETFLIX-500-XXXX-YYYY", used: false, orderId: null },
    { code: "NETFLIX-500-AAAA-BBBB", used: false, orderId: null },
    { code: "NETFLIX-500-CCCC-DDDD", used: false, orderId: null },
    { code: "NETFLIX-500-EEEE-FFFF", used: false, orderId: null },
  ];

  const amazonCodes = [
    { code: "AMZN-10000-XXXX-YYYY-ZZZZ", used: false, orderId: null },
  ];

  // Create gift card products
  const products = [
    {
      name: "Steam Wallet ₨1000",
      description:
        "₨1000 Steam Wallet Code - Instant delivery within 10 minutes after payment verification. Use to purchase games, software, and other content on Steam platform.",
      mrp: 1200,
      price: 1000,
      category: "Gaming",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
        "https://via.placeholder.com/500x500?text=Steam+Gift+Card",
      ],
      deliveryType: "auto_delivery",
      requiresApproval: false,
      digitalCodes: JSON.stringify(steamCodes),
      stockType: "limited",
      availableCodes: steamCodes.length,
    },
    {
      name: "PlayStation Store ₨5000",
      description:
        "₨5000 PlayStation Store Gift Card - Manual verification required (usually within 2-4 hours). Can be used to purchase games, add-ons, and subscriptions on PlayStation Store.",
      mrp: 5500,
      price: 5000,
      category: "Gaming",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/0/00/PlayStation_logo.svg",
        "https://via.placeholder.com/500x500?text=PlayStation+Gift+Card",
      ],
      deliveryType: "manual_verification",
      requiresApproval: true,
      digitalCodes: JSON.stringify(playstationCodes),
      stockType: "limited",
      availableCodes: playstationCodes.length,
    },
    {
      name: "Netflix Premium ₨500/Month",
      description:
        "Netflix Premium 1 Month Subscription Code - Instant delivery. Enjoy unlimited movies and TV shows on 4 screens in Ultra HD.",
      mrp: 600,
      price: 500,
      category: "Entertainment",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
        "https://via.placeholder.com/500x500?text=Netflix+Gift+Card",
      ],
      deliveryType: "auto_delivery",
      requiresApproval: false,
      digitalCodes: JSON.stringify(netflixCodes),
      stockType: "limited",
      availableCodes: netflixCodes.length,
    },
    {
      name: "Amazon Gift Card ₨10000",
      description:
        "₨10,000 Amazon Gift Card - Manual verification required due to high value (2-6 hours). Can be used to purchase any products on Amazon.com.",
      mrp: 10500,
      price: 10000,
      category: "Shopping",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        "https://via.placeholder.com/500x500?text=Amazon+Gift+Card",
      ],
      deliveryType: "manual_verification",
      requiresApproval: true,
      digitalCodes: JSON.stringify(amazonCodes),
      stockType: "limited",
      availableCodes: amazonCodes.length,
    },
    {
      name: "Spotify Premium ₨300/Month",
      description:
        "Spotify Premium 1 Month Code - Instant delivery. Ad-free music, offline listening, and unlimited skips.",
      mrp: 350,
      price: 300,
      category: "Entertainment",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
        "https://via.placeholder.com/500x500?text=Spotify+Gift+Card",
      ],
      deliveryType: "auto_delivery",
      requiresApproval: false,
      digitalCodes: JSON.stringify([
        { code: "SPOTIFY-300-XXXX-YYYY", used: false, orderId: null },
        { code: "SPOTIFY-300-AAAA-BBBB", used: false, orderId: null },
      ]),
      stockType: "limited",
      availableCodes: 2,
    },
    {
      name: "Google Play ₨2000",
      description:
        "₨2000 Google Play Gift Card - Instant delivery. Use for apps, games, music, movies, and more on Google Play Store.",
      mrp: 2200,
      price: 2000,
      category: "Shopping",
      images: [
        "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
        "https://via.placeholder.com/500x500?text=Google+Play+Gift+Card",
      ],
      deliveryType: "auto_delivery",
      requiresApproval: false,
      digitalCodes: JSON.stringify([
        { code: "GPLAY-2000-XXXX-YYYY-ZZZZ", used: false, orderId: null },
        { code: "GPLAY-2000-AAAA-BBBB-CCCC", used: false, orderId: null },
        { code: "GPLAY-2000-DDDD-EEEE-FFFF", used: false, orderId: null },
      ]),
      stockType: "limited",
      availableCodes: 3,
    },
  ];

  console.log("Creating gift card products...\n");

  for (const productData of products) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        storeId: testStore.id,
      },
    });

    const deliveryBadge =
      product.deliveryType === "auto_delivery"
        ? "⚡ Auto-Delivery"
        : "🔒 Manual Verification";

    console.log(`✅ Created: ${product.name}`);
    console.log(`   Price: ₨${product.price} (was ₨${product.mrp})`);
    console.log(`   Type: ${deliveryBadge}`);
    console.log(`   Stock: ${product.availableCodes} codes available`);
    console.log("");
  }

  console.log("\n🎉 Seed completed successfully!");
  console.log(`\n📊 Summary:`);
  console.log(`   - Total Products: ${products.length}`);
  console.log(
    `   - Auto-Delivery: ${
      products.filter((p) => p.deliveryType === "auto_delivery").length
    }`
  );
  console.log(
    `   - Manual Verification: ${
      products.filter((p) => p.deliveryType === "manual_verification").length
    }`
  );
  console.log(
    `   - Total Codes Available: ${products.reduce(
      (sum, p) => sum + p.availableCodes,
      0
    )}`
  );
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
