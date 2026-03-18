import { query } from '../config/db.js';

export const Destination = {
  // Create new destination
  async create(destinationData) {
    const {
      name, slug, country, region, description, short_description,
      latitude, longitude, best_time_to_visit, how_to_get_there,
      visa_requirements, health_safety, currency, languages,
      timezone, featured_image, gallery_images, meta_title,
      meta_description, meta_keywords, is_featured
    } = destinationData;

    const result = await query(
      `INSERT INTO destinations (
        name, slug, country, region, description, short_description,
        latitude, longitude, best_time_to_visit, how_to_get_there,
        visa_requirements, health_safety, currency, languages,
        timezone, featured_image, gallery_images, meta_title,
        meta_description, meta_keywords, is_featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [name, slug, country, region, description, short_description,
       latitude, longitude, best_time_to_visit, how_to_get_there,
       visa_requirements, health_safety, currency, languages,
       timezone, featured_image, gallery_images, meta_title,
       meta_description, meta_keywords, is_featured]
    );

    return result.rows[0];
  },

  // Find all destinations
  async findAll(filters = {}) {
    const {
      country,
      is_featured,
      search,
      limit = 50,
      offset = 0
    } = filters;

    let whereClause = ['is_active = TRUE'];
    const values = [];
    let paramIndex = 1;

    if (country) {
      whereClause.push(`country = $${paramIndex}`);
      values.push(country);
      paramIndex++;
    }

    if (is_featured !== undefined) {
      whereClause.push(`is_featured = $${paramIndex}`);
      values.push(is_featured);
      paramIndex++;
    }

    if (search) {
      whereClause.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    const result = await query(
      `SELECT d.*, 
              COUNT(DISTINCT tp.id) as tour_count
       FROM destinations d
       LEFT JOIN tour_packages tp ON d.id = tp.destination_id AND tp.is_active = TRUE
       ${whereString}
       GROUP BY d.id
       ORDER BY d.is_featured DESC, d.name ASC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return result.rows;
  },

  // Find by slug
  async findBySlug(slug) {
    const result = await query(
      `SELECT d.*,
              COUNT(DISTINCT tp.id) as tour_count,
              json_agg(
                DISTINCT jsonb_build_object(
                  'id', tp.id,
                  'name', tp.name,
                  'slug', tp.slug,
                  'duration_days', tp.duration_days,
                  'base_price', tp.base_price,
                  'featured_image', tp.featured_image,
                  'difficulty_level', tp.difficulty_level,
                  'average_rating', COALESCE(AVG(r.rating) OVER (PARTITION BY tp.id), 0)
                )
              ) FILTER (WHERE tp.id IS NOT NULL) as tours
       FROM destinations d
       LEFT JOIN tour_packages tp ON d.id = tp.destination_id AND tp.is_active = TRUE
       LEFT JOIN reviews r ON tp.id = r.tour_package_id AND r.status = 'approved'
       WHERE d.slug = $1 AND d.is_active = TRUE
       GROUP BY d.id`,
      [slug]
    );

    if (result.rows[0]) {
      // Increment view count
      await query(
        'UPDATE destinations SET views_count = views_count + 1 WHERE id = $1',
        [result.rows[0].id]
      );
    }

    return result.rows[0];
  },

  // Find by ID
  async findById(id) {
    const result = await query(
      'SELECT * FROM destinations WHERE id = $1 AND is_active = TRUE',
      [id]
    );
    return result.rows[0];
  },

  // Update destination
  async update(id, updates) {
    const allowedFields = [
      'name', 'slug', 'description', 'short_description',
      'latitude', 'longitude', 'best_time_to_visit', 'how_to_get_there',
      'visa_requirements', 'health_safety', 'currency', 'languages',
      'timezone', 'featured_image', 'gallery_images', 'meta_title',
      'meta_description', 'meta_keywords', 'is_featured', 'is_active'
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
      `UPDATE destinations SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Get popular destinations
  async getPopular(limit = 6) {
    const result = await query(
      `SELECT d.*, 
              COUNT(DISTINCT b.id) as booking_count,
              COUNT(DISTINCT tp.id) as tour_count
       FROM destinations d
       LEFT JOIN tour_packages tp ON d.id = tp.destination_id
       LEFT JOIN bookings b ON tp.id = b.tour_package_id
       WHERE d.is_active = TRUE
       GROUP BY d.id
       ORDER BY booking_count DESC, d.views_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  // Get featured destinations
  async getFeatured(limit = 4) {
    const result = await query(
      `SELECT d.*, 
              COUNT(DISTINCT tp.id) as tour_count
       FROM destinations d
       LEFT JOIN tour_packages tp ON d.id = tp.destination_id AND tp.is_active = TRUE
       WHERE d.is_featured = TRUE AND d.is_active = TRUE
       GROUP BY d.id
       ORDER BY d.name ASC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  // Search destinations
  async search(query_text, limit = 10) {
    const result = await query(
      `SELECT *,
              ts_rank(to_tsvector('english', name || ' ' || COALESCE(description, '')), plainto_tsquery('english', $1)) as rank
       FROM destinations
       WHERE to_tsvector('english', name || ' ' || COALESCE(description, '')) @@ plainto_tsquery('english', $1)
         AND is_active = TRUE
       ORDER BY rank DESC
       LIMIT $2`,
      [query_text, limit]
    );
    return result.rows;
  }
};