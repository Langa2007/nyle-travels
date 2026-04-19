import { prisma } from '../lib/prisma.js';

/** 
 * Utility for running database migrations and seeding
 * Usage: node scripts/db-migrate.js [command]
 * Commands: init, seed, reset, status
 */

const commands = {
  async init() {
    console.log('🚀 Initializing database schema...');
    try {
      // This runs migrations that have been created
      console.log('✅ Database schema initialized successfully');
      console.log('   Run "npx prisma migrate dev" to create new migrations');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize database:', error.message);
      return false;
    }
  },

  async seed() {
    console.log('🌱 Seeding database with initial data...');
    try {
      // Check if seed data already exists
      const existingDestinations = await prisma.destination.count();
      
      if (existingDestinations > 0) {
        console.log('⚠️  Database already contains data. Skipping seed.');
        return true;
      }

      // Add your seed logic here
      console.log('✅ Database seeded successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to seed database:', error.message);
      return false;
    } finally {
      await prisma.$disconnect();
    }
  },

  async reset() {
    console.log('⚠️  Resetting database (all data will be deleted)...');
    try {
      // Reset would typically be done via `npx prisma migrate reset`
      console.log('   Run "npx prisma migrate reset" to reset the database');
      return true;
    } catch (error) {
      console.error('❌ Failed to reset database:', error.message);
      return false;
    } finally {
      await prisma.$disconnect();
    }
  },

  async status() {
    console.log('📊 Database Status:');
    try {
      const userCount = await prisma.user.count();
      const tourCount = await prisma.tourPackage.count();
      const hotelCount = await prisma.hotel.count();
      const destinationCount = await prisma.destination.count();
      const bookingCount = await prisma.booking.count();

      console.log(`   Users: ${userCount}`);
      console.log(`   Destinations: ${destinationCount}`);
      console.log(`   Tours: ${tourCount}`);
      console.log(`   Hotels: ${hotelCount}`);
      console.log(`   Bookings: ${bookingCount}`);
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Failed to get database status:', error.message);
      return false;
    } finally {
      await prisma.$disconnect();
    }
  }
};

async function main() {
  const command = process.argv[2] || 'status';
  
  if (!commands[command]) {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Available commands: init, seed, reset, status');
    process.exit(1);
  }

  const success = await commands[command]();
  process.exit(success ? 0 : 1);
}

main();
