import pkg from 'pg';
const { Pool } = pkg;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

const dbName = process.env.DB_NAME;
const adminDb = process.env.DB_ADMIN_DB || 'postgres';

const escapeIdentifier = (value) => `"${String(value).replace(/"/g, '""')}"`;

const setupDatabase = async () => {
  let pool;
  try {
    console.log(' Using connection string for database setup...');

    console.log(' Using connection string for database setup...');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL_NEON || process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    });
    console.log(' Connected to pool');

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    await pool.query(schema);
    console.log(' Database schema created successfully');

    // Create indexes (if not in schema)
    console.log(' Creating indexes...');

    // Additional indexes for performance
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_bookings_user_status ON bookings(user_id, booking_status)',
      'CREATE INDEX IF NOT EXISTS idx_bookings_dates_status ON bookings(start_date, end_date, booking_status)',
      'CREATE INDEX IF NOT EXISTS idx_tour_packages_price ON tour_packages(base_price)',
      'CREATE INDEX IF NOT EXISTS idx_tour_packages_duration ON tour_packages(duration_days)',
      'CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating)',
      'CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)'
    ];

    for (const index of indexes) {
      await pool.query(index);
    }

    console.log(' Indexes created successfully');

    console.log(' Database setup complete!');
  } catch (error) {
    console.error(' Database setup failed:', error);
  } finally {
    if (pool) {
      await pool.end();
    }
  }
};

setupDatabase();
