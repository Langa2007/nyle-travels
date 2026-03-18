import { Booking } from '../models/Booking.js';
import { TourPackage } from '../models/TourPackage.js';
import { sendBookingConfirmation } from '../services/emailService.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

export const createBooking = catchAsync(async (req, res, next) => {
  const { tour_package_id, start_date, guests, ...bookingData } = req.body;

  // Check if tour exists
  const tour = await TourPackage.findById(tour_package_id);
  if (!tour) {
    return next(new AppError('Tour package not found', 404));
  }

  // Check availability
  const availability = await TourPackage.checkAvailability(
    tour_package_id,
    start_date,
    guests
  );

  if (!availability) {
    return next(new AppError('No availability for selected date', 400));
  }

  // Calculate end date based on tour duration
  const endDate = new Date(start_date);
  endDate.setDate(endDate.getDate() + tour.duration_days - 1);

  // Calculate pricing
  const subtotal = tour.base_price * guests;
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + tax;

  // Create booking
  const booking = await Booking.create({
    user_id: req.user.id,
    tour_package_id,
    start_date,
    end_date: endDate.toISOString().split('T')[0],
    number_of_adults: guests,
    subtotal_amount: subtotal,
    tax_amount: tax,
    total_amount: total,
    currency: tour.price_currency,
    ...bookingData
  });

  // Update availability
  await TourPackage.updateAvailability(availability.id, guests);

  // Send confirmation email
  try {
    await sendBookingConfirmation(req.user, booking, tour);
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
  }

  res.status(201).json({
    status: 'success',
    data: { booking }
  });
});

export const getMyBookings = catchAsync(async (req, res, next) => {
  const pagination = {
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0
  };

  const result = await Booking.findByUser(req.user.id, pagination);

  res.status(200).json({
    status: 'success',
    results: result.bookings.length,
    data: result
  });
});

export const getBooking = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user owns this booking
  if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to view this booking', 403));
  }

  res.status(200).json({
    status: 'success',
    data: { booking }
  });
});

export const getBookingByNumber = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByBookingNumber(req.params.number);

  if (!booking) {
    return next(new AppError('No booking found with that number', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { booking }
  });
});

export const cancelBooking = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user owns this booking
  if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to cancel this booking', 403));
  }

  // Check if booking can be cancelled (not started, not already cancelled)
  if (booking.booking_status === 'cancelled') {
    return next(new AppError('Booking is already cancelled', 400));
  }

  if (new Date(booking.start_date) <= new Date()) {
    return next(new AppError('Cannot cancel a booking that has already started', 400));
  }

  const cancelledBooking = await Booking.updateStatus(req.params.id, 'cancelled', reason);

  res.status(200).json({
    status: 'success',
    data: { booking: cancelledBooking }
  });
});

export const getUpcomingBookings = catchAsync(async (req, res, next) => {
  const days = parseInt(req.query.days) || 30;
  
  const bookings = await Booking.getUpcoming(req.user.id, days);

  res.status(200).json({
    status: 'success',
    results: bookings.length,
    data: { bookings }
  });
});

export const getBookingStats = catchAsync(async (req, res, next) => {
  const stats = await Booking.getStats(req.user.id);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

export const addPayment = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Check if user owns this booking
  if (booking.user_id !== req.user.id) {
    return next(new AppError('You do not have permission to add payment to this booking', 403));
  }

  const payment = await Booking.addPayment({
    booking_id: booking.id,
    user_id: req.user.id,
    ...req.body
  });

  // Update booking payment status
  await Booking.updatePaymentStatus(booking.id, 'paid', payment.transaction_id);

  res.status(201).json({
    status: 'success',
    data: { payment }
  });
});