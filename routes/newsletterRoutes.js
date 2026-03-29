import express from 'express';
import { 
  subscribe, 
  getSubscribers, 
  unsubscribe, 
  deleteSubscriber 
} from '../controllers/newsletterController.js';
import { protect } from '../middleware/auth.js';
import { restrictToAdmin } from '../middleware/admin.js';

const router = express.Router();

// Public routes
router.post('/subscribe', subscribe);
router.get('/unsubscribe', unsubscribe);

// Admin routes (Protected)
router.get('/admin/subscribers', protect, restrictToAdmin, getSubscribers);
router.delete('/admin/subscribers/:id', protect, restrictToAdmin, deleteSubscriber);

export default router;
