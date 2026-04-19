# Nyle Travels - Prisma + Neon Setup Checklist

## Phase 1: Prerequisites (1-2 minutes)

- [ ] **Create Neon Database Account**
  - Go to https://console.neon.tech
  - Sign up or login
  - Create new project
  - Copy connection string: `postgresql://user:password@region.neon.tech/dbname?sslmode=require`

- [ ] **Verify Node.js Version**
  - Run: `node --version`
  - Requirement: Node 16+ (recommended 18+)

## Phase 2: Environment Configuration (2-3 minutes)

- [ ] **Copy Environment Template**
  - File: `.env.example` → `.env`
  - Location: Root of project

- [ ] **Set Database URL**
  - Open: `.env`
  - Find: `DATABASE_URL=`
  - Replace with: Your Neon connection string
  - Example: `DATABASE_URL=postgresql://user:password@ep-cool-project.neon.tech/nyledb?sslmode=require`

- [ ] **Verify Other Env Variables**
  - Check: All required variables are set
  - Note: JWT_SECRET, EMAIL credentials optional for now

## Phase 3: Install Dependencies (2-5 minutes)

```bash
# Install all dependencies (includes @prisma/client)
npm install

# Verify Prisma install
npm list prisma @prisma/client
```

- [ ] **npm install completed**
  - Look for: `@prisma/client` and `prisma` in node_modules

## Phase 4: Generate Prisma Client (1-2 minutes)

```bash
# Generate Prisma client from schema
npx prisma generate
```

- [ ] **Prisma Generate Successful**
  - Output should say: "✔ Generated Prisma Client"
  - Check: `./.prisma/client/index.d.ts` file created

## Phase 5: Create Database Schema (3-5 minutes)

```bash
# Create initial migration and apply to database
npx prisma migrate dev --name init
```

- [ ] **Migration Created Successfully**
  - Check: `prisma/migrations/` folder created
  - Check: All tables exist in Neon database
  - Command to verify: `npx prisma db execute --stdin < check-tables.sql`

## Phase 6: Seed Initial Data (2-3 minutes)

```bash
# Seed tours and destinations
npm run prisma:seed
# OR manually:
# node scripts/seed-tours.js
```

- [ ] **Tours Seeded Successfully**
  - Tours created: 8 initial packages
  - Check data: `npx prisma studio` → browse TourPackage table

## Phase 7: Verify Database Connection (2-3 minutes)

```bash
# Open Prisma Studio (interactive DB browser)
npm run prisma:studio
```

- [ ] **Prisma Studio Opens**
  - URL: http://localhost:5555
  - Check tables: User, TourPackage, Destination, Hotel, Booking
  - Sample data visible: Maasai Mara, Diani Beach tours

- [ ] **Database Connection Confirmed**
  - Can see data in Neon database
  - No connection errors in the UI

## Phase 8: Test Backend API (3-5 minutes)

```bash
# Start development server
npm run dev
```

- [ ] **Backend Running**
  - URL: http://localhost:3000
  - No startup errors in console

- [ ] **Test API Endpoints**
  - GET `/api/tours` → Returns 8+ tours with full details
  - GET `/api/tours?search=safari` → Filters work
  - GET `/api/hotels` → Returns hotels
  - GET `/api/destinations` → Returns destinations

## Phase 9: Test Frontend Integration (2-3 minutes)

- [ ] **Start Frontend**
  ```bash
  cd frontend
  npm run dev
  ```

- [ ] **Test Tours Page**
  - Navigate: http://localhost:3001/tours
  - Filter by type, duration, destination
  - Click tour → Detail page loads
  - All data from database displays correctly

- [ ] **Test Hotels Page**
  - Navigate: http://localhost:3001/hotels
  - Click navbar filters
  - Hotel list loads with Neon data

## Phase 10: Extend Data (Optional - 15-30 minutes)

```bash
# Add 42 more Kenyan tours to seed file
# Edit: scripts/seed-tours.js
# Then re-seed:
npx prisma migrate reset  # Clears all data
npm run prisma:seed       # Re-seeds with full 50 tours
```

- [ ] **Extend Tours Database** (Optional)
  - Edit: [scripts/seed-tours.js](scripts/seed-tours.js)
  - Add: 42 more Kenyan tour packages
  - Categories: Beach, Adventure, Cultural, Wellness, Photography

## Phase 11: Migrate Controllers (Optional - 30-60 minutes)

