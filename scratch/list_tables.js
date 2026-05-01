import { query } from '../config/db.js';

async function listTables() {
  try {
    const res = await query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema', 'pg_catalog')");
    console.log('All tables in DB:', res.rows);
  } catch (err) {
    console.error('Error listing tables:', err.message);
  } finally {
    process.exit();
  }
}

listTables();
