import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { restrictToAdmin, restrictToSuperAdmin } from '../middleware/admin.js';
import { upload, uploadVideo } from '../middleware/upload.js';
import * as adminController from '../controllers/adminController.js';
import * as settingsController from '../controllers/settingsController.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(restrictToAdmin);

router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/analytics', adminController.getAdvancedAnalytics);

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserDetails);
router.patch('/users/:userId/role', restrictToSuperAdmin, adminController.updateUserRole);
router.patch('/users/:userId/status', adminController.toggleUserStatus);

router.get('/bookings', adminController.getAllBookings);
router.patch('/bookings/:bookingId/status', adminController.updateBookingStatus);

router.post('/tours', 
  upload.fields([
    { name: 'featured_image', maxCount: 1 },
    { name: 'gallery_images', maxCount: 10 }
  ]),
  adminController.createTour
);
router.post('/tours/bulk-update', restrictToSuperAdmin, adminController.bulkUpdateTours);
router.post('/tours/:tourId/duplicate', adminController.duplicateTour);

router.get('/payments', adminController.getAllPayments);
router.post('/payments/:paymentId/refund', adminController.processRefund);

router.get('/reports/generate', adminController.generateReport);

router.patch('/settings', settingsController.updateSettings);
router.post('/settings/media', upload.single('media'), settingsController.uploadMedia);
router.post('/settings/video', uploadVideo.single('media'), settingsController.uploadMedia);

export default router;