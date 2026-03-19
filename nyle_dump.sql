--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.app_settings (
    key character varying(255) NOT NULL,
    value jsonb NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.app_settings OWNER TO postgres;

--
-- Name: booking_participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_participants (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid,
    full_name character varying(255) NOT NULL,
    passport_number character varying(50),
    nationality character varying(100),
    date_of_birth date,
    special_requirements text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.booking_participants OWNER TO postgres;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_number character varying(50) NOT NULL,
    user_id uuid,
    tour_package_id uuid,
    booking_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    start_date date NOT NULL,
    end_date date NOT NULL,
    number_of_adults integer NOT NULL,
    number_of_children integer DEFAULT 0,
    children_ages integer[],
    special_requests text,
    dietary_requirements text,
    medical_conditions text,
    emergency_contact_name character varying(255),
    emergency_contact_phone character varying(50),
    emergency_contact_relation character varying(100),
    subtotal_amount numeric(10,2) NOT NULL,
    tax_amount numeric(10,2) DEFAULT 0,
    discount_amount numeric(10,2) DEFAULT 0,
    total_amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'KES'::character varying,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    payment_method character varying(50),
    payment_intent_id character varying(255),
    booking_status character varying(50) DEFAULT 'confirmed'::character varying,
    cancellation_reason text,
    cancelled_at timestamp without time zone,
    is_insured boolean DEFAULT false,
    insurance_details jsonb,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT bookings_booking_status_check CHECK (((booking_status)::text = ANY ((ARRAY['pending'::character varying, 'confirmed'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying, 'no_show'::character varying])::text[]))),
    CONSTRAINT bookings_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['pending'::character varying, 'partial'::character varying, 'paid'::character varying, 'refunded'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: destinations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.destinations (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    country character varying(100) NOT NULL,
    region character varying(100),
    description text,
    short_description character varying(500),
    latitude numeric(10,8),
    longitude numeric(11,8),
    best_time_to_visit text,
    how_to_get_there text,
    visa_requirements text,
    health_safety text,
    currency character varying(50),
    languages text[],
    timezone character varying(100),
    featured_image character varying(500),
    gallery_images text[],
    meta_title character varying(255),
    meta_description text,
    meta_keywords text[],
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    views_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.destinations OWNER TO postgres;

--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_logs (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    email_to character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    template character varying(100),
    status character varying(50),
    resend_message_id character varying(255),
    error_message text,
    metadata jsonb DEFAULT '{}'::jsonb,
    sent_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT email_logs_status_check CHECK (((status)::text = ANY ((ARRAY['sent'::character varying, 'failed'::character varying, 'delivered'::character varying, 'opened'::character varying, 'clicked'::character varying])::text[])))
);


ALTER TABLE public.email_logs OWNER TO postgres;

--
-- Name: guide_assignments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guide_assignments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid,
    guide_id uuid,
    role character varying(100),
    start_date date NOT NULL,
    end_date date NOT NULL,
    status character varying(50) DEFAULT 'assigned'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.guide_assignments OWNER TO postgres;

--
-- Name: guides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.guides (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    bio text,
    experience_years integer,
    languages text[],
    specializations text[],
    certifications text[],
    profile_image character varying(500),
    availability_status character varying(50) DEFAULT 'available'::character varying,
    rating numeric(3,2),
    review_count integer DEFAULT 0,
    hourly_rate numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.guides OWNER TO postgres;

--
-- Name: hotels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotels (
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


ALTER TABLE public.hotels OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    is_read boolean DEFAULT false,
    read_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    booking_id uuid,
    user_id uuid,
    payment_number character varying(50) NOT NULL,
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'KES'::character varying,
    payment_method character varying(50) NOT NULL,
    payment_provider character varying(50),
    transaction_id character varying(255),
    status character varying(50) DEFAULT 'pending'::character varying,
    metadata jsonb DEFAULT '{}'::jsonb,
    failure_reason text,
    refund_reason text,
    refunded_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'success'::character varying, 'failed'::character varying, 'refunded'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    tour_package_id uuid,
    booking_id uuid,
    rating integer NOT NULL,
    title character varying(255),
    review_text text,
    pros text[],
    cons text[],
    images text[],
    verified_purchase boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    reported_count integer DEFAULT 0,
    status character varying(50) DEFAULT 'pending'::character varying,
    admin_response text,
    admin_responded_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5))),
    CONSTRAINT reviews_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'featured'::character varying])::text[])))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: tour_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_availability (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tour_package_id uuid,
    start_date date NOT NULL,
    end_date date NOT NULL,
    available_slots integer DEFAULT 0,
    total_slots integer NOT NULL,
    special_price numeric(10,2),
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tour_availability OWNER TO postgres;

--
-- Name: tour_itineraries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_itineraries (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tour_package_id uuid,
    day_number integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    accommodation_type character varying(100),
    accommodation_name character varying(255),
    accommodation_description text,
    meals_included text[],
    activities text[],
    distance_traveled numeric(10,2),
    travel_time integer,
    elevation_gain integer,
    highlights text[],
    images text[],
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tour_itineraries OWNER TO postgres;

--
-- Name: tour_packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tour_packages (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    destination_id uuid,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    package_code character varying(50) NOT NULL,
    duration_days integer NOT NULL,
    duration_nights integer NOT NULL,
    difficulty_level character varying(50),
    group_size_min integer DEFAULT 1,
    group_size_max integer DEFAULT 20,
    private_tour_available boolean DEFAULT false,
    private_tour_price numeric(10,2),
    description text,
    short_description character varying(500),
    highlights text[],
    included_items text[],
    excluded_items text[],
    what_to_bring text[],
    physical_rating integer,
    cultural_rating integer,
    wildlife_rating integer,
    adventure_rating integer,
    luxury_rating integer,
    base_price numeric(10,2) NOT NULL,
    price_currency character varying(3) DEFAULT 'KES'::character varying,
    discount_percentage numeric(5,2) DEFAULT 0,
    featured_image character varying(500),
    gallery_images text[],
    video_url character varying(500),
    cancellation_policy text,
    terms_conditions text,
    min_age integer DEFAULT 0,
    max_age integer,
    health_requirements text,
    meta_title character varying(255),
    meta_description text,
    meta_keywords text[],
    is_featured boolean DEFAULT false,
    is_active boolean DEFAULT true,
    views_count integer DEFAULT 0,
    booking_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tour_packages_adventure_rating_check CHECK (((adventure_rating >= 1) AND (adventure_rating <= 5))),
    CONSTRAINT tour_packages_cultural_rating_check CHECK (((cultural_rating >= 1) AND (cultural_rating <= 5))),
    CONSTRAINT tour_packages_difficulty_level_check CHECK (((difficulty_level)::text = ANY ((ARRAY['easy'::character varying, 'moderate'::character varying, 'challenging'::character varying, 'difficult'::character varying])::text[]))),
    CONSTRAINT tour_packages_luxury_rating_check CHECK (((luxury_rating >= 1) AND (luxury_rating <= 5))),
    CONSTRAINT tour_packages_physical_rating_check CHECK (((physical_rating >= 1) AND (physical_rating <= 5))),
    CONSTRAINT tour_packages_wildlife_rating_check CHECK (((wildlife_rating >= 1) AND (wildlife_rating <= 5)))
);


ALTER TABLE public.tour_packages OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50),
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    date_of_birth date,
    nationality character varying(100),
    passport_number character varying(50),
    passport_expiry date,
    profile_image character varying(500),
    role character varying(50) DEFAULT 'user'::character varying,
    email_verified boolean DEFAULT false,
    phone_verified boolean DEFAULT false,
    two_factor_enabled boolean DEFAULT false,
    two_factor_secret text,
    refresh_token text,
    password_reset_token text,
    password_reset_expires timestamp without time zone,
    email_verification_token text,
    last_login timestamp without time zone,
    preferences jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    deleted_at timestamp without time zone,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'admin'::character varying, 'guide'::character varying, 'partner'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlists (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid,
    tour_package_id uuid,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.wishlists OWNER TO postgres;

--
-- Data for Name: app_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.app_settings (key, value, updated_at) FROM stdin;
\.


--
-- Data for Name: booking_participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.booking_participants (id, booking_id, full_name, passport_number, nationality, date_of_birth, special_requirements, created_at) FROM stdin;
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, booking_number, user_id, tour_package_id, booking_date, start_date, end_date, number_of_adults, number_of_children, children_ages, special_requests, dietary_requirements, medical_conditions, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, subtotal_amount, tax_amount, discount_amount, total_amount, currency, payment_status, payment_method, payment_intent_id, booking_status, cancellation_reason, cancelled_at, is_insured, insurance_details, metadata, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: destinations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.destinations (id, name, slug, country, region, description, short_description, latitude, longitude, best_time_to_visit, how_to_get_there, visa_requirements, health_safety, currency, languages, timezone, featured_image, gallery_images, meta_title, meta_description, meta_keywords, is_featured, is_active, views_count, created_at, updated_at) FROM stdin;
8165eaba-f04a-4d51-ba81-32d3c2e771f2	Maasai Mara National Reserve	maasai-mara	Kenya	Rift Valley	World-famous for the Great Migration and exceptional wildlife viewing.	\N	-1.49460000	35.14390000	July to October	\N	\N	\N	KES	{English,Swahili,Maa}	\N	\N	\N	\N	\N	\N	t	t	0	2026-03-18 17:01:18.716896	2026-03-18 17:01:18.716896
41e04f79-62b1-45ec-9894-e1aa488db659	Diani Beach	diani-beach	Kenya	Coast	Pristine white sand beaches along the Indian Ocean with luxury resorts.	\N	-4.27700000	39.59460000	December to March	\N	\N	\N	KES	{English,Swahili}	\N	\N	\N	\N	\N	\N	t	t	0	2026-03-18 17:01:18.716896	2026-03-18 17:01:18.716896
2ae298a3-f766-4996-aab3-f86cd9300b0b	Amboseli National Park	amboseli	Kenya	Rift Valley	Home to large elephant herds with stunning views of Mount Kilimanjaro.	\N	-2.64240000	37.26250000	June to October	\N	\N	\N	KES	{English,Swahili,Maa}	\N	\N	\N	\N	\N	\N	t	t	0	2026-03-18 17:01:18.716896	2026-03-18 17:01:18.716896
39f57e54-d02e-4bc0-81b2-6a3bf43d794f	Lake Nakuru	lake-nakuru	Kenya	Rift Valley	Famous for flamingos and rhino sanctuary.	\N	-0.30310000	36.08000000	January to March	\N	\N	\N	KES	{English,Swahili}	\N	\N	\N	\N	\N	\N	t	t	0	2026-03-18 17:01:18.716896	2026-03-18 17:01:18.716896
\.


--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_logs (id, user_id, email_to, subject, template, status, resend_message_id, error_message, metadata, sent_at) FROM stdin;
\.


--
-- Data for Name: guide_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.guide_assignments (id, booking_id, guide_id, role, start_date, end_date, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: guides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.guides (id, user_id, bio, experience_years, languages, specializations, certifications, profile_image, availability_status, rating, review_count, hourly_rate, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: hotels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hotels (id, destination_id, name, slug, hotel_type, star_rating, description, short_description, address, latitude, longitude, check_in_time, check_out_time, amenities, room_types, featured_image, gallery_images, contact_phone, contact_email, website, price_per_night, price_currency, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, type, title, message, data, is_read, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, booking_id, user_id, payment_number, amount, currency, payment_method, payment_provider, transaction_id, status, metadata, failure_reason, refund_reason, refunded_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, tour_package_id, booking_id, rating, title, review_text, pros, cons, images, verified_purchase, helpful_count, reported_count, status, admin_response, admin_responded_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tour_availability; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_availability (id, tour_package_id, start_date, end_date, available_slots, total_slots, special_price, is_available, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tour_itineraries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_itineraries (id, tour_package_id, day_number, title, description, accommodation_type, accommodation_name, accommodation_description, meals_included, activities, distance_traveled, travel_time, elevation_gain, highlights, images, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tour_packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tour_packages (id, destination_id, name, slug, package_code, duration_days, duration_nights, difficulty_level, group_size_min, group_size_max, private_tour_available, private_tour_price, description, short_description, highlights, included_items, excluded_items, what_to_bring, physical_rating, cultural_rating, wildlife_rating, adventure_rating, luxury_rating, base_price, price_currency, discount_percentage, featured_image, gallery_images, video_url, cancellation_policy, terms_conditions, min_age, max_age, health_requirements, meta_title, meta_description, meta_keywords, is_featured, is_active, views_count, booking_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, phone, password_hash, first_name, last_name, date_of_birth, nationality, passport_number, passport_expiry, profile_image, role, email_verified, phone_verified, two_factor_enabled, two_factor_secret, refresh_token, password_reset_token, password_reset_expires, email_verification_token, last_login, preferences, created_at, updated_at, deleted_at) FROM stdin;
9b740adf-33c0-4a06-b1b8-fa0889982526	admin@nyle.com	\N	$2a$10$4h9f79/Psju16nGLkDWR3eEIOQXjXCWjpatknC7ijMbPsxr9DZSbu	Super	Admin	\N	\N	\N	\N	\N	admin	f	f	f	\N	\N	\N	\N	\N	\N	{}	2026-03-19 13:14:15.852858	2026-03-19 13:14:15.852858	\N
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlists (id, user_id, tour_package_id, created_at) FROM stdin;
\.


--
-- Name: app_settings app_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.app_settings
    ADD CONSTRAINT app_settings_pkey PRIMARY KEY (key);


--
-- Name: booking_participants booking_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_participants
    ADD CONSTRAINT booking_participants_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_booking_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_booking_number_key UNIQUE (booking_number);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: destinations destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_pkey PRIMARY KEY (id);


--
-- Name: destinations destinations_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.destinations
    ADD CONSTRAINT destinations_slug_key UNIQUE (slug);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: guide_assignments guide_assignments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guide_assignments
    ADD CONSTRAINT guide_assignments_pkey PRIMARY KEY (id);


--
-- Name: guides guides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guides
    ADD CONSTRAINT guides_pkey PRIMARY KEY (id);


--
-- Name: hotels hotels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT hotels_pkey PRIMARY KEY (id);


--
-- Name: hotels hotels_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT hotels_slug_key UNIQUE (slug);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payments payments_payment_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_payment_number_key UNIQUE (payment_number);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_key UNIQUE (booking_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: tour_availability tour_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_availability
    ADD CONSTRAINT tour_availability_pkey PRIMARY KEY (id);


--
-- Name: tour_availability tour_availability_tour_package_id_start_date_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_availability
    ADD CONSTRAINT tour_availability_tour_package_id_start_date_key UNIQUE (tour_package_id, start_date);


--
-- Name: tour_itineraries tour_itineraries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_itineraries
    ADD CONSTRAINT tour_itineraries_pkey PRIMARY KEY (id);


--
-- Name: tour_itineraries tour_itineraries_tour_package_id_day_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_itineraries
    ADD CONSTRAINT tour_itineraries_tour_package_id_day_number_key UNIQUE (tour_package_id, day_number);


--
-- Name: tour_packages tour_packages_package_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_packages
    ADD CONSTRAINT tour_packages_package_code_key UNIQUE (package_code);


--
-- Name: tour_packages tour_packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_packages
    ADD CONSTRAINT tour_packages_pkey PRIMARY KEY (id);


--
-- Name: tour_packages tour_packages_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_packages
    ADD CONSTRAINT tour_packages_slug_key UNIQUE (slug);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_user_id_tour_package_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_tour_package_id_key UNIQUE (user_id, tour_package_id);


--
-- Name: idx_bookings_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_dates ON public.bookings USING btree (start_date, end_date);


--
-- Name: idx_bookings_dates_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_dates_status ON public.bookings USING btree (start_date, end_date, booking_status);


--
-- Name: idx_bookings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_status ON public.bookings USING btree (booking_status);


--
-- Name: idx_bookings_tour; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_tour ON public.bookings USING btree (tour_package_id);


--
-- Name: idx_bookings_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_user ON public.bookings USING btree (user_id);


--
-- Name: idx_bookings_user_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_bookings_user_status ON public.bookings USING btree (user_id, booking_status);


--
-- Name: idx_destinations_country; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_destinations_country ON public.destinations USING btree (country);


--
-- Name: idx_destinations_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_destinations_slug ON public.destinations USING btree (slug);


--
-- Name: idx_payments_booking; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_booking ON public.payments USING btree (booking_id);


--
-- Name: idx_payments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_status ON public.payments USING btree (status);


--
-- Name: idx_reviews_rating; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_rating ON public.reviews USING btree (rating);


--
-- Name: idx_reviews_tour; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_tour ON public.reviews USING btree (tour_package_id);


--
-- Name: idx_reviews_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_user ON public.reviews USING btree (user_id);


--
-- Name: idx_tour_availability_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_availability_dates ON public.tour_availability USING btree (start_date, end_date);


--
-- Name: idx_tour_packages_destination; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_packages_destination ON public.tour_packages USING btree (destination_id);


--
-- Name: idx_tour_packages_duration; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_packages_duration ON public.tour_packages USING btree (duration_days);


--
-- Name: idx_tour_packages_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_packages_price ON public.tour_packages USING btree (base_price);


--
-- Name: idx_tour_packages_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tour_packages_slug ON public.tour_packages USING btree (slug);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_phone ON public.users USING btree (phone);


--
-- Name: bookings update_bookings_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: destinations update_destinations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON public.destinations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: guide_assignments update_guide_assignments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_guide_assignments_updated_at BEFORE UPDATE ON public.guide_assignments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: guides update_guides_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON public.guides FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: hotels update_hotels_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_hotels_updated_at BEFORE UPDATE ON public.hotels FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: payments update_payments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reviews update_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tour_availability update_tour_availability_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tour_availability_updated_at BEFORE UPDATE ON public.tour_availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tour_itineraries update_tour_itineraries_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tour_itineraries_updated_at BEFORE UPDATE ON public.tour_itineraries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: tour_packages update_tour_packages_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_tour_packages_updated_at BEFORE UPDATE ON public.tour_packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users update_users_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: booking_participants booking_participants_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_participants
    ADD CONSTRAINT booking_participants_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_tour_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_tour_package_id_fkey FOREIGN KEY (tour_package_id) REFERENCES public.tour_packages(id);


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: email_logs email_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: guide_assignments guide_assignments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guide_assignments
    ADD CONSTRAINT guide_assignments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: guide_assignments guide_assignments_guide_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guide_assignments
    ADD CONSTRAINT guide_assignments_guide_id_fkey FOREIGN KEY (guide_id) REFERENCES public.guides(id);


--
-- Name: guides guides_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.guides
    ADD CONSTRAINT guides_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: hotels hotels_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotels
    ADD CONSTRAINT hotels_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id);


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments payments_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: reviews reviews_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.bookings(id);


--
-- Name: reviews reviews_tour_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_tour_package_id_fkey FOREIGN KEY (tour_package_id) REFERENCES public.tour_packages(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: tour_availability tour_availability_tour_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_availability
    ADD CONSTRAINT tour_availability_tour_package_id_fkey FOREIGN KEY (tour_package_id) REFERENCES public.tour_packages(id) ON DELETE CASCADE;


--
-- Name: tour_itineraries tour_itineraries_tour_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_itineraries
    ADD CONSTRAINT tour_itineraries_tour_package_id_fkey FOREIGN KEY (tour_package_id) REFERENCES public.tour_packages(id) ON DELETE CASCADE;


--
-- Name: tour_packages tour_packages_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tour_packages
    ADD CONSTRAINT tour_packages_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.destinations(id);


--
-- Name: wishlists wishlists_tour_package_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_tour_package_id_fkey FOREIGN KEY (tour_package_id) REFERENCES public.tour_packages(id);


--
-- Name: wishlists wishlists_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

