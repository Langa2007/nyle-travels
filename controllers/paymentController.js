import { Payment } from '../models/Payment.js';
import { Booking } from '../models/Booking.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/CatchAsync.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent for a booking
export const createPaymentIntent = catchAsync(async (req, res, next) => {
  const { booking_id, amount, currency = 'kes' } = req.body;

  // Verify booking exists and belongs to user
  const booking = await Booking.findById(booking_id);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to pay for this booking', 403));
  }

  // Check if booking is already paid
  if (booking.payment_status === 'paid') {
    return next(new AppError('This booking has already been paid for', 400));
  }

  // Create payment intent with Stripe
  const paymentIntent = await Payment.createPaymentIntent(
    amount || booking.total_amount,
    currency,
    {
      booking_id: booking.id,
      booking_number: booking.booking_number,
      user_id: req.user.id,
      user_email: req.user.email
    }
  );

  // Create payment record in database
  const payment = await Payment.create({
    booking_id: booking.id,
    user_id: req.user.id,
    amount: amount || booking.total_amount,
    currency: currency.toUpperCase(),
    payment_method: 'card',
    payment_provider: 'stripe',
    transaction_id: paymentIntent.paymentIntentId,
    metadata: { clientSecret: paymentIntent.clientSecret }
  });

  res.status(200).json({
    status: 'success',
    data: {
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId,
      payment
    }
  });
});

// Confirm payment
export const confirmPayment = catchAsync(async (req, res, next) => {
  const { payment_intent_id } = req.body;

  const paymentIntent = await Payment.confirmPayment(payment_intent_id);

  // Get payment record
  const payment = await Payment.findByTransactionId(payment_intent_id);

  res.status(200).json({
    status: 'success',
    data: {
      status: paymentIntent.status,
      payment
    }
  });
});

// Get payment methods for user
export const getPaymentMethods = catchAsync(async (req, res, next) => {
  const paymentMethods = await Payment.getPaymentMethods(req.user.email);

  res.status(200).json({
    status: 'success',
    data: { paymentMethods }
  });
});

// Add payment method
export const addPaymentMethod = catchAsync(async (req, res, next) => {
  const { payment_method_id, set_as_default } = req.body;

  const result = await Payment.addPaymentMethod(
    req.user.email,
    payment_method_id,
    set_as_default
  );

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// Remove payment method
export const removePaymentMethod = catchAsync(async (req, res, next) => {
  const { methodId } = req.params;

  await Payment.removePaymentMethod(methodId);

  res.status(200).json({
    status: 'success',
    message: 'Payment method removed successfully'
  });
});

// Set default payment method
export const setDefaultPaymentMethod = catchAsync(async (req, res, next) => {
  const { methodId } = req.params;

  await Payment.setDefaultPaymentMethod(req.user.email, methodId);

  res.status(200).json({
    status: 'success',
    message: 'Default payment method updated'
  });
});

// Get payment history
export const getPaymentHistory = catchAsync(async (req, res, next) => {
  const pagination = {
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0
  };

  const result = await Payment.findByUser(req.user.id, pagination);

  res.status(200).json({
    status: 'success',
    results: result.payments.length,
    data: result
  });
});

// Get single payment
export const getPayment = catchAsync(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  // Check if user owns this payment
  if (payment.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view this payment', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { payment }
  });
});

// Get payments by booking
export const getPaymentsByBooking = catchAsync(async (req, res, next) => {
  const { bookingId } = req.params;

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  // Check if user owns this booking
  if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view these payments', 403));
  }

  const payments = await Payment.findByBooking(bookingId);

  res.status(200).json({
    status: 'success',
    results: payments.length,
    data: { payments }
  });
});

// Refund payment (Admin only)
export const refundPayment = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;
  const { amount, reason } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  const refundedPayment = await Payment.refund(paymentId, amount, reason);

  res.status(200).json({
    status: 'success',
    data: { payment: refundedPayment }
  });
});

// Get payment statistics
export const getPaymentStats = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  let stats;
  if (req.user.role === 'admin') {
    // Admin sees all stats
    stats = await Payment.getStats(null, startDate, endDate);
  } else {
    // User sees only their stats
    stats = await Payment.getStats(req.user.id, startDate, endDate);
  }

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

// Handle Stripe webhook
export const handleWebhook = catchAsync(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  await Payment.handleWebhook(event);

  res.json({ received: true });
});

// Retry failed payment
export const retryPayment = catchAsync(async (req, res, next) => {
  const { paymentId } = req.params;

  const payment = await Payment.findById(paymentId);
  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  if (payment.user_id !== req.user.id) {
    return next(new AppError('You do not have permission to retry this payment', 403));
  }

  if (payment.status !== 'failed') {
    return next(new AppError('Only failed payments can be retried', 400));
  }

  // Create new payment intent
  const paymentIntent = await Payment.createPaymentIntent(
    payment.amount,
    payment.currency,
    {
      booking_id: payment.booking_id,
      original_payment_id: payment.id,
      user_id: req.user.id
    }
  );

  // Create new payment record
  const newPayment = await Payment.create({
    booking_id: payment.booking_id,
    user_id: req.user.id,
    amount: payment.amount,
    currency: payment.currency,
    payment_method: payment.payment_method,
    payment_provider: 'stripe',
    transaction_id: paymentIntent.paymentIntentId,
    metadata: { 
      retry_of: payment.id,
      clientSecret: paymentIntent.clientSecret 
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      clientSecret: paymentIntent.clientSecret,
      payment: newPayment
    }
  });
});