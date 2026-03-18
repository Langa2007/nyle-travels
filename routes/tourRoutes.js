import { Router } from 'express';
import { 
  getAllTours, getTour, createTour, updateTour, deleteTour,
  addItinerary, checkAvailability, getFeaturedTours, searchTours
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/', getAllTours);
router.get('/featured', getFeaturedTours);
router.get('/search', searchTours);
router.get('/:slug', getTour);
router.get('/:tourId/availability', checkAvailability);

// Protected routes (admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', 
  upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
  ]),
  createTour
);

router.patch('/:id',
  upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
  ]),
  updateTour
);

router.delete('/:id', deleteTour);

// Itinerary routes
router.post('/:tourId/itineraries', addItinerary);

export default router;