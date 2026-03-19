import { Review } from '../models/Review.js';
import { Booking } from '../models/Booking.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/CatchAsync.js';
import { cloudinaryService } from '../services/cloudinaryService.js';

export const createReview = catchAsync(async (req, res, next) => {
  const { tour_package_id, booking_id, rating, title, review_text, pros, cons } = req.body;

  // Check if booking exists and belongs to user
  if (booking_id) {
    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }
    if (booking.user_id !== req.user.id) {
      return next(new AppError('This booking does not belong to you', 403));
    }
  }

  // Upload images if present
  let images = [];
  if (req.files?.images) {
    const uploadPromises = req.files.images.map(file =>
      cloudinaryService.uploadFromBuffer(file.buffer, 'nyle-travel/reviews')
    );
    const results = await Promise.all(uploadPromises);
    images = results.map(r => r.secure_url);
  }

  const review = await Review.create({
    user_id: req.user.id,
    tour_package_id,
    booking_id,
    rating,
    title,
    review_text,
    pros: pros ? pros.split(',').map(p => p.trim()) : [],
    cons: cons ? cons.split(',').map(c => c.trim()) : [],
    images
  });

  res.status(201).json({
    status: 'success',
    data: { review }
  });
});

export const getTourReviews = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  
  const filters = {
    rating: req.query.rating,
    sort_by: req.query.sortBy,
    sort_order: req.query.sortOrder
  };

  const pagination = {
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0
  };

  const result = await Review.findByTour(tourId, filters, pagination);

  res.status(200).json({
    status: 'success',
    results: result.reviews.length,
    data: result
  });
});

export const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { review }
  });
});

export const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if user owns this review
  if (review.user_id !== req.user.id) {
    return next(new AppError('You do not have permission to update this review', 403));
  }

  // Upload new images if present
  if (req.files?.images) {
    const uploadPromises = req.files.images.map(file =>
      cloudinaryService.uploadFromBuffer(file.buffer, 'nyle-travel/reviews')
    );
    const results = await Promise.all(uploadPromises);
    req.body.images = [...(review.images || []), ...results.map(r => r.secure_url)];
  }

  const updatedReview = await Review.update(req.params.id, req.user.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { review: updatedReview }
  });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if user owns this review or is admin
  if (review.user_id !== req.user.id && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this review', 403));
  }

  await Review.delete(req.params.id, req.user.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const markHelpful = catchAsync(async (req, res, next) => {
  const review = await Review.markHelpful(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { helpful_count: review.helpful_count }
  });
});

export const reportReview = catchAsync(async (req, res, next) => {
  const review = await Review.report(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Review reported successfully'
  });
});

export const getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.findByUser(req.user.id);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

export const getRecentReviews = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const reviews = await Review.getRecent(limit);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: { reviews }
  });
});

// Admin only
export const updateReviewStatus = catchAsync(async (req, res, next) => {
  const { status, adminResponse } = req.body;

  const review = await Review.updateStatus(req.params.id, status, adminResponse);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { review }
  });
});