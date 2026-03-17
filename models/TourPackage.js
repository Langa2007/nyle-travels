import { query, transaction } from '../config/db.js';

export const TourPackage = {
  // Create new tour package
  async create(tourData) {
    const {
      destination_id, name, slug, package_code, duration_days, duration_nights,
      difficulty_level, group_size_min, group_size_max, private_tour_available,
      private_tour_price, description, short_description, highlights,
      included_items, excluded_items, what_to_bring, physical_rating,
      cultural_rating, wildlife_rating, adventure_rating, luxury_rating,
      base_price, price_currency, discount_percentage, featured_image,
      gallery_images, video_url, cancellation_policy, terms_conditions,
      min_age, max_age, health_requirements, meta_title, meta_description,
      meta_keywords
    } = tourData;

    const result = await query(
      `INSERT INTO tour_packages (
        destination_id, name, slug, package_code, duration_days, duration_nights,
        difficulty_level, group_size_min, group_size_max, private_tour_available,
        private_tour_price, description, short_description, highlights,
        included_items, excluded_items, what_to_bring, physical_rating,
        cultural_rating, wildlife_rating, adventure_rating, luxury_rating,
        base_price, price_currency, discount_percentage, featured_image,
        gallery_images, video_url, cancellation_policy, terms_conditions,
        min_age, max_age, health_requirements, meta_title, meta_description,
        meta_keywords
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
                $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28,
                $29, $30, $31, $32, $33, $34, $35, $36)
      RETURNING *`,
      [destination_id, name, slug, package_code, duration_days, duration_nights,
       difficulty_level, group_size_min, group_size_max, private_tour_available,
       private_tour_price, description, short_description, highlights,
       included_items, excluded_items, what_to_bring, physical_rating,
       cultural_rating, wildlife_rating, adventure_rating, luxury_rating,
       base_price, price_currency, discount_percentage, featured_image,
       gallery_images, video_url, cancellation_policy, terms_conditions,
       min_age, max_age, health_requirements, meta_title, meta_description,
       meta_keywords]
    );

    return result.rows[0];
  },

  // Find all tour packages with filters
  async findAll(filters = {}, pagination = {}) {
    const {
      destination_id,
      difficulty_level,
      min_price,
      max_price,
      min_duration,
      max_duration,
      is_featured,
      search
    } = filters;

    const { limit = 20, offset = 0, sort_by = 'created_at', sort_order = 'DESC' } = pagination;

    let whereClause = ['tp.is_active = TRUE'];
    const values = [];
    let paramIndex = 1;

    if (destination_id) {
      whereClause.push(`tp.destination_id = $${paramIndex}`);
      values.push(destination_id);
      paramIndex++;
    }

    if (difficulty_level) {
      whereClause.push(`tp.difficulty_level = $${paramIndex}`);
      values.push(difficulty_level);
      paramIndex++;
    }

    if (min_price) {
      whereClause.push(`tp.base_price >= $${paramIndex}`);
      values.push(min_price);
      paramIndex++;
    }

    if (max_price) {
      whereClause.push(`tp.base_price <= $${paramIndex}`);
      values.push(max_price);
      paramIndex++;
    }

    if (min_duration) {
      whereClause.push(`tp.duration_days >= $${paramIndex}`);
      values.push(min_duration);
      paramIndex++;
    }

    if (max_duration) {
      whereClause.push(`tp.duration_days <= $${paramIndex}`);
      values.push(max_duration);
      paramIndex++;
    }

    if (is_featured !== undefined) {
      whereClause.push(`tp.is_featured = $${paramIndex}`);
      values.push(is_featured);
      paramIndex++;
    }

    if (search) {
      whereClause.push(`(tp.name ILIKE $${paramIndex} OR tp.short_description ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) FROM tour_packages tp ${whereString}`,
      values
    );

    const result = await query(
      `SELECT tp.*, d.name as destination_name, d.country as destination_country,
              d.latitude, d.longitude,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(DISTINCT r.id) as review_count
       FROM tour_packages tp
       LEFT JOIN destinations d ON tp.destination_id = d.id
       LEFT JOIN reviews r ON tp.id = r.tour_package_id AND r.status = 'approved'
       ${whereString}
       GROUP BY tp.id, d.id
       ORDER BY tp.${sort_by} ${sort_order}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return {
      tours: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  },

  // Find by slug
  async findBySlug(slug) {
    const result = await query(
      `SELECT tp.*, d.name as destination_name, d.country as destination_country,
              d.latitude, d.longitude, d.best_time_to_visit,
              d.how_to_get_there, d.visa_requirements, d.health_safety,
              d.currency as destination_currency, d.languages,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(DISTINCT r.id) as review_count
       FROM tour_packages tp
       LEFT JOIN destinations d ON tp.destination_id = d.id
       LEFT JOIN reviews r ON tp.id = r.tour_package_id AND r.status = 'approved'
       WHERE tp.slug = $1 AND tp.is_active = TRUE
       GROUP BY tp.id, d.id`,
      [slug]
    );

    if (result.rows[0]) {
      // Increment view count
      await query(
        'UPDATE tour_packages SET views_count = views_count + 1 WHERE id = $1',
        [result.rows[0].id]
      );
    }

    return result.rows[0];
  },

  // Find by ID
  async findById(id) {
    const result = await query(
      `SELECT tp.*, d.name as destination_name, d.country as destination_country,
              d.latitude, d.longitude,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(DISTINCT r.id) as review_count
       FROM tour_packages tp
       LEFT JOIN destinations d ON tp.destination_id = d.id
       LEFT JOIN reviews r ON tp.id = r.tour_package_id AND r.status = 'approved'
       WHERE tp.id = $1 AND tp.is_active = TRUE
       GROUP BY tp.id, d.id`,
      [id]
    );
    return result.rows[0];
  },

  // Update tour package
  async update(id, updates) {
    const allowedFields = [
      'name', 'slug', 'description', 'short_description', 'highlights',
      'included_items', 'excluded_items', 'what_to_bring', 'base_price',
      'discount_percentage', 'featured_image', 'gallery_images', 'video_url',
      'difficulty_level', 'group_size_min', 'group_size_max',
      'private_tour_available', 'private_tour_price', 'physical_rating',
      'cultural_rating', 'wildlife_rating', 'adventure_rating', 'luxury_rating',
      'cancellation_policy', 'terms_conditions', 'min_age', 'max_age',
      'health_requirements', 'is_featured', 'is_active', 'meta_title',
      'meta_description', 'meta_keywords'
    ];

    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        setClause.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (setClause.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE tour_packages SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Get itineraries for a tour
  async getItineraries(tourPackageId) {
    const result = await query(
      `SELECT * FROM tour_itineraries 
       WHERE tour_package_id = $1 
       ORDER BY day_number ASC`,
      [tourPackageId]
    );
    return result.rows;
  },

  // Add itinerary day
  async addItinerary(tourPackageId, itineraryData) {
    const {
      day_number, title, description, accommodation_type,
      accommodation_name, accommodation_description, meals_included,
      activities, distance_traveled, travel_time, elevation_gain,
      highlights, images
    } = itineraryData;

    const result = await query(
      `INSERT INTO tour_itineraries (
        tour_package_id, day_number, title, description, accommodation_type,
        accommodation_name, accommodation_description, meals_included,
        activities, distance_traveled, travel_time, elevation_gain,
        highlights, images
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [tourPackageId, day_number, title, description, accommodation_type,
       accommodation_name, accommodation_description, meals_included,
       activities, distance_traveled, travel_time, elevation_gain,
       highlights, images]
    );

    return result.rows[0];
  },

  // Get availability for a tour
  async getAvailability(tourPackageId, startDate, endDate) {
    const result = await query(
      `SELECT * FROM tour_availability 
       WHERE tour_package_id = $1 
       AND start_date >= $2 
       AND end_date <= $3
       ORDER BY start_date ASC`,
      [tourPackageId, startDate, endDate]
    );
    return result.rows;
  },

  // Check availability for specific date
  async checkAvailability(tourPackageId, date, numberOfGuests) {
    const result = await query(
      `SELECT * FROM tour_availability 
       WHERE tour_package_id = $1 
       AND $2 BETWEEN start_date AND end_date
       AND is_available = TRUE
       AND available_slots >= $3`,
      [tourPackageId, date, numberOfGuests]
    );
    return result.rows[0];
  },

  // Update availability
  async updateAvailability(id, slots) {
    const result = await query(
      `UPDATE tour_availability 
       SET available_slots = available_slots - $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [slots, id]
    );
    return result.rows[0];
  },

  // Get similar tours
  async findSimilar(tourPackageId, destinationId, limit = 4) {
    const result = await query(
      `SELECT tp.*, d.name as destination_name,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(DISTINCT r.id) as review_count
       FROM tour_packages tp
       LEFT JOIN destinations d ON tp.destination_id = d.id
       LEFT JOIN reviews r ON tp.id = r.tour_package_id AND r.status = 'approved'
       WHERE tp.destination_id = $1 
         AND tp.id != $2 
         AND tp.is_active = TRUE
       GROUP BY tp.id, d.id
       ORDER BY tp.is_featured DESC, tp.views_count DESC
       LIMIT $3`,
      [destinationId, tourPackageId, limit]
    );
    return result.rows;
  }
};