```bash
# Update controllers to use adapters instead of raw SQL models
# Follow guide: MIGRATION_GUIDE.md

# Controllers to migrate (in order):
# 1. tourController.js - Replace TourPackage with tourAdapter
# 2. hotelController.js - Replace Hotel with hotelAdapter
# 3. bookingController.js - Replace Booking with bookingAdapter
# 4. userController (auth) - Replace User with userAdapter
# 5. reviewController.js - Replace Review with reviewAdapter
# 6. paymentController.js - Replace Payment with paymentAdapter
```

- [ ] **Tour Controller Migrated** (Optional)
  - File: [controllers/tourController.js](controllers/tourController.js)
  - Verify: All unit tests passing
  - Verify: API responses unchanged

- [ ] **All Controllers Migrated** (Optional)
  - Verify: No import errors
  - Verify: All routes working
  - Verify: Error handling works

## Troubleshooting

### Issue: "Cannot find module '@prisma/client'"
**Solution:**
```bash
npm install @prisma/client
npm install -D prisma
npm run prisma:generate
```

### Issue: "Error: getaddrinfo ENOTFOUND neon.tech"
**Solution:**
- Check: DATABASE_URL is correct in .env
- Check: Internet connection working
- Verify: Neon database is running (check console.neon.tech)
- Try: `npx prisma db push` to test connection

### Issue: "P1013: The provided database string is invalid"
**Solution:**
- Check: DATABASE_URL format is correct
- Example: `postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require`
- Verify: No special characters need URL encoding
- Try: Copy connection string again from Neon console

### Issue: "Migration already exists"
**Solution:**
```bash
# Skip existing and create new migration
npx prisma migrate dev --name init_2
```

### Issue: "Tables already exist" when running migrate
**Solution:**
```bash
# Option 1: Reset database (deletes all data)
npx prisma migrate reset

# Option 2: Skip and continue
# (Edit prisma/migrations to mark as applied)
```

## Useful Commands

| Command | Purpose |
|---------|---------|
| `npx prisma studio` | Interactive database browser |
| `npx prisma db push` | Push schema to database (no migrations) |
| `npx prisma migrate dev` | Create and apply migration |
| `npx prisma migrate deploy` | Deploy migration to production |
| `npx prisma migrate reset` | Delete all data, run migrations fresh |
| `npx prisma generate` | Regenerate Prisma client types |
| `npx prisma db execute --stdin < file.sql` | Run raw SQL |
| `npm run db:status` | Check database health |
| `npm run db:migrate` | Run custom migration script |

## Verification Checklist

After completing all phases, verify:

- [ ] `.env` has valid DATABASE_URL
- [ ] `npx prisma generate` runs without errors
- [ ] `npx prisma migrate status` shows migrations applied
- [ ] `npx prisma studio` opens and shows data
- [ ] Backend API `/api/tours` returns data
- [ ] Frontend `/tours` page loads with filters
- [ ] Hotel search still works
- [ ] No console errors in browser or terminal
- [ ] Admin panel shows seeded data (if applicable)

## Next Steps

1. **Immediate (Required):**
   - Complete Phases 1-7 above
   - Verify database connection with Prisma Studio

2. **Short Term (Recommended):**
   - Test all API endpoints (Phase 8)
   - Verify frontend displays data correctly (Phase 9)

3. **Medium Term (Optional):**
   - Add 42 more tours to reach 50 total (Phase 10)
   - Migrate controllers to use adapters (Phase 11)

4. **Long Term:**
   - Set up scheduled backups from Neon
   - Configure production environment
   - Set up CI/CD for migrations
   - Add monitoring and logging

## References

- 📖 **Setup Guide**: [PRISMA_NEON_SETUP.md](PRISMA_NEON_SETUP.md)
- 📚 **Migration Guide**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- 🔍 **Quick Reference**: [PRISMA_QUICK_REFERENCE.md](PRISMA_QUICK_REFERENCE.md)
- 🏗️ **Schema**: [prisma/schema.prisma](prisma/schema.prisma)
- 🔧 **Adapters**: [lib/prisma-adapter.js](lib/prisma-adapter.js)
- 💾 **Client**: [lib/prisma.js](lib/prisma.js)
- 🌱 **Seed Script**: [scripts/seed-tours.js](scripts/seed-tours.js)

## Questions?

Check the troubleshooting section above or review the detailed guide at [PRISMA_NEON_SETUP.md](PRISMA_NEON_SETUP.md).
