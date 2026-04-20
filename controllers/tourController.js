import { TourPackage } from '../models/TourPackage.js';

/**
 * Public Tour Controller
 * Handles non-admin tour operations
 */
export const getAllTours = async (req, res, next) => {
  try {
    const {
      destination,
      difficulty,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      isFeatured,
      search,
      page = 1,
      limit = 12,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const filters = {
      destination_id: destination,
      difficulty_level: difficulty,
      min_price: minPrice,
      max_price: maxPrice,
      min_duration: minDuration,
      max_duration: maxDuration,
      is_featured: isFeatured === 'true',
      search
    };

    const pagination = {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      sort_by: sort,
      sort_order: order
    };

    const result = await TourPackage.findAll(filters, pagination);

    res.status(200).json({
      status: 'success',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getTourBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const tour = await TourPackage.findBySlug(slug);

    if (!tour) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour package not found'
      });
    }

    // Get itinerary
    const itinerary = await TourPackage.getItineraries(tour.id);
    
    // Get availability for the next 6 months
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);
    
    const availability = await TourPackage.getAvailability(
      tour.id, 
      startDate.toISOString().split('T')[0], 
      endDate.toISOString().split('T')[0]
    );

    // Get similar tours
    const similarTours = await TourPackage.findSimilar(tour.id, tour.destination_id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
        itinerary,
        availability,
        similarTours
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedTours = async (req, res, next) => {
  try {
    const result = await TourPackage.findAll({ is_featured: true }, { limit: 6 });
    res.status(200).json({
      status: 'success',
      data: result.tours
    });
  } catch (error) {
    next(error);
  }
};
