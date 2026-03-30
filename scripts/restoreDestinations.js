import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL_NEON || process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

const restoreDestinations = async () => {
  try {
    console.log('Restoring destinations table schema...');
    
    // Ensure table exists (Prisma push might have dropped it if not in schema)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS destinations (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        country VARCHAR(100) NOT NULL,
        region VARCHAR(100),
        description TEXT,
        short_description VARCHAR(500),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        best_time_to_visit TEXT,
        how_to_get_there TEXT,
        visa_requirements TEXT,
        health_safety TEXT,
        currency VARCHAR(50),
        languages TEXT[],
        timezone VARCHAR(100),
        featured_image VARCHAR(500),
        gallery_images TEXT[],
        meta_title VARCHAR(255),
        meta_description TEXT,
        meta_keywords TEXT[],
        is_featured BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        views_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Inserting destination data...');
    const sql = `
      INSERT INTO destinations (name, slug, country, region, description, best_time_to_visit, currency, languages, is_featured, latitude, longitude)
      VALUES 
      ('Maasai Mara National Reserve', 'maasai-mara', 'Kenya', 'Rift Valley', 'World-famous for the Great Migration and exceptional wildlife viewing.', 'July to October', 'KES', ARRAY['English', 'Swahili', 'Maa'], true, -1.4946, 35.1439),
      ('Diani Beach', 'diani-beach', 'Kenya', 'Coast', 'Pristine white sand beaches along the Indian Ocean with luxury resorts.', 'December to March', 'KES', ARRAY['English', 'Swahili'], true, -4.2770, 39.5946),
      ('Amboseli National Park', 'amboseli', 'Kenya', 'Rift Valley', 'Home to large elephant herds with stunning views of Mount Kilimanjaro.', 'June to October', 'KES', ARRAY['English', 'Swahili', 'Maa'], true, -2.6424, 37.2625),
      ('Lake Nakuru', 'lake-nakuru', 'Kenya', 'Rift Valley', 'Famous for flamingos and rhino sanctuary.', 'January to March', 'KES', ARRAY['English', 'Swahili'], true, -0.3031, 36.0800)
      ON CONFLICT (slug) DO NOTHING;
    `;
    
    await pool.query(sql);
    console.log('Destinations restored successfully!');
  } catch (err) {
    console.error('Destinations restoration error:', err);
  } finally {
    await pool.end();
  }
};

restoreDestinations();
