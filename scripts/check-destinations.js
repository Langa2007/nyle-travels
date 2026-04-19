import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const destinations = await prisma.destination.findMany();
    console.log(JSON.stringify(destinations, null, 2));
  } catch (error) {
    console.error('Error fetching destinations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
