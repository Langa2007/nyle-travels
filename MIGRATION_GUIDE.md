# Migrating Controllers to Prisma

This guide walks you through converting existing controllers from raw SQL queries to Prisma ORM using adapters.

## Quick Start

### 1. Import the Adapter
```javascript
import { tourAdapter } from '../lib/prisma-adapter.js';
```

### 2. Replace Model Methods
**Before (using models/TourPackage.js):**
```javascript
import { TourPackage } from '../models/TourPackage.js';

const tours = await TourPackage.findAll(filters, pagination);
```

**After (using Prisma adapter):**
```javascript
import { tourAdapter } from '../lib/prisma-adapter.js';

const tours = await tourAdapter.findAll(filters, pagination);
```

## Controller Migration Examples

### Tour Controller Example

#### Before (Raw SQL Pattern)
```javascript
// controllers/tourController.js
import { TourPackage } from '../models/TourPackage.js';

export const getAllTours = catchAsync(async (req, res, next) => {
  const filters = {
    destination_id: req.query.destination,
    difficulty_level: req.query.difficulty,
    // ...
  };

  const pagination = {
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0,
    // ...
  };

  const result = await TourPackage.findAll(filters, pagination);

  res.status(200).json({
    status: 'success',
    results: result.tours.length,
    data: result
  });
});
```

#### After (Prisma Adapter Pattern)
```javascript
// controllers/tourController.js
import { tourAdapter } from '../lib/prisma-adapter.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/CatchAsync.js';

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

  const result = await tourAdapter.findAll(filters, pagination);

  res.status(200).json({
    status: 'success',
    results: result.tours.length,
    data: result
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await tourAdapter.findBySlug(req.params.slug);

  if (!tour) {
    return next(new AppError('No tour found with that slug', 404));
  }

  const itineraries = tour.itineraries;
  const similar = await tourAdapter.findSimilar(tour.id, tour.destination_id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
      itineraries,
      similar
    }
  });
});

export const createTour = catchAsync(async (req, res, next) => {
  const tour = await tourAdapter.create(req.body);

  res.status(201).json({
    status: 'success',
    data: tour
  });
});

export const updateTour = catchAsync(async (req, res, next) => {
  const tour = await tourAdapter.update(req.params.id, req.body);

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: tour
  });
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await tourAdapter.delete(req.params.id);

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const getFeaturedTours = catchAsync(async (req, res, next) => {
  const tours = await tourAdapter.getFeatured();

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: tours
  });
});

export const addItinerary = catchAsync(async (req, res, next) => {
  const itinerary = await tourAdapter.addItinerary(req.params.tourId, req.body);

  res.status(201).json({
    status: 'success',
    data: itinerary
  });
});
```

## Complete Migration Checklist

### Phase 1: Core Models (Priority Order)

- [ ] **User Adapter** - `userAdapter`
  - findByEmail()
  - create()
  - update()
  - findById()

- [ ] **TourPackage Adapter** - `tourAdapter`
  - findAll()
  - findBySlug()
  - create()
  - update()
  - delete()

- [ ] **Hotel Adapter** - `hotelAdapter`
  - findAll()
  - findBySlug()
  - getFeatured()

- [ ] **Booking Adapter** - `bookingAdapter`
  - create()
  - findByNumber()
  - findUserBookings()
  - update()

### Phase 2: Secondary Features

- [ ] **Review Adapter** - `reviewAdapter`
  - create()
  - findTourReviews()
  - findHotelReviews()

- [ ] **Payment Adapter** - `paymentAdapter`
  - create()
  - findByBooking()
  - update()

- [ ] **Destination Adapter** (to be created)
  - findAll()
  - findBySlug()
  - create()

### Phase 3: Verification

- [ ] All route handlers updated
- [ ] All controller methods tested
- [ ] Error handling preserved
- [ ] Validation still working
- [ ] Response format unchanged

## Error Handling

Prisma throws different error types. Update error handlers:

```javascript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

try {
  await tourAdapter.create(data);
} catch (error) {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      return next(new AppError('Record already exists', 409));
    }
    if (error.code === 'P2025') {
      // Record not found
      return next(new AppError('Record not found', 404));
    }
  }
  next(error);
}
```

## Transactions

For multi-step operations, use Prisma transactions:

```javascript
import { prisma } from '../lib/prisma.js';

export const complexOperation = catchAsync(async (req, res, next) => {
  const result = await prisma.$transaction(async (tx) => {
    // All operations use tx instead of prisma
    const booking = await tx.booking.create({ data: req.body });
    await tx.tourPackage.update({
      where: { id: booking.tour_package_id },
      data: { booking_count: { increment: 1 } }
    });
    return booking;
  });

  res.status(201).json({
    status: 'success',
    data: result
  });
});
```

## Testing

Update controller tests to mock adapters:

```javascript
import { jest } from '@jest/globals';
import { tourAdapter } from '../lib/prisma-adapter.js';

jest.mock('../lib/prisma-adapter.js');

describe('Tour Controller', () => {
  it('should return all tours', async () => {
    const mockTours = [
      { id: '1', name: 'Safari', slug: 'safari' }
    ];

    tourAdapter.findAll.mockResolvedValue({
      tours: mockTours,
      total: 1
    });

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const req = { query: {} };

    await getAllTours(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      results: 1,
      data: expect.objectContaining({ tours: mockTours })
    });
  });
});
```

## Performance Tips

1. **Use `include` wisely** - Only include related data when needed
   ```javascript
   // Good - only when needed
   await prisma.tour.findMany({
     include: { destination: true }
   });

   // Bad - unnecessary includes
   await tourAdapter.findAll(); // Already optimized in adapter
   ```

2. **Use `select` to limit fields**
   ```javascript
   await prisma.user.findUnique({
     where: { id: userId },
     select: {
       id: true,
       email: true,
       // Exclude password_hash
     }
   });
   ```

3. **Paginate large result sets**
   ```javascript
   await tourAdapter.findAll(filters, {
     limit: 20,
     offset: 0
   });
   ```

## Common Patterns

### Create with Relations
```javascript
await prisma.booking.create({
  data: {
    booking_number: `BK-${Date.now()}`,
    user_id: userId,
    tour_package_id: tourId,
    participants: {
      create: participantData
    }
  },
  include: { participants: true }
});
```

### Search Across Multiple Fields
```javascript
await prisma.tourPackage.findMany({
  where: {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ]
  }
});
```

### Count and Filter
```javascript
const [data, total] = await Promise.all([
  prisma.tourPackage.findMany({ where }),
  prisma.tourPackage.count({ where })
]);
```

## Need Help?

- Check [Prisma Documentation](https://www.prisma.io/docs/)
- Review `lib/prisma-adapter.js` for implemented patterns
- Check `PRISMA_NEON_SETUP.md` for database setup
