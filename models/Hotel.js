import { query } from '../config/db.js';

export const Hotel = {
  // Create new hotel
  async create(hotelData) {
    const {
      destination_id, name, slug, hotel_type, star_rating,
      description, short_description, address, latitude, longitude,
      check_in_time, check_out_time, amenities, room_types,
      featured_image, gallery_images, contact_phone, contact_email,
      website, price_per_night, price_currency, is_active
    } = hotelData;

    const result = await query(
      `INSERT INTO hotels (
        destination_id, name, slug, hotel_type, star_rating,
        description, short_description, address, latitude, longitude,
        check_in_time, check_out_time, amenities, room_types,
        featured_image, gallery_images, contact_phone, contact_email,
        website, price_per_night, price_currency, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
      RETURNING *`,
      [destination_id, name, slug, hotel_type, star_rating,
       description, short_description, address, latitude, longitude,
       check_in_time, check_out_time, amenities, room_types,
       featured_image, gallery_images, contact_phone, contact_email,
       website, price_per_night, price_currency, is_active]
    );

    return result.rows[0];
  },

  // Find all hotels with filters
  async findAll(filters = {}, pagination = {}) {
    const {
      destination_id,
      hotel_type,
      min_price,
      max_price,
      min_rating,
      amenities,
      search
    } = filters;

    const { limit = 20, offset = 0, sort_by = 'created_at', sort_order = 'DESC' } = pagination;

    let whereClause = ['h.is_active = TRUE'];
    const values = [];
    let paramIndex = 1;

    if (destination_id) {
      whereClause.push(`h.destination_id = $${paramIndex}`);
      values.push(destination_id);
      paramIndex++;
    }

    if (hotel_type) {
      whereClause.push(`h.hotel_type = $${paramIndex}`);
      values.push(hotel_type);
      paramIndex++;
    }

    if (min_price) {
      whereClause.push(`h.price_per_night >= $${paramIndex}`);
      values.push(min_price);
      paramIndex++;
    }

    if (max_price) {
      whereClause.push(`h.price_per_night <= $${paramIndex}`);
      values.push(max_price);
      paramIndex++;
    }

    if (min_rating) {
      whereClause.push(`h.star_rating >= $${paramIndex}`);
      values.push(min_rating);
      paramIndex++;
    }

    if (amenities) {
      const amenitiesArray = amenities.split(',');
      amenitiesArray.forEach(amenity => {
        whereClause.push(`$${paramIndex} = ANY(h.amenities)`);
        values.push(amenity.trim());
        paramIndex++;
      });
    }

    if (search) {
      whereClause.push(`(h.name ILIKE $${paramIndex} OR h.description ILIKE $${paramIndex} OR h.short_description ILIKE $${paramIndex})`);
      values.push(`%${search}%`);
      paramIndex++;
    }

    const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    const countResult = await query(
      `SELECT COUNT(*) FROM hotels h ${whereString}`,
      values
    );

    const result = await query(
      `SELECT h.*, 
              d.name as destination_name, d.country as destination_country,
              d.slug as destination_slug,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(DISTINCT r.id) as review_count
       FROM hotels h
       LEFT JOIN destinations d ON h.destination_id = d.id
       LEFT JOIN reviews r ON h.id = r.hotel_id AND r.status = 'approved'
       ${whereString}
       GROUP BY h.id, d.id
       ORDER BY h.${sort_by} ${sort_order}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...values, limit, offset]
    );

    return {
      hotels: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  },

  // Find by slug
  async findBySlug(slug) {
    const result = await query(
      `SELECT h.*, 
              d.name as destination_name, d.country as destination_country,
              d.slug as destination_slug, d.latitude as dest_lat, d.longitude as dest_lng,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(DISTINCT r.id) as review_count,
              json_agg(
                DISTINCT jsonb_build_object(
                  'id', r.id,
                  'rating', r.rating,
                  'title', r.title,
                  'review_text', r.review_text,
                  'user_name', u.first_name || ' ' || u.last_name,
                  'created_at', r.created_at
                )
              ) FILTER (WHERE r.id IS NOT NULL) as recent_reviews
       FROM hotels h
       LEFT JOIN destinations d ON h.destination_id = d.id
       LEFT JOIN reviews r ON h.id = r.hotel_id AND r.status = 'approved'
       LEFT JOIN users u ON r.user_id = u.id
       WHERE h.slug = $1 AND h.is_active = TRUE
       GROUP BY h.id, d.id`,
      [slug]
    );

    if (result.rows[0]) {
      // Increment view count
      await query(
        'UPDATE hotels SET views_count = views_count + 1 WHERE id = $1',
        [result.rows[0].id]
      );
    }

    return result.rows[0];
  },

  // Find by ID
  async findById(id) {
    const result = await query(
      `SELECT h.*, 
              d.name as destination_name,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(DISTINCT r.id) as review_count
       FROM hotels h
       LEFT JOIN destinations d ON h.destination_id = d.id
       LEFT JOIN reviews r ON h.id = r.hotel_id AND r.status = 'approved'
       WHERE h.id = $1 AND h.is_active = TRUE
       GROUP BY h.id, d.id`,
      [id]
    );
    return result.rows[0];
  },

  // Update hotel
  async update(id, updates) {
    const allowedFields = [
      'name', 'slug', 'hotel_type', 'star_rating', 'description',
      'short_description', 'address', 'latitude', 'longitude',
      'check_in_time', 'check_out_time', 'amenities', 'room_types',
      'featured_image', 'gallery_images', 'contact_phone', 'contact_email',
      'website', 'price_per_night', 'price_currency', 'is_active'
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
      `UPDATE hotels SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Delete hotel (soft delete)
  async delete(id) {
    const result = await query(
      'UPDATE hotels SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  },

  // Get hotels by destination
  async findByDestination(destinationId, filters = {}) {
    return this.findAll({ ...filters, destination_id: destinationId });
  },

  // Check room availability
  async checkAvailability(hotelId, checkIn, checkOut, roomType = null) {
    // This would join with a bookings table - simplified version
    const result = await query(
      `SELECT 
        h.*,
        jsonb_agg(
          DISTINCT jsonb_build_object(
            'type', rt->>'type',
            'name', rt->>'name',
            'price', rt->>'price',
            'available', rt->>'available'
          )
        ) as available_rooms
       FROM hotels h,
       jsonb_array_elements(h.room_types) as rt
       WHERE h.id = $1 
         AND (rt->>'available')::boolean = true
         AND ($2::text IS NULL OR rt->>'type' = $2)
       GROUP BY h.id`,
      [hotelId, roomType]
    );
    
    return result.rows[0];
  },

  // Get featured hotels
  async getFeatured(limit = 6) {
    const result = await query(
      `SELECT h.*, d.name as destination_name,
              COALESCE(AVG(r.rating), 0) as average_rating,
              COUNT(DISTINCT r.id) as review_count
       FROM hotels h
       LEFT JOIN destinations d ON h.destination_id = d.id
       LEFT JOIN reviews r ON h.id = r.hotel_id AND r.status = 'approved'
       WHERE h.is_active = TRUE AND h.star_rating >= 4
       GROUP BY h.id, d.id
       ORDER BY h.star_rating DESC, h.views_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  // Get luxury hotels (5-star)
  async getLuxuryHotels(limit = 10) {
    const result = await query(
      `SELECT h.*, d.name as destination_name
       FROM hotels h
       LEFT JOIN destinations d ON h.destination_id = d.id
       WHERE h.is_active = TRUE AND h.star_rating = 5
       ORDER BY h.price_per_night DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  // Search hotels
  async search(query_text, limit = 20) {
    const result = await query(
      `SELECT h.*, d.name as destination_name,
              ts_rank(to_tsvector('english', h.name || ' ' || COALESCE(h.description, '')), plainto_tsquery('english', $1)) as rank
       FROM hotels h
       LEFT JOIN destinations d ON h.destination_id = d.id
       WHERE to_tsvector('english', h.name || ' ' || COALESCE(h.description, '')) @@ plainto_tsquery('english', $1)
         AND h.is_active = TRUE
       ORDER BY rank DESC, h.star_rating DESC
       LIMIT $2`,
      [query_text, limit]
    );
    return result.rows;
  },

  // Get nearby hotels
  async getNearby(latitude, longitude, radius = 10, limit = 10) {
    // Using Haversine formula for distance calculation
    const result = await query(
      `SELECT h.*, d.name as destination_name,
              (6371 * acos(cos(radians($1)) * cos(radians(h.latitude)) * 
              cos(radians(h.longitude) - radians($2)) + sin(radians($1)) * 
              sin(radians(h.latitude)))) AS distance
       FROM hotels h
       LEFT JOIN destinations d ON h.destination_id = d.id
       WHERE h.is_active = TRUE
         AND h.latitude IS NOT NULL 
         AND h.longitude IS NOT NULL
       HAVING (6371 * acos(cos(radians($1)) * cos(radians(h.latitude)) * 
               cos(radians(h.longitude) - radians($2)) + sin(radians($1)) * 
               sin(radians(h.latitude)))) <= $3
       ORDER BY distance
       LIMIT $4`,
      [latitude, longitude, radius, limit]
    );
    return result.rows;
  },

  // Get hotels by price range
  async findByPriceRange(minPrice, maxPrice, limit = 50) {
    const result = await query(
      `SELECT h.*, d.name as destination_name
       FROM hotels h
       LEFT JOIN destinations d ON h.destination_id = d.id
       WHERE h.is_active = TRUE 
         AND h.price_per_night BETWEEN $1 AND $2
       ORDER BY h.price_per_night ASC
       LIMIT $3`,
      [minPrice, maxPrice, limit]
    );
    return result.rows;
  },

  // Get hotel statistics
  async getStats(hotelId = null) {
    let whereClause = '';
    const values = [];

    if (hotelId) {
      whereClause = 'WHERE id = $1';
      values.push(hotelId);
    }

    const result = await query(
      `SELECT 
        COUNT(*) as total_hotels,
        COUNT(CASE WHEN star_rating = 5 THEN 1 END) as five_star_count,
        COUNT(CASE WHEN star_rating = 4 THEN 1 END) as four_star_count,
        COUNT(CASE WHEN star_rating = 3 THEN 1 END) as three_star_count,
        COUNT(CASE WHEN star_rating = 2 THEN 1 END) as two_star_count,
        COUNT(CASE WHEN star_rating = 1 THEN 1 END) as one_star_count,
        COALESCE(AVG(price_per_night), 0) as average_price,
        MIN(price_per_night) as min_price,
        MAX(price_per_night) as max_price,
        SUM(views_count) as total_views
       FROM hotels
       ${whereClause}`,
      values
    );

    return result.rows[0];
  },

  // Add room type
  async addRoomType(hotelId, roomTypeData) {
    const hotel = await this.findById(hotelId);
    if (!hotel) return null;

    const roomTypes = hotel.room_types || [];
    roomTypes.push(roomTypeData);

    const result = await query(
      'UPDATE hotels SET room_types = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING room_types',
      [JSON.stringify(roomTypes), hotelId]
    );

    return result.rows[0].room_types;
  },

  // Update room type
  async updateRoomType(hotelId, roomTypeIndex, roomTypeData) {
    const hotel = await this.findById(hotelId);
    if (!hotel || !hotel.room_types || !hotel.room_types[roomTypeIndex]) return null;

    const roomTypes = hotel.room_types;
    roomTypes[roomTypeIndex] = { ...roomTypes[roomTypeIndex], ...roomTypeData };

    const result = await query(
      'UPDATE hotels SET room_types = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING room_types',
      [JSON.stringify(roomTypes), hotelId]
    );

    return result.rows[0].room_types;
  },

  // Remove room type
  async removeRoomType(hotelId, roomTypeIndex) {
    const hotel = await this.findById(hotelId);
    if (!hotel || !hotel.room_types || !hotel.room_types[roomTypeIndex]) return null;

    const roomTypes = hotel.room_types;
    roomTypes.splice(roomTypeIndex, 1);

    const result = await query(
      'UPDATE hotels SET room_types = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING room_types',
      [JSON.stringify(roomTypes), hotelId]
    );

    return result.rows[0].room_types;
  }
};