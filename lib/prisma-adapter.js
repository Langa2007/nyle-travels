/**
 * Prisma Adapter for Backend Models
 * 
 * This file provides adapter functions to migrate from raw SQL/pg
 * models to Prisma ORM models. Used in controllers and route handlers.
 * 
 * Usage:
 * import { tourAdapter } from './prisma-adapter.js';
 * const tours = await tourAdapter.findAll(filters);
 */

import { prisma } from '../lib/prisma.js';
import AppError from '../utils/AppError.js';

// ============================================================
// TOUR PACKAGE ADAPTER
// ============================================================

export const tourAdapter = {
  async findAll(filters = {}, pagination = {}) {
    const {
      destination_id,
      difficulty_level,
      min_price,
      max_price,
      min_duration,
      max_duration,
      is_featured,
      search,
    } = filters;

    const {
      limit = 20,
      offset = 0,
      sort_by = 'created_at',
      sort_order = 'desc',
    } = pagination;

    const where = {};

    if (destination_id) {
      where.destination_id = destination_id;
    }

    if (difficulty_level && difficulty_level !== 'all') {
      where.difficulty_level = difficulty_level;
    }

    if (min_price || max_price) {
      where.base_price = {};
      if (min_price) where.base_price.gte = parseFloat(min_price);
      if (max_price) where.base_price.lte = parseFloat(max_price);
    }

    if (min_duration || max_duration) {
      where.duration_days = {};
      if (min_duration) where.duration_days.gte = parseInt(min_duration);
      if (max_duration) where.duration_days.lte = parseInt(max_duration);
    }

    if (is_featured) {
      where.is_featured = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { short_description: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    where.is_active = true;

    const [tours, total] = await Promise.all([
      prisma.tourPackage.findMany({
        where,
        include: {
          destination: true,
          itineraries: { orderBy: { day_number: 'asc' } },
        },
        orderBy: { [sort_by]: sort_order.toLowerCase() },
        skip: offset,
        take: limit,
      }),
      prisma.tourPackage.count({ where }),
    ]);

    return {
      tours,
      total,
      limit,
      offset,
      pages: Math.ceil(total / limit),
    };
  },

  async findBySlug(slug) {
    return await prisma.tourPackage.findUnique({
      where: { slug },
      include: {
        destination: true,
        itineraries: { orderBy: { day_number: 'asc' } },
        availability: {
          where: { is_available: true },
          orderBy: { start_date: 'asc' },
        },
      },
    });
  },

  async findById(id) {
    return await prisma.tourPackage.findUnique({
      where: { id },
      include: {
        destination: true,
        itineraries: { orderBy: { day_number: 'asc' } },
      },
    });
  },

  async create(data) {
    return await prisma.tourPackage.create({
      data: {
        ...data,
        destination_id: data.destination_id || null,
      },
      include: { destination: true },
    });
  },

  async update(id, data) {
    return await prisma.tourPackage.update({
      where: { id },
      data,
      include: { destination: true },
    });
  },

  async delete(id) {
    return await prisma.tourPackage.delete({
      where: { id },
    });
  },

  async getFeatured(limit = 5) {
    return await prisma.tourPackage.findMany({
      where: {
        is_featured: true,
        is_active: true,
      },
      include: { destination: true },
      take: limit,
      orderBy: { booking_count: 'desc' },
    });
  },

  async getItineraries(tourId) {
    return await prisma.tourItinerary.findMany({
      where: { tour_package_id: tourId },
      orderBy: { day_number: 'asc' },
    });
  },

  async addItinerary(tourId, data) {
    return await prisma.tourItinerary.create({
      data: {
        tour_package_id: tourId,
        ...data,
      },
    });
  },

  async findSimilar(tourId, destinationId, limit = 3) {
    return await prisma.tourPackage.findMany({
      where: {
        destination_id: destinationId,
        id: { not: tourId },
        is_active: true,
      },
      include: { destination: true },
      take: limit,
      orderBy: { booking_count: 'desc' },
    });
  },
};

// ============================================================
// HOTEL ADAPTER
// ============================================================

export const hotelAdapter = {
  async findAll(filters = {}, pagination = {}) {
    const { destination_id, hotel_type, min_rating, search } = filters;
    const { limit = 20, offset = 0 } = pagination;

    const where = { is_active: true };

    if (destination_id) where.destination_id = destination_id;
    if (hotel_type) where.hotel_type = hotel_type;
    if (min_rating) where.star_rating = { gte: min_rating };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { short_description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [hotels, total] = await Promise.all([
      prisma.hotel.findMany({
        where,
        include: { destination: true },
        skip: offset,
        take: limit,
      }),
      prisma.hotel.count({ where }),
    ]);

    return { hotels, total, limit, offset };
  },

  async findBySlug(slug) {
    return await prisma.hotel.findUnique({
      where: { slug },
      include: {
        destination: true,
        reviews: { where: { status: 'published' } },
      },
    });
  },

  async getFeatured(limit = 5) {
    return await prisma.hotel.findMany({
      where: { is_active: true },
      include: { destination: true },
      take: limit,
    });
  },
};

// ============================================================
// BOOKING ADAPTER
// ============================================================

export const bookingAdapter = {
  async create(data) {
    return await prisma.booking.create({
      data: {
        booking_number: `BK-${Date.now()}`,
        ...data,
      },
      include: {
        user: true,
        tour_package: true,
        participants: true,
      },
    });
  },

  async findByNumber(bookingNumber) {
    return await prisma.booking.findUnique({
      where: { booking_number: bookingNumber },
      include: {
        user: true,
        tour_package: true,
        participants: true,
        payments: true,
      },
    });
  },

  async findById(id) {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        tour_package: true,
        participants: true,
        payments: true,
      },
    });
  },

  async findUserBookings(userId, pagination = {}) {
    const { limit = 10, offset = 0 } = pagination;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where: { user_id: userId },
        include: { tour_package: true },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.booking.count({ where: { user_id: userId } }),
    ]);

    return { bookings, total };
  },

  async update(id, data) {
    return await prisma.booking.update({
      where: { id },
      data,
      include: { tour_package: true, participants: true },
    });
  },

  async cancel(id, reason) {
    return await prisma.booking.update({
      where: { id },
      data: {
        status: 'cancelled',
      },
    });
  },
};

