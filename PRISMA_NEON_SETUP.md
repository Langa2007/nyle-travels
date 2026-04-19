# Prisma with Neon DB Setup Guide

## Overview
This project now uses **Prisma ORM** with **Neon DB** (serverless PostgreSQL) for data management.

## Prerequisites
- Node.js 18+ installed
- A Neon DB account (https://neon.tech)
- Neon project created with a database connection string

## Setup Instructions

### 1. Get Your Neon Connection String
1. Go to https://console.neon.tech
2. Create a new project or select existing
3. Copy the connection string from the dashboard (format: `postgresql://user:password@host/dbname`)
4. The connection string should include `?sslmode=require` at the end

### 2. Configure Environment Variables

#### Root Level (.env)
Create or update `.env` file in the project root:
```env
# Neon Database URL (primary)
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require

# Alternative environment-specific variables
DATABASE_URL_NEON=postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require
DATABASE_URL_LOCAL=postgresql://user:password@localhost:5432/nyle_travels
```

#### Frontend (.env.local)
Create or update `frontend/.env.local`:
```env
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require
```

### 3. Install Dependencies

```bash
# Root dependencies
npm install @prisma/client dotenv

# If not already installed globally
npm install -g prisma
```

### 4. Generate Prisma Client

```bash
# From root directory
npx prisma generate

# From frontend directory (if using separate Prisma setup)
cd frontend
npx prisma generate
```

### 5. Create/Update Database Schema

#### Option A: Use Existing Database
If you already have a database with tables, introspect it:
```bash
npx prisma db pull
```

#### Option B: Create New Schema from Prisma
If starting fresh:
```bash
npx prisma migrate dev --name init
```

This will:
- Create all tables based on schema.prisma
- Generate migration files
- Update your database

### 6. Seed Initial Data (Optional)

```bash
# Run the tour seeding script
node scripts/seed-tours.js

# Or create custom seed scripts
npx prisma db seed
```

## Using Prisma in Your Code

### In Backend Routes/Controllers

**Before (using pg):**
```javascript
import { query } from '../config/db.js';

const tours = await query('SELECT * FROM tour_packages');
```

**After (using Prisma):**
```javascript
import { prisma } from '../lib/prisma.js';

const tours = await prisma.tourPackage.findMany();
```

### Common Prisma Operations

```javascript
import { prisma } from '../lib/prisma.js';

// Create
const tour = await prisma.tourPackage.create({
  data: {
    name: '3-Day Safari',
    slug: '3-day-safari',
    // ... other fields
  }
});

// Read
const tour = await prisma.tourPackage.findUnique({
  where: { slug: '3-day-safari' }
});

const allTours = await prisma.tourPackage.findMany({
  where: { is_active: true },
  include: { destination: true }
});

// Update
const updated = await prisma.tourPackage.update({
  where: { id: tourId },
  data: { name: 'Updated Name' }
});

// Delete
await prisma.tourPackage.delete({
  where: { id: tourId }
});

// Complex queries
const toursWithReviews = await prisma.tourPackage.findMany({
  include: {
    destination: true,
    reviews: {
      where: { status: 'published' },
      orderBy: { created_at: 'desc' }
    }
  }
});
```

### Frontend API Routes

If using Next.js API routes with Prisma:

```javascript
// pages/api/tours.js
import { prisma } from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    const tours = await prisma.tourPackage.findMany({
      where: { is_active: true },
      include: { destination: true }
    });
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

## Database Migrations

### Create a Migration

After modifying `schema.prisma`:
```bash
npx prisma migrate dev --name descriptive_name
```

Example:
```bash
npx prisma migrate dev --name add_tour_ratings
```

### View Migration Status
```bash
npx prisma migrate status
```

### Resolve Migration Issues
```bash
# Reset database (CAUTION: Loss of data!)
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

## Prisma Studio

Visually manage your database:
```bash
npx prisma studio
```

Opens a UI at http://localhost:5555 to browse and edit data.

## Production Deployment

### Environment Variables
Ensure `DATABASE_URL` is set in your production environment:

```bash
# For Vercel
vercel env add DATABASE_URL postgresql://...
```

### Prisma in Production
```bash
# Generate client for production
npx prisma generate

# Deploy migrations
npx prisma migrate deploy

# Or during build (if using Vercel/build scripts)
npx prisma migrate deploy && npm run build
```

## Troubleshooting

### Connection Timeout
- Check if Neon database is running
- Verify DATABASE_URL is correct
- Check SSL mode (use `?sslmode=require` for Neon)
- Check firewall/network connectivity

### Migration Conflicts
```bash
# View pending migrations
npx prisma migrate status

# Create recovery migration
npx prisma migrate resolve --rolled-back migration_name

# Reset and start fresh (development only)
npx prisma migrate reset
```

### Prisma Client Out of Date
```bash
npx prisma generate
```

## Switching from Raw SQL to Prisma

### Models to Update

1. **TourPackage Model** - Switch from `TourPackage.findAll()` to `prisma.tourPackage.findMany()`
2. **Hotel Model** - Switch from `Hotel.create()` to `prisma.hotel.create()`
3. **Booking Model** - Switch from raw queries to prisma operations
4. **User Model** - Update authentication flow

### Example Migration

**Old code (config/db.js):**
```javascript
export const getAllTours = async (filters) => {
  const result = await query(
    'SELECT * FROM tour_packages WHERE is_active = $1',
    [true]
  );
  return result.rows;
};
```

**New code (with Prisma):**
```javascript
export const getAllTours = async (filters) => {
  return await prisma.tourPackage.findMany({
    where: { is_active: true },
    include: { destination: true }
  });
};
```

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Neon Database](https://neon.tech)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/reference/database-reference/connection-urls/postgresql)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
