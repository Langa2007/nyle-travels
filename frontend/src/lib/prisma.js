import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis;

/**
 * @type {PrismaClient}
 */
let prisma;

if (process.env.NEXT_PHASE === 'phase-production-build') {
  // During build phase, we don't want to initialize Prisma
  prisma = null;
} else {
  if (!globalForPrisma.prisma) {
    const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_NEON;
    const pool = new pg.Pool({ 
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
