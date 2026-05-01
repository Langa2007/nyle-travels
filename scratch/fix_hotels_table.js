import { query } from '../config/db.js';

const sql = `
CREATE TABLE IF NOT EXISTS public.hotels (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    destination_id uuid,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    hotel_type character varying(100),
    star_rating integer,
    description text,
    short_description character varying(500),
    address text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    check_in_time time without time zone DEFAULT '14:00:00'::time without time zone,
    check_out_time time without time zone DEFAULT '11:00:00'::time without time zone,
    amenities text[],
    room_types jsonb,
    featured_image character varying(500),
    gallery_images text[],
    contact_phone character varying(50),
    contact_email character varying(255),
    website character varying(255),
    price_per_night numeric(10,2),
    price_currency character varying(3) DEFAULT 'KES'::character varying,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT hotels_hotel_type_check CHECK (((hotel_type)::text = ANY ((ARRAY['luxury'::character varying, 'mid_range'::character varying, 'budget'::character varying, 'camp'::character varying, 'lodge'::character varying, 'resort'::character varying])::text[]))),
    CONSTRAINT hotels_star_rating_check CHECK (((star_rating >= 1) AND (star_rating <= 5)))
);
`;

async function setup() {
  try {
    await query(sql);
    console.log('Hotels table checked/created');
  } catch (err) {
    console.error('Error creating table:', err.message);
  } finally {
    process.exit(0);
  }
}

setup();
