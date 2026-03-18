import { query, transaction } from '../config/db.js';

export const Booking = {
  // Generate unique booking number
  async generateBookingNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `NYL${timestamp}${random}`;
  },

  // Create new booking
  async create(bookingData) {
    const {
      user_id, tour_package_id, start_date, end_date,
      number_of_adults, number_of_children, children_ages,
      special_requests, dietary_requirements, medical_conditions,
      emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
      subtotal_amount, tax_amount, discount_amount, total_amount,
      currency, payment_method, participants = []
    } = bookingData;

    const booking_number = await this.generateBookingNumber();

    return transaction(async (client) => {
      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO bookings (
          booking_number, user_id, tour_package_id, start_date, end_date,
          number_of_adults, number_of_children, children_ages,
          special_requests, dietary_requirements, medical_conditions,
          emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
          subtotal_amount, tax_amount, discount_amount, total_amount,
          currency, payment_method, booking_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        RETURNING *`,
        [booking_number, user_id, tour_package_id, start_date, end_date,
         number_of_adults, number_of_children, children_ages,
         special_requests, dietary_requirements, medical_conditions,
         emergency_contact_name, emergency_contact_phone, emergency_contact_relation,
         subtotal_amount, tax_amount, discount_amount, total_amount,
         currency, payment_method, 'pending']
      );

      const booking = bookingResult.rows[0];

      // Add participants
      if (participants.length > 0) {
        for (const participant of participants) {
          await client.query(
            `INSERT INTO booking_participants (
              booking_id, full_name, passport_number, nationality, date_of_birth, special_requirements
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [booking.id, participant.full_name, participant.passport_number,
             participant.nationality, participant.date_of_birth, participant.special_requirements]
          );
        }
      }

      return booking;
    });
  },

  // Find booking by ID
  async findById(id) {
    const result = await query(
      `SELECT b.*, 
              u.email, u.first_name, u.last_name, u.phone,
              tp.name as tour_name, tp.slug as tour_slug,
              tp.featured_image as tour_image,
              d.name as destination_name,
              COALESCE(
                (SELECT json_agg(row_to_json(p)) FROM booking_participants p WHERE p.booking_id = b.id),
                '[]'::json
              ) as participants
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN tour_packages tp ON b.tour_package_id = tp.id
       LEFT JOIN destinations d ON tp.destination_id = d.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Find by booking number
  async findByBookingNumber(bookingNumber) {
    const result = await query(
      `SELECT b.*, 
              u.email, u.first_name, u.last_name, u.phone,
              tp.name as tour_name, tp.slug as tour_slug,
              tp.featured_image as tour_image
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN tour_packages tp ON b.tour_package_id = tp.id
       WHERE b.booking_number = $1`,
      [bookingNumber]
    );
    return result.rows[0];
  },

  // Find bookings by user
  async findByUser(userId, pagination = {}) {
    const { limit = 20, offset = 0 } = pagination;

    const result = await query(
      `SELECT b.*, 
              tp.name as tour_name, tp.slug as tour_slug,
              tp.featured_image as tour_image,
              d.name as destination_name
       FROM bookings b
       JOIN tour_packages tp ON b.tour_package_id = tp.id
       LEFT JOIN destinations d ON tp.destination_id = d.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM bookings WHERE user_id = $1',
      [userId]
    );

    return {
      bookings: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  },

  // Update booking status
  async updateStatus(id, status, cancellationReason = null) {
    let queryText = 'UPDATE bookings SET booking_status = $1, updated_at = CURRENT_TIMESTAMP';
    const values = [status];
    
    if (status === 'cancelled' && cancellationReason) {
      queryText += ', cancellation_reason = $2, cancelled_at = CURRENT_TIMESTAMP';
      values.push(cancellationReason);
    }

    queryText += ' WHERE id = $' + (values.length + 1) + ' RETURNING *';
    values.push(id);

    const result = await query(queryText, values);
    return result.rows[0];
  },

  // Update payment status
  async updatePaymentStatus(id, status, paymentIntentId = null) {
    let queryText = 'UPDATE bookings SET payment_status = $1, updated_at = CURRENT_TIMESTAMP';
    const values = [status];
    
    if (paymentIntentId) {
      queryText += ', payment_intent_id = $2';
      values.push(paymentIntentId);
    }

    queryText += ' WHERE id = $' + (values.length + 1) + ' RETURNING *';
    values.push(id);

    const result = await query(queryText, values);
    return result.rows[0];
  },

  // Add payment record
  async addPayment(paymentData) {
    const {
      booking_id, user_id, amount, currency, payment_method,
      payment_provider, transaction_id, metadata = {}
    } = paymentData;

    const payment_number = await this.generatePaymentNumber();

    const result = await query(
      `INSERT INTO payments (
        booking_id, user_id, payment_number, amount, currency,
        payment_method, payment_provider, transaction_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [booking_id, user_id, payment_number, amount, currency,
       payment_method, payment_provider, transaction_id, metadata]
    );

    return result.rows[0];
  },

  // Generate payment number
  async generatePaymentNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY${timestamp}${random}`;
  },

  // Get upcoming bookings
  async getUpcoming(userId, days = 30) {
    const result = await query(
      `SELECT b.*, tp.name as tour_name, tp.slug as tour_slug
       FROM bookings b
       JOIN tour_packages tp ON b.tour_package_id = tp.id
       WHERE b.user_id = $1 
         AND b.start_date BETWEEN CURRENT_DATE AND CURRENT_DATE + $2::integer
         AND b.booking_status NOT IN ('cancelled', 'completed')
       ORDER BY b.start_date ASC`,
      [userId, days]
    );
    return result.rows;
  },

  // Get booking statistics
  async getStats(userId = null) {
    let whereClause = '';
    const values = [];

    if (userId) {
      whereClause = 'WHERE user_id = $1';
      values.push(userId);
    }

    const result = await query(
      `SELECT 
        COUNT(*) as total_bookings,
        COUNT(CASE WHEN booking_status = 'confirmed' THEN 1 END) as confirmed,
        COUNT(CASE WHEN booking_status = 'completed' THEN 1 END) as completed,
        COUNT(CASE WHEN booking_status = 'cancelled' THEN 1 END) as cancelled,
        COALESCE(SUM(total_amount), 0) as total_spent,
        COALESCE(AVG(total_amount), 0) as average_booking_value,
        MIN(start_date) as next_booking,
        COUNT(DISTINCT tour_package_id) as unique_tours
       FROM bookings
       ${whereClause}`,
      values
    );

    return result.rows[0];
  }
};