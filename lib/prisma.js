import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { withOptimize } from "@prisma/extension-optimize";

import ws from "ws";
neonConfig.webSocketConstructor = ws;

// To work in edge environments (Cloudflare Workers, Vercel Edge, etc.), enable querying over fetch
neonConfig.poolQueryViaFetch = true;

// Type definitions
// declare global {var prisma: PrismaClient | undefined;}

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaNeon({ connectionString });
const basePrisma = global.prisma || new PrismaClient({ adapter });

// Add Prisma Optimize extension for query performance monitoring
const prisma = basePrisma.$extends(
  withOptimize({ apiKey: process.env.OPTIMIZE_API_KEY })
);

if (process.env.NODE_ENV === "development") global.prisma = basePrisma;

export default prisma;

//
