import { Router } from 'express';
import { 
  getAllDestinations, getDestination, createDestination,
  updateDestination, deleteDestination, getPopularDestinations,
  getFeaturedDestinations, searchDestinations
} from '../controllers/destinationController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/', getAllDestinations);
router.get('/popular', getPopularDestinations);
router.get('/featured', getFeaturedDestinations);
router.get('/search', searchDestinations);
router.get('/:slug', getDestination);

// Protected routes (admin only)
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', 
  upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
  ]),
  createDestination
);

router.patch('/:id',
  upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
  ]),
  updateDestination
);

router.delete('/:id', deleteDestination);

export default router;