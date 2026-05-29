import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const NEON_POOLER_URL =
  "postgresql://neondb_owner:npg_s9WljCPnZiT8@ep-wild-glade-alswwsa8-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require";

function getDbUrl() {
  const url =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_NEON ||
    process.env.DIRECT_URL;

  // Only use env var if it's a real postgres URL — not a prisma:// Accelerate proxy
  if (url && (url.startsWith("postgresql://") || url.startsWith("postgres://"))) {
    return url;
  }

  return NEON_POOLER_URL;
}

/** @type {PrismaClient} */
let prisma;

if (process.env.NEXT_PHASE === "phase-production-build") {
  prisma = null;
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      datasourceUrl: getDbUrl(),
    });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
