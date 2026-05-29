import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

const globalForPrisma = globalThis;

// The DIRECT_URL must be a postgresql:// URL (not prisma:// Accelerate proxy)
const FALLBACK_DB_URL = "postgresql://neondb_owner:npg_s9WljCPnZiT8@ep-wild-glade-alswwsa8-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require";

function getDirectPostgresUrl() {
  const candidates = [
    process.env.DIRECT_URL,
    process.env.DATABASE_URL_NEON,
    process.env.DATABASE_URL,
  ];

  for (const url of candidates) {
    if (url && url.startsWith("postgresql://")) {
      return url;
    }
    if (url && url.startsWith("postgres://")) {
      return url;
    }
  }

  // All env vars are missing or are prisma:// Accelerate URLs — use hardcoded fallback
  return FALLBACK_DB_URL;
}

/**
 * @type {PrismaClient}
 */
let prisma;

if (process.env.NEXT_PHASE === 'phase-production-build') {
  // During build phase, we don't want to initialize Prisma
  prisma = null;
} else {
  if (!globalForPrisma.prisma) {
    neonConfig.webSocketConstructor = ws;
    const connectionString = getDirectPostgresUrl();
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);

    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
