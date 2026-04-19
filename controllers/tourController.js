import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import AppError from '../utils/AppError.js';
import CatchAsync from '../utils/CatchAsync.js';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const getAllTours = CatchAsync(async (req, res, next) => {
  const filters = {
    destination_id: req.query.destination,
    difficulty_level: req.query.difficulty,
    search: req.query.search
  };

  const pagination = {
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0
  };

  // Build WHERE clause for count
  let whereParts = ['tp.is_active = true'];
  let params = [];
  let paramIndex = 1;

  if (filters.destination_id) {
    whereParts.push(`tp.destination_id = $${paramIndex}`);
    params.push(filters.destination_id);
    paramIndex++;
  }

  if (filters.difficulty_level) {
    whereParts.push(`tp.difficulty_level = $${paramIndex}`);
    params.push(filters.difficulty_level);
    paramIndex++;
  }

  if (filters.search) {
    whereParts.push(`(tp.name ILIKE $${paramIndex} OR tp.description ILIKE $${paramIndex})`);
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  const whereClause = whereParts.join(' AND ');

  // Get total count
  const countQuery = `SELECT COUNT(*) as total FROM tour_packages tp WHERE ${whereClause}`;
  const countResult = await pool.query(countQuery, params);
  const total = parseInt(countResult.rows[0].total);

  // Get tours with pagination
  const toursQuery = `
    SELECT
      tp.*,
      d.name as destination_name,
      d.slug as destination_slug
    FROM tour_packages tp
    LEFT JOIN destinations d ON tp.destination_id = d.id
    WHERE ${whereClause}
    ORDER BY tp.is_featured DESC, tp.created_at DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(pagination.limit, pagination.offset);
  const toursResult = await pool.query(toursQuery, params);

  res.status(200).json({
    status: 'success',
    results: toursResult.rows.length,
    total,
    data: toursResult.rows
  });
});

export const getTour = CatchAsync(async (req, res, next) => {
  // Get tour by slug
  const tourQuery = `
    SELECT
      tp.*,
      d.name as destination_name,
      d.slug as destination_slug
    FROM tour_packages tp
    LEFT JOIN destinations d ON tp.destination_id = d.id
    WHERE tp.slug = $1 AND tp.is_active = true
  `;

  const tourResult = await pool.query(tourQuery, [req.params.slug]);

  if (tourResult.rows.length === 0) {
    return next(new AppError('No tour found with that slug', 404));
  }

  const tour = tourResult.rows[0];

  // For now, return tour without itineraries and similar tours
  // These can be added later when we have the related tables
  res.status(200).json({
    status: 'success',
    data: {
      tour,
      itineraries: [],
      similar: []
    }
  });
});

export const createTour = CatchAsync(async (req, res, next) => {
  // Check if destination exists
  if (req.body.destination_id) {
    const destQuery = 'SELECT id FROM destinations WHERE id = $1';
    const destResult = await pool.query(destQuery, [req.body.destination_id]);
    if (destResult.rows.length === 0) {
      return next(new AppError('Destination not found', 404));
    }
  }

  // For now, skip image uploads and create tour directly
  const tourData = req.body;

  // Insert tour
  const insertQuery = `
    INSERT INTO tour_packages (
      destination_id, name, slug, package_code, duration_days, duration_nights,
      difficulty_level, group_size_min, group_size_max, private_tour_available,
      private_tour_price, description, short_description, highlights, included_items,
      excluded_items, what_to_bring, physical_rating, cultural_rating, wildlife_rating,
      adventure_rating, luxury_rating, base_price, price_currency, discount_percentage,
      featured_image, gallery_images, video_url, cancellation_policy, terms_conditions,
      min_age, max_age, health_requirements, meta_title, meta_description, meta_keywords,
      is_featured, is_active
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
      $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32,
      $33, $34, $35, $36, $37, $38
    ) RETURNING *
  `;

  const values = [
    tourData.destination_id || null,
    tourData.name,
    tourData.slug,
    tourData.package_code,
    tourData.duration_days,
    tourData.duration_nights,
    tourData.difficulty_level || null,
    tourData.group_size_min || 1,
    tourData.group_size_max || 20,
    tourData.private_tour_available || false,
    tourData.private_tour_price || null,
    tourData.description || null,
    tourData.short_description || null,
    tourData.highlights || [],
    tourData.included_items || [],
    tourData.excluded_items || [],
    tourData.what_to_bring || [],
    tourData.physical_rating || null,
    tourData.cultural_rating || null,
    tourData.wildlife_rating || null,
    tourData.adventure_rating || null,
    tourData.luxury_rating || null,
    tourData.base_price,
    tourData.price_currency || 'KES',
    tourData.discount_percentage || 0,
    tourData.featured_image || null,
    tourData.gallery_images || [],
    tourData.video_url || null,
    tourData.cancellation_policy || null,
    tourData.terms_conditions || null,
    tourData.min_age || 0,
    tourData.max_age || null,
    tourData.health_requirements || null,
    tourData.meta_title || null,
    tourData.meta_description || null,
    tourData.meta_keywords || [],
    tourData.is_featured || false,
    tourData.is_active !== undefined ? tourData.is_active : true
  ];

  const result = await pool.query(insertQuery, values);
  const tour = result.rows[0];

  res.status(201).json({
    status: 'success',
    data: { tour }
  });
});

export const updateTour = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Update tour functionality coming soon'
  });
});

export const deleteTour = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Delete tour functionality coming soon'
  });
});

export const addItinerary = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Add itinerary functionality coming soon'
  });
});

export const checkAvailability = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Check availability functionality coming soon'
  });
});

export const getFeaturedTours = CatchAsync(async (req, res, next) => {
  // Get featured tours
  const featuredQuery = `
    SELECT
      tp.*,
      d.name as destination_name,
      d.slug as destination_slug
    FROM tour_packages tp
    LEFT JOIN destinations d ON tp.destination_id = d.id
    WHERE tp.is_featured = true AND tp.is_active = true
    ORDER BY tp.created_at DESC
    LIMIT 6
  `;

  const result = await pool.query(featuredQuery);

  res.status(200).json({
    status: 'success',
    results: result.rows.length,
    data: result.rows
  });
});

export const searchTours = CatchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Search tours functionality coming soon'
  });
});