// ============================================================
// USER ADAPTER
// ============================================================

export const userAdapter = {
  async create(data) {
    return await prisma.user.create({
      data: {
        ...data,
        role: data.role || 'user',
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
        created_at: true,
      },
    });
  },

  async findByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  },

  async findById(id) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone: true,
        profile_image: true,
        role: true,
        created_at: true,
      },
    });
  },

  async update(id, data) {
    return await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role: true,
      },
    });
  },

  async delete(id) {
    return await prisma.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  },
};

// ============================================================
// REVIEW ADAPTER
// ============================================================

export const reviewAdapter = {
  async create(data) {
    return await prisma.review.create({
      data: {
        ...data,
        status: 'pending',
      },
      include: { user: true },
    });
  },

  async findTourReviews(tourId, pagination = {}) {
    const { limit = 10, offset = 0 } = pagination;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          tour_package_id: tourId,
          status: 'published',
        },
        include: { user: true },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.review.count({
        where: { tour_package_id: tourId, status: 'published' },
      }),
    ]);

    return { reviews, total };
  },

  async findHotelReviews(hotelId, pagination = {}) {
    const { limit = 10, offset = 0 } = pagination;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: {
          hotel_id: hotelId,
          status: 'published',
        },
        include: { user: true },
        orderBy: { created_at: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.review.count({
        where: { hotel_id: hotelId, status: 'published' },
      }),
    ]);

    return { reviews, total };
  },

  async update(id, data) {
    return await prisma.review.update({
      where: { id },
      data,
      include: { user: true },
    });
  },

  async approve(id) {
    return await prisma.review.update({
      where: { id },
      data: { status: 'published' },
      include: { user: true },
    });
  },
};

// ============================================================
// PAYMENT ADAPTER
// ============================================================

export const paymentAdapter = {
  async create(data) {
    return await prisma.payment.create({
      data,
      include: { booking: true },
    });
  },

  async findByBooking(bookingId) {
    return await prisma.payment.findMany({
      where: { booking_id: bookingId },
      orderBy: { created_at: 'desc' },
    });
  },

  async update(id, data) {
    return await prisma.payment.update({
      where: { id },
      data,
    });
  },

  async markAsComplete(id, transactionId) {
    return await prisma.payment.update({
      where: { id },
      data: {
        status: 'completed',
        transaction_id: transactionId,
        payment_date: new Date(),
      },
    });
  },
};

export default {
  tourAdapter,
  hotelAdapter,
  bookingAdapter,
  userAdapter,
  reviewAdapter,
  paymentAdapter,
};
