import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { withOptimize } from "@prisma/extension-optimize";
import ws from "ws";

// Configure Neon
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

// Singleton pattern
const globalForPrisma = globalThis;

if (!globalForPrisma.prisma) {
  const connectionString = process.env.DATABASE_URL;

  const adapter = new PrismaNeon({ connectionString });

  const basePrisma = new PrismaClient({ adapter }); // Add Prisma Optimize extension
  globalForPrisma.prisma = basePrisma.$extends(
    withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY || "" })
  );
}

const prisma = globalForPrisma.prisma;

export default prisma;

//
