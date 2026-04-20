import express from 'express';
import { 
  getAllTours, 
  getTourBySlug, 
  getFeaturedTours 
} from '../controllers/tourController.js';
import { 
  createTour, 
  updateTour, 
  deleteTour, 
  addItinerary, 
  bulkUpdateItinerary, 
  updateAvailability,  
  getTourStats,
  getTourByIdAdmin
} from '../controllers/admin/tourAdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', getAllTours);
router.get('/featured', getFeaturedTours);
router.get('/:slug', getTourBySlug);

router.use(protect);
router.use(restrictTo('admin'));

router.get('/admin/stats', getTourStats);
router.get('/admin/:id', getTourByIdAdmin);
router.post('/', createTour);
router.put('/:id', updateTour);
router.delete('/:id', deleteTour);
router.post('/:id/itinerary', addItinerary);
router.put('/:id/itinerary/bulk', bulkUpdateItinerary);
router.put('/:id/availability', updateAvailability);

export default router;
