-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    nationality VARCHAR(100),
    passport_number VARCHAR(50),
    passport_expiry DATE,
    profile_image VARCHAR(500),
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'guide', 'partner')),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret TEXT,
    refresh_token TEXT,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMP,
    email_verification_token TEXT,
    last_login TIMESTAMP,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Destinations table (e.g., Masai Mara, Diani Beach)
CREATE TABLE destinations (
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

-- Tour packages table
CREATE TABLE tour_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID REFERENCES destinations(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    package_code VARCHAR(50) UNIQUE NOT NULL,
    duration_days INTEGER NOT NULL,
    duration_nights INTEGER NOT NULL,
    difficulty_level VARCHAR(50) CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'difficult')),
    group_size_min INTEGER DEFAULT 1,
    group_size_max INTEGER DEFAULT 20,
    private_tour_available BOOLEAN DEFAULT FALSE,
    private_tour_price DECIMAL(10, 2),
    description TEXT,
    short_description VARCHAR(500),
    highlights TEXT[],
    included_items TEXT[],
    excluded_items TEXT[],
    what_to_bring TEXT[],
    physical_rating INTEGER CHECK (physical_rating BETWEEN 1 AND 5),
    cultural_rating INTEGER CHECK (cultural_rating BETWEEN 1 AND 5),
    wildlife_rating INTEGER CHECK (wildlife_rating BETWEEN 1 AND 5),
    adventure_rating INTEGER CHECK (adventure_rating BETWEEN 1 AND 5),
    luxury_rating INTEGER CHECK (luxury_rating BETWEEN 1 AND 5),
    base_price DECIMAL(10, 2) NOT NULL,
    price_currency VARCHAR(3) DEFAULT 'KES',
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    featured_image VARCHAR(500),
    gallery_images TEXT[],
    video_url VARCHAR(500),
    cancellation_policy TEXT,
    terms_conditions TEXT,
    min_age INTEGER DEFAULT 0,
    max_age INTEGER,
    health_requirements TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT[],
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INTEGER DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily itinerary for tours
CREATE TABLE tour_itineraries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_package_id UUID REFERENCES tour_packages(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    accommodation_type VARCHAR(100),
    accommodation_name VARCHAR(255),
    accommodation_description TEXT,
    meals_included TEXT[],
    activities TEXT[],
    distance_traveled DECIMAL(10, 2),
    travel_time INTEGER, -- in minutes
    elevation_gain INTEGER, -- in meters
    highlights TEXT[],
    images TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tour_package_id, day_number)
);

-- Hotels/Accommodations
CREATE TABLE hotels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID REFERENCES destinations(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    hotel_type VARCHAR(100) CHECK (hotel_type IN ('luxury', 'mid_range', 'budget', 'camp', 'lodge', 'resort')),
    star_rating INTEGER CHECK (star_rating BETWEEN 1 AND 5),
    description TEXT,
    short_description VARCHAR(500),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    check_in_time TIME DEFAULT '14:00',
    check_out_time TIME DEFAULT '11:00',
    amenities TEXT[],
    room_types JSONB,
    featured_image VARCHAR(500),
    gallery_images TEXT[],
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    website VARCHAR(255),
    price_per_night DECIMAL(10, 2),
    price_currency VARCHAR(3) DEFAULT 'KES',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tour availability & pricing (dynamic pricing)
CREATE TABLE tour_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_package_id UUID REFERENCES tour_packages(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    available_slots INTEGER DEFAULT 0,
    total_slots INTEGER NOT NULL,
    special_price DECIMAL(10, 2),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tour_package_id, start_date)
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    tour_package_id UUID REFERENCES tour_packages(id),
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    number_of_adults INTEGER NOT NULL,
    number_of_children INTEGER DEFAULT 0,
    children_ages INTEGER[],
    special_requests TEXT,
    dietary_requirements TEXT,
    medical_conditions TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    emergency_contact_relation VARCHAR(100),
    
    -- Pricing
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'partial', 'paid', 'refunded', 'cancelled')),
    payment_method VARCHAR(50),
    payment_intent_id VARCHAR(255),
    
    -- Status
    booking_status VARCHAR(50) DEFAULT 'confirmed' CHECK (booking_status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    
    -- Additional
    is_insured BOOLEAN DEFAULT FALSE,
    insurance_details JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking participants
CREATE TABLE booking_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    passport_number VARCHAR(50),
    nationality VARCHAR(100),
    date_of_birth DATE,
    special_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    user_id UUID REFERENCES users(id),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'KES',
    payment_method VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(50),
    transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
    metadata JSONB DEFAULT '{}',
    failure_reason TEXT,
    refund_reason TEXT,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    tour_package_id UUID REFERENCES tour_packages(id),
    booking_id UUID REFERENCES bookings(id) UNIQUE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    review_text TEXT,
    pros TEXT[],
    cons TEXT[],
    images TEXT[],
    verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'featured')),
    admin_response TEXT,
    admin_responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guides
