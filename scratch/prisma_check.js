import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDb() {
  try {
    console.log('Checking database tables with Prisma...');
    
    const hotelsCount = await prisma.hotel.count();
    console.log(`Hotels count: ${hotelsCount}`);
    
    const destinationsCount = await prisma.destination.count();
    console.log(`Destinations count: ${destinationsCount}`);
    
    const settingsCount = await prisma.appSetting.count();
    console.log(`Settings count: ${settingsCount}`);
    
    const heroSettings = await prisma.appSetting.findUnique({
      where: { key: 'hero_sections' }
    });
    
    console.log('Hero Settings found:', !!heroSettings);
    if (heroSettings) {
      console.log('Hero Settings Value (first slide):', JSON.stringify(heroSettings.value[0], null, 2));
    }
    
  } catch (error) {
    console.error('Prisma DB Check Error:', error.message);
    if (error.code === 'P2021') {
      console.error('Table does not exist in the database!');
    }
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
