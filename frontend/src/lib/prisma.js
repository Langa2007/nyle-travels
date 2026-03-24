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
    globalForPrisma.prisma = new PrismaClient();
  }
  prisma = globalForPrisma.prisma;
}

export default prisma;
