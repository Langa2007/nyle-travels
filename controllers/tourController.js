import { TourPackage } from '../models/TourPackage.js';
import { Destination } from '../models/Destination.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/CatchAsync.js';
import { cloudinaryService } from '../services/cloudinaryService.js';

export const getAllTours = catchAsync(async (req, res, next) => {
  const filters = {
    destination_id: req.query.destination,
    difficulty_level: req.query.difficulty,
    min_price: req.query.minPrice,
    max_price: req.query.maxPrice,
    min_duration: req.query.minDuration,
    max_duration: req.query.maxDuration,
    is_featured: req.query.featured === 'true',
    search: req.query.search
  };

  const pagination = {
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0,
    sort_by: req.query.sortBy || 'created_at',
    sort_order: req.query.sortOrder || 'DESC'
  };

  const result = await TourPackage.findAll(filters, pagination);

  res.status(200).json({
    status: 'success',
    results: result.tours.length,
    data: result
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await TourPackage.findBySlug(req.params.slug);
  
  if (!tour) {
    return next(new AppError('No tour found with that slug', 404));
  }

  // Get itineraries
  const itineraries = await TourPackage.getItineraries(tour.id);
  
  // Get similar tours
  const similar = await TourPackage.findSimilar(tour.id, tour.destination_id);

  res.status(200).json({
    status: 'success',
    data: {
      tour: { ...tour, itineraries },
      similar
    }
  });
});

export const createTour = catchAsync(async (req, res, next) => {
  // Check if destination exists
  const destination = await Destination.findById(req.body.destination_id);
  if (!destination) {
    return next(new AppError('Destination not found', 404));
  }

  // Upload featured image if present
  if (req.files?.featured_image) {
    const result = await cloudinaryService.uploadFromBuffer(
      req.files.featured_image[0].buffer,
      'nyle-travel/tours'
    );
    req.body.featured_image = result.secure_url;
  }

  // Upload gallery images if present
  if (req.files?.gallery_images) {
    const uploadPromises = req.files.gallery_images.map(file =>
      cloudinaryService.uploadFromBuffer(file.buffer, 'nyle-travel/tours/gallery')
    );
    const results = await Promise.all(uploadPromises);
    req.body.gallery_images = results.map(r => r.secure_url);
  }

  const tour = await TourPackage.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { tour }
  });
});

export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await TourPackage.findById(req.params.id);
  
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // Upload new featured image if present
  if (req.files?.featured_image) {
    const result = await cloudinaryService.uploadFromBuffer(
      req.files.featured_image[0].buffer,
      'nyle-travel/tours'
    );
    req.body.featured_image = result.secure_url;
  }

  // Upload new gallery images if present
  if (req.files?.gallery_images) {
    const uploadPromises = req.files.gallery_images.map(file =>
      cloudinaryService.uploadFromBuffer(file.buffer, 'nyle-travel/tours/gallery')
    );
    const results = await Promise.all(uploadPromises);
    req.body.gallery_images = [
      ...(tour.gallery_images || []),
      ...results.map(r => r.secure_url)
    ];
  }

  const updatedTour = await TourPackage.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { tour: updatedTour }
  });
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await TourPackage.findById(req.params.id);
  
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  // Soft delete by setting is_active to false
  await TourPackage.update(req.params.id, { is_active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const addItinerary = catchAsync(async (req, res, next) => {
  const tour = await TourPackage.findById(req.params.tourId);
  
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  const itinerary = await TourPackage.addItinerary(req.params.tourId, req.body);

  res.status(201).json({
    status: 'success',
    data: { itinerary }
  });
});

export const checkAvailability = catchAsync(async (req, res, next) => {
  const { tourId } = req.params;
  const { date, guests } = req.query;

  const tour = await TourPackage.findById(tourId);
  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  const availability = await TourPackage.checkAvailability(tourId, date, guests);

  res.status(200).json({
    status: 'success',
    data: {
      available: !!availability,
      slots: availability?.available_slots || 0
    }
  });
});

export const getFeaturedTours = catchAsync(async (req, res, next) => {
  const result = await TourPackage.findAll({ is_featured: true }, { limit: 6 });

  res.status(200).json({
    status: 'success',
    results: result.tours.length,
    data: { tours: result.tours }
  });
});

export const searchTours = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new AppError('Please provide a search query', 400));
  }

  const result = await TourPackage.findAll(
    { search: query },
    { limit: 20, sort_by: 'views_count', sort_order: 'DESC' }
  );

  res.status(200).json({
    status: 'success',
    results: result.tours.length,
    data: { tours: result.tours }
  });
});