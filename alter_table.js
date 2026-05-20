import { query } from './config/db.js';

async function main() {
  try {
    await query(`ALTER TABLE tour_packages ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'tour'`);
    console.log('Successfully added type column to tour_packages table');
  } catch (error) {
    console.error('Failed to alter table:', error);
  }
  process.exit(0);
}

main();
