require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const { PrismaNeon } = require('@prisma/adapter-neon');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_NEON;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: "testgoogle@example.com" },
    });
    console.log("existingUser:", existingUser);
  } catch (error) {
    console.error("Prisma Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
test();
