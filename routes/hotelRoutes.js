import { Router } from 'express';
import { 
  getAllHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
  getHotelsByDestination,
  checkAvailability,
  getFeaturedHotels,
  getLuxuryHotels,
  searchHotels,
  getNearbyHotels,
  getHotelsByPriceRange,
  getHotelStats,
  addRoomType,
  updateRoomType,
  removeRoomType
} from '../controllers/hotelController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/', getAllHotels);
router.get('/featured', getFeaturedHotels);
router.get('/luxury', getLuxuryHotels);
router.get('/search', searchHotels);
router.get('/nearby', getNearbyHotels);
router.get('/price-range', getHotelsByPriceRange);
router.get('/destination/:destinationId', getHotelsByDestination);
router.get('/:slug', getHotel);
router.get('/:hotelId/availability', checkAvailability);
router.get('/:hotelId/stats', getHotelStats);

// Protected routes (admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', 
  upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 20 }
  ]),
  createHotel
);

router.patch('/:id',
  upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 20 }
  ]),
  updateHotel
);

router.delete('/:id', deleteHotel);

// Room type management
router.post('/:hotelId/room-types', addRoomType);
router.patch('/:hotelId/room-types/:roomTypeIndex', updateRoomType);
router.delete('/:hotelId/room-types/:roomTypeIndex', removeRoomType);

export default router;