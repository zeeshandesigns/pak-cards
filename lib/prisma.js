import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { withOptimize } from "@prisma/extension-optimize";
import ws from "ws";

// Configure Neon
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

// Lazy initialization function
function getPrismaClient() {
  const globalForPrisma = globalThis;

  if (!globalForPrisma.prisma) {
    // Get connection string from environment (with fallback)
    const DATABASE_URL =
      process.env.DATABASE_URL ||
      "postgresql://neondb_owner:npg_ZtgoY0kIhR1C@ep-polished-wind-a44lwk8r-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
    const OPTIMIZE_API_KEY = process.env.OPTIMIZE_API_KEY;

    const adapter = new PrismaNeon({ connectionString: DATABASE_URL });
    const basePrisma = new PrismaClient({ adapter });

    // Add Prisma Optimize extension
    globalForPrisma.prisma = basePrisma.$extends(
      withOptimize({ apiKey: OPTIMIZE_API_KEY || "" })
    );
  }

  return globalForPrisma.prisma;
}

// Export as Proxy to lazy-load on first property access
const prisma = new Proxy(
  {},
  {
    get(target, prop) {
      const client = getPrismaClient();
      return client[prop];
    },
  }
);

export default prisma;

//
