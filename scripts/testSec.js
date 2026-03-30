import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new pkg.Pool({
  connectionString: process.env.DATABASE_URL_NEON || process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

async function verify() {
  try {
    console.log('--- TEST 1: Attempting to DELETE from app_settings ---');
    await pool.query("DELETE FROM app_settings WHERE key = 'hero_sections'");
    console.log('❌ FAILURE: Delete was successfully executed! Trigger failed.');
  } catch(err) {
    if(err.message.includes('prohibited')) {
       console.log('✅ SUCCESS: Delete was blocked intentionally by the DB Trigger.');
    } else {
       console.log('❌ ERROR:', err.message);
    }
  }

  try {
    console.log('\n--- TEST 2: Attempting to DROP the protected table ---');
    await pool.query("DROP TABLE IF EXISTS app_settings CASCADE");
    console.log('❌ FAILURE: Drop table was successfully executed! Security trigger failed.');
  } catch(err) {
    if(err.message.includes('prohibited') || err.message.includes('BLOCKED')) {
       console.log('✅ SUCCESS: Drop Table was blocked intentionally by the DB Event Trigger.');
    } else {
       console.log('❌ ERROR:', err.message);
    }
  }

  await pool.end();
}

verify();
