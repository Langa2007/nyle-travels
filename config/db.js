import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pkg;

const connectionString =
  process.env.DATABASE_URL_NEON ||
  process.env.DATABASE_URL_LOCAL ||
  process.env.DATABASE_URL;

if (!connectionString) {
  console.error(" Missing all database URLs in environment");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

// Ensure 'public' schema is always used
pool.on("connect", (client) => {
  client.query('SET search_path TO public');
  console.log(" Default schema set to 'public'");
});

pool.query("SELECT current_database()", (err, res) => {
  if (err) {
    console.error(" DB Connection Error:", err.message);
  } else {
    console.log(" Connected to DB:", res?.rows?.[0]);
  }
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log(" PostgreSQL connection successful!");
    client.release();
  } catch (err) {
    console.error(" Database connection error:", err.message);
    process.exit(1);
  }
};

export const testConnection = connectDB;

/**
 * Execute a query with the pool
 * @param {string} text - The SQL query
 * @param {Array} params - The parameters for the query
 * @returns {Promise} - The result of the query
 */
export const query = (text, params) => pool.query(text, params);

/**
 * Run a database transaction
 * @param {Function} callback - The logic to execute within the transaction
 * @returns {Promise} - The result of the transaction
 */
export const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export { pool };
export default pool;
