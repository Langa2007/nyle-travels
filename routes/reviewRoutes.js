import { Router } from 'express';
import { 
  createReview, getTourReviews, getReview, updateReview,
  deleteReview, markHelpful, reportReview, getMyReviews,
  getRecentReviews, updateReviewStatus
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Public routes
router.get('/recent', getRecentReviews);
router.get('/tour/:tourId', getTourReviews);
router.get('/:id', getReview);

// Protected routes (users)
router.use(protect);

router.post('/', 
  upload.array('images', 5),
  createReview
);

router.get('/user/me', getMyReviews);

router.patch('/:id',
  upload.array('images', 5),
  updateReview
);

router.delete('/:id', deleteReview);
router.post('/:id/helpful', markHelpful);
router.post('/:id/report', reportReview);

// Admin only
router.patch('/:id/status', restrictTo('admin'), updateReviewStatus);

export default router;