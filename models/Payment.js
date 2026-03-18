import { query, transaction } from '../config/db.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const Payment = {
  // Generate unique payment number
  async generatePaymentNumber() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PAY${timestamp}${random}`;
  },

  // Create payment intent with Stripe
  async createPaymentIntent(amount, currency = 'kes', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents/smallest currency unit
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw error;
    }
  },

  // Confirm payment
  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update payment record in database
        await this.updateByTransactionId(paymentIntentId, {
          status: 'success',
          metadata: paymentIntent
        });
      }

      return paymentIntent;
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error);
      throw error;
    }
  },

  // Create payment record in database
  async create(paymentData) {
    const {
      booking_id,
      user_id,
      amount,
      currency = 'KES',
      payment_method,
      payment_provider = 'stripe',
      transaction_id,
      metadata = {}
    } = paymentData;

    const payment_number = await this.generatePaymentNumber();

    const result = await query(
      `INSERT INTO payments (
        booking_id, user_id, payment_number, amount, currency,
        payment_method, payment_provider, transaction_id, metadata, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [booking_id, user_id, payment_number, amount, currency,
       payment_method, payment_provider, transaction_id, metadata, 'pending']
    );

    return result.rows[0];
  },

  // Find payment by ID
  async findById(id) {
    const result = await query(
      `SELECT p.*, 
              b.booking_number, b.total_amount as booking_total,
              u.first_name, u.last_name, u.email
       FROM payments p
       LEFT JOIN bookings b ON p.booking_id = b.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Find payment by transaction ID
  async findByTransactionId(transactionId) {
    const result = await query(
      `SELECT p.*, 
              b.booking_number,
              u.first_name, u.last_name
       FROM payments p
       LEFT JOIN bookings b ON p.booking_id = b.id
       LEFT JOIN users u ON p.user_id = u.id
       WHERE p.transaction_id = $1`,
      [transactionId]
    );
    return result.rows[0];
  },

  // Find payments by booking
  async findByBooking(bookingId) {
    const result = await query(
      `SELECT * FROM payments 
       WHERE booking_id = $1 
       ORDER BY created_at DESC`,
      [bookingId]
    );
    return result.rows;
  },

  // Find payments by user
  async findByUser(userId, pagination = {}) {
    const { limit = 20, offset = 0 } = pagination;

    const result = await query(
      `SELECT p.*, 
              b.booking_number,
              b.tour_package_id,
              tp.name as tour_name
       FROM payments p
       LEFT JOIN bookings b ON p.booking_id = b.id
       LEFT JOIN tour_packages tp ON b.tour_package_id = tp.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC
       LIMIT $2 OFFSET $3`,
      [userId, limit, offset]
    );

    const countResult = await query(
      'SELECT COUNT(*) FROM payments WHERE user_id = $1',
      [userId]
    );

    return {
      payments: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(countResult.rows[0].count / limit)
    };
  },

  // Update payment status
  async updateStatus(id, status, metadata = {}) {
    const result = await query(
      `UPDATE payments 
       SET status = $1, 
           metadata = metadata || $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, JSON.stringify(metadata), id]
    );
    return result.rows[0];
  },

  // Update payment by transaction ID
  async updateByTransactionId(transactionId, updates) {
    const allowedFields = ['status', 'metadata', 'failure_reason'];
    
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (allowedFields.includes(key)) {
        if (key === 'metadata') {
          setClause.push(`${key} = metadata || $${paramIndex}`);
        } else {
          setClause.push(`${key} = $${paramIndex}`);
        }
        values.push(value);
        paramIndex++;
      }
    });

    if (setClause.length === 0) return null;

    values.push(transactionId);
    const result = await query(
      `UPDATE payments SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE transaction_id = $${paramIndex} 
       RETURNING *`,
      values
    );

    return result.rows[0];
  },

  // Process refund
  async refund(paymentId, amount = null, reason = null) {
    return transaction(async (client) => {
      // Get payment record
      const paymentResult = await client.query(
        'SELECT * FROM payments WHERE id = $1',
        [paymentId]
      );
      
      const payment = paymentResult.rows[0];
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (payment.status !== 'success') {
        throw new Error('Only successful payments can be refunded');
      }

      // Process refund with Stripe
      let refund;
      try {
        refund = await stripe.refunds.create({
          payment_intent: payment.transaction_id,
          amount: amount ? Math.round(amount * 100) : undefined,
          reason: reason ? 'requested_by_customer' : undefined,
          metadata: { reason }
        });
      } catch (error) {
        console.error('Stripe refund failed:', error);
        throw error;
      }

      // Update payment record
      const updatedPayment = await client.query(
        `UPDATE payments 
         SET status = 'refunded',
             refund_reason = $1,
             refunded_at = CURRENT_TIMESTAMP,
             metadata = metadata || $2,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [reason, JSON.stringify({ refund, reason }), paymentId]
      );

      return updatedPayment.rows[0];
    });
  },

  // Get payment statistics
  async getStats(userId = null, startDate = null, endDate = null) {
    let whereClause = [];
    const values = [];
    let paramIndex = 1;

    if (userId) {
      whereClause.push(`user_id = $${paramIndex}`);
      values.push(userId);
      paramIndex++;
    }

    if (startDate) {
      whereClause.push(`created_at >= $${paramIndex}`);
      values.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      whereClause.push(`created_at <= $${paramIndex}`);
      values.push(endDate);
      paramIndex++;
    }

    const whereString = whereClause.length > 0 ? `WHERE ${whereClause.join(' AND ')}` : '';

    const result = await query(
      `SELECT 
        COUNT(*) as total_transactions,
        COALESCE(SUM(CASE WHEN status = 'success' THEN amount ELSE 0 END), 0) as total_successful_amount,
        COALESCE(SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END), 0) as total_pending_amount,
        COALESCE(SUM(CASE WHEN status = 'failed' THEN amount ELSE 0 END), 0) as total_failed_amount,
        COALESCE(SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END), 0) as total_refunded_amount,
        COUNT(CASE WHEN status = 'success' THEN 1 END) as successful_count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_count,
        COUNT(CASE WHEN status = 'refunded' THEN 1 END) as refunded_count,
        COALESCE(AVG(CASE WHEN status = 'success' THEN amount END), 0) as average_transaction_amount
       FROM payments
       ${whereString}`,
      values
    );

    return result.rows[0];
  },

  // Get payment methods for user (saved cards)
  async getPaymentMethods(userId) {
    try {
      // You'll need to store customer IDs in your database
      // This is a simplified version - in production, you'd store Stripe customer IDs
      const customer = await stripe.customers.list({
        email: userId, // You'd use the actual Stripe customer ID
        limit: 1
      });

      if (customer.data.length === 0) {
        return [];
      }

      const paymentMethods = await stripe.paymentMethods.list({
        customer: customer.data[0].id,
        type: 'card',
      });

      return paymentMethods.data.map(method => ({
        id: method.id,
        brand: method.card.brand,
        last4: method.card.last4,
        expMonth: method.card.exp_month,
        expYear: method.card.exp_year,
        isDefault: method.metadata?.isDefault === 'true'
      }));
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw error;
    }
  },

  // Add payment method for user
  async addPaymentMethod(userId, paymentMethodId, setAsDefault = false) {
    try {
      // Get or create Stripe customer
      let customer = await stripe.customers.list({
        email: userId, // You'd use the actual email
        limit: 1
      });

      let customerId;
      if (customer.data.length === 0) {
        const newCustomer = await stripe.customers.create({
          email: userId, // You'd use actual email
          metadata: { userId }
        });
        customerId = newCustomer.id;
      } else {
        customerId = customer.data[0].id;
      }

      // Attach payment method to customer
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      if (setAsDefault) {
        await stripe.customers.update(customerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }

      return { customerId, paymentMethodId };
    } catch (error) {
      console.error('Failed to add payment method:', error);
      throw error;
    }
  },

  // Remove payment method
  async removePaymentMethod(paymentMethodId) {
    try {
      await stripe.paymentMethods.detach(paymentMethodId);
      return true;
    } catch (error) {
      console.error('Failed to remove payment method:', error);
      throw error;
    }
  },

  // Set default payment method
  async setDefaultPaymentMethod(userId, paymentMethodId) {
    try {
      // Get customer ID (you'd store this in your database)
      const customer = await stripe.customers.list({
        email: userId,
        limit: 1
      });

      if (customer.data.length === 0) {
        throw new Error('Customer not found');
      }

      await stripe.customers.update(customer.data[0].id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      return true;
    } catch (error) {
      console.error('Failed to set default payment method:', error);
      throw error;
    }
  },

  // Handle Stripe webhook
  async handleWebhook(event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object);
        break;
      case 'payment_intent.canceled':
        await this.handlePaymentIntentCanceled(event.data.object);
        break;
      case 'charge.refunded':
        await this.handleChargeRefunded(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  },

  // Handle successful payment
  async handlePaymentIntentSucceeded(paymentIntent) {
    await this.updateByTransactionId(paymentIntent.id, {
      status: 'success',
      metadata: paymentIntent
    });

    // Update booking payment status if needed
    const bookingId = paymentIntent.metadata?.booking_id;
    if (bookingId) {
      await query(
        `UPDATE bookings 
         SET payment_status = 'paid', 
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $1`,
        [bookingId]
      );
    }
  },

  // Handle failed payment
  async handlePaymentIntentFailed(paymentIntent) {
    await this.updateByTransactionId(paymentIntent.id, {
      status: 'failed',
      failure_reason: paymentIntent.last_payment_error?.message,
      metadata: paymentIntent
    });
  },

  // Handle canceled payment
  async handlePaymentIntentCanceled(paymentIntent) {
    await this.updateByTransactionId(paymentIntent.id, {
      status: 'cancelled',
      metadata: paymentIntent
    });
  },

  // Handle refund
  async handleChargeRefunded(charge) {
    await this.updateByTransactionId(charge.payment_intent, {
      status: 'refunded',
      metadata: { charge }
    });
  }
};