# Prisma Adapter Quick Reference

## Import Adapters

```javascript
import { 
  tourAdapter, 
  hotelAdapter, 
  bookingAdapter, 
  userAdapter, 
  reviewAdapter, 
  paymentAdapter 
} from '../lib/prisma-adapter.js';
```

## Tour Package Methods

```javascript
// Get all tours with filters
const result = await tourAdapter.findAll(
  { destination_id, difficulty_level, search },
  { limit: 20, offset: 0 }
);
// Returns: { tours: [], total, limit, offset, pages }

// Get single tour
const tour = await tourAdapter.findBySlug('3-day-safari');
const tour = await tourAdapter.findById('uuid');

// Create tour
const tour = await tourAdapter.create({
  name: '3-Day Safari',
  slug: '3-day-safari',
  // ...
});

// Update tour
const updated = await tourAdapter.update(id, {
  name: 'Updated Safari'
});

// Delete tour
await tourAdapter.delete(id);

// Get featured tours
const featured = await tourAdapter.getFeatured(limit);

// Get tour itineraries
const itineraries = await tourAdapter.getItineraries(tourId);

// Add itinerary
const itinerary = await tourAdapter.addItinerary(tourId, {
  day_number: 1,
  title: 'Day 1',
  // ...
});

// Find similar tours
const similar = await tourAdapter.findSimilar(tourId, destinationId);
```

## Hotel Methods

```javascript
// Get all hotels
const result = await hotelAdapter.findAll(
  { destination_id, hotel_type, min_rating },
  { limit: 20, offset: 0 }
);

// Get single hotel
const hotel = await hotelAdapter.findBySlug('luxury-lodge');

// Get featured hotels
const featured = await hotelAdapter.getFeatured();
```

## Booking Methods

```javascript
// Create booking
const booking = await bookingAdapter.create({
  user_id: userId,
  tour_package_id: tourId,
  start_date: new Date(),
  // ...
});

// Get booking by number
const booking = await bookingAdapter.findByNumber('BK-1234567890');

// Get booking by ID
const booking = await bookingAdapter.findById(id);

// Get user bookings
const { bookings, total } = await bookingAdapter.findUserBookings(
  userId,
  { limit: 10, offset: 0 }
);

// Update booking
const updated = await bookingAdapter.update(id, {
  status: 'confirmed'
});

// Cancel booking
const cancelled = await bookingAdapter.cancel(id, 'Customer request');
```

## User Methods

```javascript
// Create user
const user = await userAdapter.create({
  email: 'user@example.com',
  first_name: 'John',
  // ...
});

// Get user by email
const user = await userAdapter.findByEmail('user@example.com');

// Get user by ID
const user = await userAdapter.findById(id);

// Update user
const updated = await userAdapter.update(id, {
  first_name: 'Jane'
});

// Soft delete user
await userAdapter.delete(id);
```

## Review Methods

```javascript
// Create review
const review = await reviewAdapter.create({
  user_id: userId,
  tour_package_id: tourId,
  rating: 5,
  comment: 'Great experience!',
  // ...
});

// Get tour reviews
const { reviews, total } = await reviewAdapter.findTourReviews(
  tourId,
  { limit: 10, offset: 0 }
);

// Get hotel reviews
const { reviews, total } = await reviewAdapter.findHotelReviews(
  hotelId,
  { limit: 10, offset: 0 }
);

// Update review
const updated = await reviewAdapter.update(id, {
  rating: 4
});

// Approve review
const approved = await reviewAdapter.approve(id);
```

## Payment Methods

```javascript
// Create payment
const payment = await paymentAdapter.create({
  booking_id: bookingId,
  amount: 1000,
  payment_method: 'stripe',
  // ...
});

// Get payments for booking
const payments = await paymentAdapter.findByBooking(bookingId);

// Update payment
const updated = await paymentAdapter.update(id, {
  status: 'pending'
});

// Mark as complete
const completed = await paymentAdapter.markAsComplete(id, transactionId);
```

## Common Controller Patterns

### GET All with Pagination
```javascript
export const getAll = catchAsync(async (req, res, next) => {
  const result = await tourAdapter.findAll(
    { search: req.query.search },
    { 
      limit: parseInt(req.query.limit) || 20,
      offset: parseInt(req.query.offset) || 0
    }
  );

  res.status(200).json({
    status: 'success',
    results: result.tours.length,
    total: result.total,
    data: result.tours
  });
});
```

### GET Single with 404
```javascript
export const getOne = catchAsync(async (req, res, next) => {
  const item = await tourAdapter.findBySlug(req.params.slug);

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: item
  });
});
```

### POST Create
```javascript
export const create = catchAsync(async (req, res, next) => {
  const item = await tourAdapter.create(req.body);

  res.status(201).json({
    status: 'success',
    data: item
  });
});
```

### PATCH Update
```javascript
export const update = catchAsync(async (req, res, next) => {
  const item = await tourAdapter.update(req.params.id, req.body);

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: item
  });
});
```

### DELETE
```javascript
export const delete = catchAsync(async (req, res, next) => {
  const item = await tourAdapter.delete(req.params.id);

  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
```

## Error Handling

```javascript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

try {
  await tourAdapter.create(data);
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint
        return next(new AppError('Duplicate entry', 409));
      case 'P2025': // Not found
        return next(new AppError('Record not found', 404));
      case 'P2003': // Foreign key constraint
        return next(new AppError('Invalid reference', 400));
      default:
        return next(new AppError(error.message, 500));
    }
  }
  next(error);
}
```

## Using Raw Prisma (When Adapter Doesn't Exist)

```javascript
import { prisma } from '../lib/prisma.js';

// Direct Prisma calls for custom logic
const tours = await prisma.tourPackage.findMany({
  where: {
    is_active: true,
    base_price: { lte: 1000 }
  },
  include: { destination: true },
  orderBy: { created_at: 'desc' },
  take: 10
});
```

## Transactions

```javascript
import { prisma } from '../lib/prisma.js';

const result = await prisma.$transaction(async (tx) => {
  const booking = await tx.booking.create({ data: bookingData });
  await tx.tourPackage.update({
    where: { id: booking.tour_package_id },
    data: { booking_count: { increment: 1 } }
  });
  return booking;
});
```

## Resources

- 📚 [Prisma Docs](https://www.prisma.io/docs)
- 🔧 [Adapter Implementation](../lib/prisma-adapter.js)
- 📖 [Full Migration Guide](MIGRATION_GUIDE.md)
- ⚙️ [Setup Guide](PRISMA_NEON_SETUP.md)
