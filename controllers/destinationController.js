import { Destination } from '../models/Destination.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { cloudinaryService } from '../services/cloudinaryService.js';

export const getAllDestinations = catchAsync(async (req, res, next) => {
  const filters = {
    country: req.query.country,
    is_featured: req.query.featured === 'true',
    search: req.query.search,
    limit: parseInt(req.query.limit) || 50,
    offset: parseInt(req.query.offset) || 0
  };

  const destinations = await Destination.findAll(filters);

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: { destinations }
  });
});

export const getDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findBySlug(req.params.slug);

  if (!destination) {
    return next(new AppError('No destination found with that slug', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { destination }
  });
});

export const createDestination = catchAsync(async (req, res, next) => {
  // Upload featured image if present
  if (req.files?.featured_image) {
    const result = await cloudinaryService.uploadFromBuffer(
      req.files.featured_image[0].buffer,
      'nyle-travel/destinations'
    );
    req.body.featured_image = result.secure_url;
  }

  // Upload gallery images if present
  if (req.files?.gallery_images) {
    const uploadPromises = req.files.gallery_images.map(file =>
      cloudinaryService.uploadFromBuffer(file.buffer, 'nyle-travel/destinations/gallery')
    );
    const results = await Promise.all(uploadPromises);
    req.body.gallery_images = results.map(r => r.secure_url);
  }

  const destination = await Destination.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { destination }
  });
});

export const updateDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(new AppError('No destination found with that ID', 404));
  }

  // Upload new featured image if present
  if (req.files?.featured_image) {
    const result = await cloudinaryService.uploadFromBuffer(
      req.files.featured_image[0].buffer,
      'nyle-travel/destinations'
    );
    req.body.featured_image = result.secure_url;
  }

  // Upload new gallery images if present
  if (req.files?.gallery_images) {
    const uploadPromises = req.files.gallery_images.map(file =>
      cloudinaryService.uploadFromBuffer(file.buffer, 'nyle-travel/destinations/gallery')
    );
    const results = await Promise.all(uploadPromises);
    req.body.gallery_images = [
      ...(destination.gallery_images || []),
      ...results.map(r => r.secure_url)
    ];
  }

  const updatedDestination = await Destination.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { destination: updatedDestination }
  });
});

export const deleteDestination = catchAsync(async (req, res, next) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    return next(new AppError('No destination found with that ID', 404));
  }

  // Soft delete
  await Destination.update(req.params.id, { is_active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const getPopularDestinations = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const destinations = await Destination.getPopular(limit);

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: { destinations }
  });
});

export const getFeaturedDestinations = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 4;
  
  const destinations = await Destination.getFeatured(limit);

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: { destinations }
  });
});

export const searchDestinations = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new AppError('Please provide a search query', 400));
  }

  const destinations = await Destination.search(query, 10);

  res.status(200).json({
    status: 'success',
    results: destinations.length,
    data: { destinations }
  });
});