import { TourPackage } from '../../models/TourPackage.js';
import { query } from '../../config/db.js';

/**
 * Admin Tour Controller
 * Handles tour management operations
 */
export const createTour = async (req, res, next) => {
  try {
    const tour = await TourPackage.create(req.body);
    res.status(201).json({
      status: 'success',
      data: tour
    });
  } catch (error) {
    next(error);
  }
};

export const updateTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tour = await TourPackage.update(id, req.body);
    
    if (!tour) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour package not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: tour
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTour = async (req, res, next) => {
  try {
    const { id } = req.params;
    // We do a soft delete by setting is_active to false
    const tour = await TourPackage.update(id, { is_active: false });
    
    if (!tour) {
      return res.status(404).json({
        status: 'error',
        message: 'Tour package not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Tour package deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const addItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const itinerary = await TourPackage.addItinerary(id, req.body);
    res.status(201).json({
      status: 'success',
      data: itinerary
    });
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { itineraries } = req.body; // Array of itinerary objects

    // Delete existing itineraries and insert new ones
    await query('DELETE FROM tour_itineraries WHERE tour_package_id = $1', [id]);
    
    const createdItineraries = [];
    for (const item of itineraries) {
      const created = await TourPackage.addItinerary(id, item);
      createdItineraries.push(created);
    }

    res.status(200).json({
      status: 'success',
      data: createdItineraries
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const { id } = req.params; // tour_package_id
    const { availability } = req.body; // Array of availability objects

    // Delete future availability and insert new
    await query('DELETE FROM tour_availability WHERE tour_package_id = $1 AND start_date >= CURRENT_DATE', [id]);
    
    for (const item of availability) {
      const { start_date, end_date, total_slots, special_price, is_available } = item;
      await query(
        `INSERT INTO tour_availability (tour_package_id, start_date, end_date, total_slots, available_slots, special_price, is_available)
         VALUES ($1, $2, $3, $4, $4, $5, $6)`,
        [id, start_date, end_date, total_slots, special_price, is_available]
      );
    }

    res.status(200).json({
      status: 'success',
      message: 'Availability updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getTourStats = async (req, res, next) => {
  try {
    const statsResult = await query(`
      SELECT 
        COUNT(*) as total_tours,
        SUM(booking_count) as total_bookings,
        SUM(views_count) as total_views,
        AVG(base_price) as average_price
      FROM tour_packages
      WHERE is_active = TRUE
    `);

    const popularTours = await query(`
      SELECT name, booking_count, views_count
      FROM tour_packages
      WHERE is_active = TRUE
      ORDER BY booking_count DESC
      LIMIT 5
    `);

    res.status(200).json({
      status: 'success',
      data: {
        overall: statsResult.rows[0],
        popular: popularTours.rows
      }
    });
  } catch (error) {
    next(error);
  }
};
