import { PrismaClient } from "@prisma/client";

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
    const { Pool } = require('pg');
    const { PrismaPg } = require('@prisma/adapter-pg');
    
    const connectionString = process.env.DATABASE_URL_NEON || process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
