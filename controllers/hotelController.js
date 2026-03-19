import { Hotel } from '../models/Hotel.js';
import { Destination } from '../models/Destination.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/CatchAsync.js';
import { cloudinaryService } from '../services/cloudinaryService.js';
import { googleMapsService } from '../services/googleMapsService.js';

// Get all hotels
export const getAllHotels = catchAsync(async (req, res, next) => {
  const filters = {
    destination_id: req.query.destination,
    hotel_type: req.query.type,
    min_price: req.query.minPrice,
    max_price: req.query.maxPrice,
    min_rating: req.query.minRating,
    amenities: req.query.amenities,
    search: req.query.search
  };

  const pagination = {
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0,
    sort_by: req.query.sortBy || 'created_at',
    sort_order: req.query.sortOrder || 'DESC'
  };

  const result = await Hotel.findAll(filters, pagination);

  res.status(200).json({
    status: 'success',
    results: result.hotels.length,
    data: result
  });
});

// Get single hotel
export const getHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findBySlug(req.params.slug);

  if (!hotel) {
    return next(new AppError('No hotel found with that slug', 404));
  }

  // Get nearby hotels
  const nearby = await Hotel.getNearby(
    hotel.latitude, 
    hotel.longitude, 
    10, 
    5
  );

  res.status(200).json({
    status: 'success',
    data: {
      hotel,
      nearby: nearby.filter(h => h.id !== hotel.id)
    }
  });
});

// Create hotel
export const createHotel = catchAsync(async (req, res, next) => {
  // Check if destination exists
  if (req.body.destination_id) {
    const destination = await Destination.findById(req.body.destination_id);
    if (!destination) {
      return next(new AppError('Destination not found', 404));
    }
  }

  // Generate slug from name
  if (req.body.name && !req.body.slug) {
    req.body.slug = req.body.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  }

  // Geocode address if coordinates not provided
  if (req.body.address && (!req.body.latitude || !req.body.longitude)) {
    try {
      const geocodeResult = await googleMapsService.geocode(req.body.address);
      if (geocodeResult) {
        req.body.latitude = geocodeResult.geometry.location.lat;
        req.body.longitude = geocodeResult.geometry.location.lng;
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
      // Continue without coordinates
    }
  }

  // Upload featured image if present
  if (req.files?.featured_image) {
    const result = await cloudinaryService.uploadFromBuffer(
      req.files.featured_image[0].buffer,
      'nyle-travel/hotels'
    );
    req.body.featured_image = result.secure_url;
  }

  // Upload gallery images if present
  if (req.files?.gallery_images) {
    const uploadPromises = req.files.gallery_images.map(file =>
      cloudinaryService.uploadFromBuffer(file.buffer, 'nyle-travel/hotels/gallery')
    );
    const results = await Promise.all(uploadPromises);
    req.body.gallery_images = results.map(r => r.secure_url);
  }

  const hotel = await Hotel.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { hotel }
  });
});

// Update hotel
export const updateHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  // Upload new featured image if present
  if (req.files?.featured_image) {
    const result = await cloudinaryService.uploadFromBuffer(
      req.files.featured_image[0].buffer,
      'nyle-travel/hotels'
    );
    req.body.featured_image = result.secure_url;
  }

  // Upload new gallery images if present
  if (req.files?.gallery_images) {
    const uploadPromises = req.files.gallery_images.map(file =>
      cloudinaryService.uploadFromBuffer(file.buffer, 'nyle-travel/hotels/gallery')
    );
    const results = await Promise.all(uploadPromises);
    req.body.gallery_images = [
      ...(hotel.gallery_images || []),
      ...results.map(r => r.secure_url)
    ];
  }

  const updatedHotel = await Hotel.update(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: { hotel: updatedHotel }
  });
});