CREATE TABLE guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    bio TEXT,
    experience_years INTEGER,
    languages TEXT[],
    specializations TEXT[],
    certifications TEXT[],
    profile_image VARCHAR(500),
    availability_status VARCHAR(50) DEFAULT 'available',
    rating DECIMAL(3, 2),
    review_count INTEGER DEFAULT 0,
    hourly_rate DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Guide assignments
CREATE TABLE guide_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    guide_id UUID REFERENCES guides(id),
    role VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'assigned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist
CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    tour_package_id UUID REFERENCES tour_packages(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tour_package_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email logs (for Resend)
CREATE TABLE email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    email_to VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template VARCHAR(100),
    status VARCHAR(50) CHECK (status IN ('sent', 'failed', 'delivered', 'opened', 'clicked')),
    resend_message_id VARCHAR(255),
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_tour_packages_destination ON tour_packages(destination_id);
CREATE INDEX idx_tour_packages_slug ON tour_packages(slug);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_tour ON bookings(tour_package_id);
CREATE INDEX idx_bookings_status ON bookings(booking_status);
CREATE INDEX idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX idx_reviews_tour ON reviews(tour_package_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_tour_availability_dates ON tour_availability(start_date, end_date);
CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_destinations_country ON destinations(country);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_packages_updated_at BEFORE UPDATE ON tour_packages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_itineraries_updated_at BEFORE UPDATE ON tour_itineraries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON hotels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_availability_updated_at BEFORE UPDATE ON tour_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_guide_assignments_updated_at BEFORE UPDATE ON guide_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for Kenya
INSERT INTO destinations (name, slug, country, region, description, best_time_to_visit, currency, languages, is_featured, latitude, longitude) VALUES
('Maasai Mara National Reserve', 'maasai-mara', 'Kenya', 'Rift Valley', 'World-famous for the Great Migration and exceptional wildlife viewing.', 'July to October', 'KES', ARRAY['English', 'Swahili', 'Maa'], true, -1.4946, 35.1439),
('Diani Beach', 'diani-beach', 'Kenya', 'Coast', 'Pristine white sand beaches along the Indian Ocean with luxury resorts.', 'December to March', 'KES', ARRAY['English', 'Swahili'], true, -4.2770, 39.5946),
('Amboseli National Park', 'amboseli', 'Kenya', 'Rift Valley', 'Home to large elephant herds with stunning views of Mount Kilimanjaro.', 'June to October', 'KES', ARRAY['English', 'Swahili', 'Maa'], true, -2.6424, 37.2625),
('Lake Nakuru', 'lake-nakuru', 'Kenya', 'Rift Valley', 'Famous for flamingos and rhino sanctuary.', 'January to March', 'KES', ARRAY['English', 'Swahili'], true, -0.3031, 36.0800);