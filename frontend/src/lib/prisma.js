import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

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
    neonConfig.webSocketConstructor = ws;
    const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_NEON;
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
    
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