// Delete hotel
export const deleteHotel = catchAsync(async (req, res, next) => {
  const hotel = await Hotel.findById(req.params.id);

  if (!hotel) {
    return next(new AppError('No hotel found with that ID', 404));
  }

  await Hotel.delete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// Get hotels by destination
export const getHotelsByDestination = catchAsync(async (req, res, next) => {
  const { destinationId } = req.params;

  const destination = await Destination.findById(destinationId);
  if (!destination) {
    return next(new AppError('Destination not found', 404));
  }

  const filters = {
    hotel_type: req.query.type,
    min_price: req.query.minPrice,
    max_price: req.query.maxPrice,
    min_rating: req.query.minRating
  };

  const pagination = {
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0
  };

  const result = await Hotel.findByDestination(destinationId, filters, pagination);

  res.status(200).json({
    status: 'success',
    results: result.hotels.length,
    data: result
  });
});

// Check availability
export const checkAvailability = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;
  const { check_in, check_out, room_type } = req.query;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return next(new AppError('Hotel not found', 404));
  }

  const availability = await Hotel.checkAvailability(
    hotelId, 
    check_in, 
    check_out, 
    room_type
  );

  res.status(200).json({
    status: 'success',
    data: availability
  });
});

// Get featured hotels
export const getFeaturedHotels = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 6;
  
  const hotels = await Hotel.getFeatured(limit);

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: { hotels }
  });
});

// Get luxury hotels
export const getLuxuryHotels = catchAsync(async (req, res, next) => {
  const limit = parseInt(req.query.limit) || 10;
  
  const hotels = await Hotel.getLuxuryHotels(limit);

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: { hotels }
  });
});

// Search hotels
export const searchHotels = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return next(new AppError('Please provide a search query', 400));
  }

  const hotels = await Hotel.search(query, 20);

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: { hotels }
  });
});

// Get nearby hotels
export const getNearbyHotels = catchAsync(async (req, res, next) => {
  const { latitude, longitude } = req.query;
  const radius = parseInt(req.query.radius) || 10;
  const limit = parseInt(req.query.limit) || 10;

  if (!latitude || !longitude) {
    return next(new AppError('Please provide latitude and longitude', 400));
  }

  const hotels = await Hotel.getNearby(
    parseFloat(latitude),
    parseFloat(longitude),
    radius,
    limit
  );

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: { hotels }
  });
});

// Get hotels by price range
export const getHotelsByPriceRange = catchAsync(async (req, res, next) => {
  const { minPrice, maxPrice } = req.query;
  const limit = parseInt(req.query.limit) || 50;

  if (!minPrice || !maxPrice) {
    return next(new AppError('Please provide minPrice and maxPrice', 400));
  }

  const hotels = await Hotel.findByPriceRange(
    parseFloat(minPrice),
    parseFloat(maxPrice),
    limit
  );

  res.status(200).json({
    status: 'success',
    results: hotels.length,
    data: { hotels }
  });
});

// Get hotel statistics
export const getHotelStats = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;

  const stats = await Hotel.getStats(hotelId);

  res.status(200).json({
    status: 'success',
    data: { stats }
  });
});

// Room type management
export const addRoomType = catchAsync(async (req, res, next) => {
  const { hotelId } = req.params;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return next(new AppError('Hotel not found', 404));
  }

  const roomTypes = await Hotel.addRoomType(hotelId, req.body);

  res.status(201).json({
    status: 'success',
    data: { roomTypes }
  });
});

export const updateRoomType = catchAsync(async (req, res, next) => {
  const { hotelId, roomTypeIndex } = req.params;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return next(new AppError('Hotel not found', 404));
  }

  const roomTypes = await Hotel.updateRoomType(
    hotelId, 
    parseInt(roomTypeIndex), 
    req.body
  );

  if (!roomTypes) {
    return next(new AppError('Room type not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { roomTypes }
  });
});

export const removeRoomType = catchAsync(async (req, res, next) => {
  const { hotelId, roomTypeIndex } = req.params;

  const hotel = await Hotel.findById(hotelId);
  if (!hotel) {
    return next(new AppError('Hotel not found', 404));
  }

  const roomTypes = await Hotel.removeRoomType(hotelId, parseInt(roomTypeIndex));

  if (!roomTypes) {
    return next(new AppError('Room type not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { roomTypes }
  });
});