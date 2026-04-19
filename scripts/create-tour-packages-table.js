import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTableSQL = `
CREATE TABLE IF NOT EXISTS tour_packages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  destination_id uuid REFERENCES destinations(id),
  name varchar(255) NOT NULL,
  slug varchar(255) UNIQUE NOT NULL,
  package_code varchar(50) UNIQUE NOT NULL,
  duration_days integer NOT NULL,
  duration_nights integer NOT NULL,
  difficulty_level varchar(50),
  group_size_min integer DEFAULT 1,
  group_size_max integer DEFAULT 20,
  private_tour_available boolean DEFAULT false,
  private_tour_price decimal(10,2),
  description text,
  short_description varchar(500),
  highlights text[],
  included_items text[],
  excluded_items text[],
  what_to_bring text[],
  physical_rating integer,
  cultural_rating integer,
  wildlife_rating integer,
  adventure_rating integer,
  luxury_rating integer,
  base_price decimal(10,2) NOT NULL,
  price_currency varchar(3) DEFAULT 'KES',
  discount_percentage decimal(5,2) DEFAULT 0,
  featured_image varchar(500),
  gallery_images text[],
  video_url varchar(500),
  cancellation_policy text,
  terms_conditions text,
  min_age integer DEFAULT 0,
  max_age integer,
  health_requirements text,
  meta_title varchar(255),
  meta_description text,
  meta_keywords text[],
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  booking_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
`;

async function createTourPackagesTable() {
  try {
    console.log('Creating tour_packages table...');

    await pool.query(createTableSQL);
    console.log('✅ tour_packages table created successfully');

    // Verify table exists
    const result = await pool.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'tour_packages';
    `);

    if (result.rows.length > 0) {
      console.log('✅ Verified: tour_packages table exists');
    } else {
      console.log('❌ Table creation verification failed');
    }

  } catch (error) {
    console.error('❌ Error creating table:', error);
  } finally {
    await pool.end();
  }
}

createTourPackagesTable();