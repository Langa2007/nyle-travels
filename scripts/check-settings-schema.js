import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL_NEON || process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  ssl: { require: true, rejectUnauthorized: false },
});

async function checkSchema() {
  try {
    const res = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'app_settings'
    `);
    console.log('Columns in app_settings:');
    res.rows.forEach(row => console.log(`- ${row.column_name}: ${row.data_type}`));
    
    const countRes = await pool.query('SELECT count(*) FROM app_settings');
    console.log('Total rows:', countRes.rows[0].count);
    
    const sampleRes = await pool.query('SELECT * FROM app_settings LIMIT 5');
    console.log('Sample data:', JSON.stringify(sampleRes.rows, null, 2));
    
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

checkSchema();
