import { query } from '../config/db.js';

export const Review = {
  // Create new review
  async create(reviewData) {
    const {
      user_id, tour_package_id, hotel_id, booking_id, rating,
      title, review_text, pros, cons, images
    } = reviewData;

    // Check if user has already reviewed this tour
    if (tour_package_id) {
      const existing = await this.findByUserAndTour(user_id, tour_package_id);
      if (existing) {
        throw new Error('You have already reviewed this tour');
      }
    }

    if (hotel_id) {
      const existing = await this.findByUserAndHotel(user_id, hotel_id);
      if (existing) {
        throw new Error('You have already reviewed this hotel');
      }
    }

    const result = await query(
      `INSERT INTO reviews (
        user_id, tour_package_id, hotel_id, booking_id, rating,
        title, review_text, pros, cons, images, verified_purchase
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        CASE 
          WHEN $2 IS NOT NULL THEN EXISTS(
            SELECT 1 FROM bookings 
            WHERE user_id = $1 
              AND tour_package_id = $2 
              AND booking_status = 'completed'
          )
          ELSE FALSE
        END
      )
      RETURNING *`,
      [user_id, tour_package_id, hotel_id, booking_id, rating,
       title, review_text, pros, cons, images]
    );

    return result.rows[0];
  },

  // Find by user and tour
  async findByUserAndTour(userId, tourPackageId) {
    const result = await query(
      'SELECT * FROM reviews WHERE user_id = $1 AND tour_package_id = $2',
      [userId, tourPackageId]
    );
    return result.rows[0];
  },

  // Find by user and hotel
  async findByUserAndHotel(userId, hotelId) {
    const result = await query(
      'SELECT * FROM reviews WHERE user_id = $1 AND hotel_id = $2',
      [userId, hotelId]
    );
    return result.rows[0];
  },

  // Find reviews by tour
  async findByTour(tourPackageId, filters = {}, pagination = {}) {
    const {
      rating,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = filters;

    const { limit = 20, offset = 0 } = pagination;

    let whereClause = ['r.tour_package_id = $1', "r.status = 'approved'"];
    const values = [tourPackageId];
    let paramIndex = 2;

    if (rating) {
      whereClause.push(`r.rating = $${paramIndex}`);
      values.push(rating);
      paramIndex++;
    }

    const whereString = whereClause.join(' AND ');

    const countResult = await query(
      `SELECT COUNT(*) FROM reviews r WHERE ${whereString}`,
      values
    );

    const result = await query(
      `SELECT r.*, 
              u.first_name, u.last_name, u.profile_image,
              u.nationality
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE ${whereString}
       ORDER BY r.${sort_by} ${sort_order}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    // Get rating statistics
    const stats = await this.getTourStats(tourPackageId);

    return {
      reviews: result.rows,
      stats,
      total: parseInt(countResult.rows[0].count),
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  },

  // Get review statistics for a tour
  async getTourStats(tourPackageId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_reviews,
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
       FROM reviews
       WHERE tour_package_id = $1 AND status = 'approved'`,
      [tourPackageId]
    );

    const stats = result.rows[0];
    
    // Calculate percentages
    if (stats.total_reviews > 0) {
      stats.five_star_percent = (stats.five_star / stats.total_reviews) * 100;
      stats.four_star_percent = (stats.four_star / stats.total_reviews) * 100;
      stats.three_star_percent = (stats.three_star / stats.total_reviews) * 100;
      stats.two_star_percent = (stats.two_star / stats.total_reviews) * 100;
      stats.one_star_percent = (stats.one_star / stats.total_reviews) * 100;
    }

    return stats;
  },

  // Find reviews by hotel
  async findByHotel(hotelId, filters = {}, pagination = {}) {
    const {
      rating,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = filters;

    const { limit = 20, offset = 0 } = pagination;

    let whereClause = ['r.hotel_id = $1', "r.status = 'approved'"];
    const values = [hotelId];
    let paramIndex = 2;

    if (rating) {
      whereClause.push(`r.rating = $${paramIndex}`);
      values.push(rating);
      paramIndex++;
    }

    const whereString = whereClause.join(' AND ');

    const countResult = await query(
      `SELECT COUNT(*) FROM reviews r WHERE ${whereString}`,
      values
    );

    const result = await query(
      `SELECT r.*, 
              u.first_name, u.last_name, u.profile_image,
              u.nationality
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE ${whereString}
       ORDER BY r.${sort_by} ${sort_order}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    const stats = await this.getHotelStats(hotelId);

    return {
      reviews: result.rows,
      stats,
      total: parseInt(countResult.rows[0].count),
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  },

  // Get review statistics for a hotel
  async getHotelStats(hotelId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_reviews,
        COALESCE(AVG(rating), 0) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
       FROM reviews
       WHERE hotel_id = $1 AND status = 'approved'`,
      [hotelId]
    );

    const stats = result.rows[0];
    
    if (stats.total_reviews > 0) {
      stats.five_star_percent = (stats.five_star / stats.total_reviews) * 100;
      stats.four_star_percent = (stats.four_star / stats.total_reviews) * 100;
      stats.three_star_percent = (stats.three_star / stats.total_reviews) * 100;
      stats.two_star_percent = (stats.two_star / stats.total_reviews) * 100;
      stats.one_star_percent = (stats.one_star / stats.total_reviews) * 100;
    }

    return stats;
  },

  // Find review by ID
  async findById(id) {
    const result = await query(
      `SELECT r.*, 
              u.first_name, u.last_name, u.profile_image,
              tp.name as tour_name, tp.slug as tour_slug,
              h.name as hotel_name, h.slug as hotel_slug
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN tour_packages tp ON r.tour_package_id = tp.id
       LEFT JOIN hotels h ON r.hotel_id = h.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Update review
  async update(id, userId, updates) {
    const allowedFields = [
      'rating', 'title', 'review_text', 'pros', 'cons', 'images'
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

    values.push(id, userId);
    const result = await query(
      `UPDATE reviews SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramIndex} AND user_id = $${paramIndex + 1} 
       RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Mark review as helpful
  async markHelpful(id) {
    const result = await query(
      'UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  // Report review
  async report(id) {
    const result = await query(
      'UPDATE reviews SET reported_count = reported_count + 1 WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  },

  // Admin: Update review status
  async updateStatus(id, status, adminResponse = null) {
    let queryText = 'UPDATE reviews SET status = $1, updated_at = CURRENT_TIMESTAMP';
    const values = [status];
    
    if (adminResponse) {
      queryText += ', admin_response = $2, admin_responded_at = CURRENT_TIMESTAMP';
      values.push(adminResponse);
      values.push(id);
    } else {
      values.push(id);
    }

    queryText += ' WHERE id = $' + values.length + ' RETURNING *';

    const result = await query(queryText, values);
    return result.rows[0];
  },

  // Delete review
  async delete(id, userId = null) {
    let queryText = 'DELETE FROM reviews WHERE id = $1';
    const values = [id];

    if (userId) {
      queryText += ' AND user_id = $2';
      values.push(userId);
    }

    const result = await query(queryText + ' RETURNING id', values);
    return result.rows[0];
  },

  // Get user's reviews
  async findByUser(userId, pagination = {}) {
    const { limit = 20, offset = 0 } = pagination;

    const result = await query(
      `SELECT r.*, 
              tp.name as tour_name, tp.slug as tour_slug,
              tp.featured_image as tour_image,
              h.name as hotel_name, h.slug as hotel_slug,
              h.featured_image as hotel_image
       FROM reviews r
       LEFT JOIN tour_packages tp ON r.tour_package_id = tp.id
       LEFT JOIN hotels h ON r.hotel_id = h.id
       WHERE r.user_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    return result.rows;
  },

  // Get recent reviews
  async getRecent(limit = 6) {
    const result = await query(
      `SELECT r.*, 
              u.first_name, u.last_name, u.profile_image, u.nationality,
              tp.name as tour_name, tp.slug as tour_slug,
              tp.featured_image as tour_image,
              h.name as hotel_name, h.slug as hotel_slug,
              h.featured_image as hotel_image
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN tour_packages tp ON r.tour_package_id = tp.id
       LEFT JOIN hotels h ON r.hotel_id = h.id
       WHERE r.status = 'approved'
       ORDER BY r.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  // Get featured reviews
  async getFeatured(limit = 3) {
    const result = await query(
      `SELECT r.*, 
              u.first_name, u.last_name, u.profile_image, u.nationality,
              tp.name as tour_name, tp.slug as tour_slug,
              h.name as hotel_name, h.slug as hotel_slug
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN tour_packages tp ON r.tour_package_id = tp.id
       LEFT JOIN hotels h ON r.hotel_id = h.id
       WHERE r.status = 'featured'
       ORDER BY r.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
};
