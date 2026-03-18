import { Router } from 'express';
import express from 'express';
import { 
  createPaymentIntent, 
  confirmPayment, 
  getPaymentMethods,
  addPaymentMethod, 
  removePaymentMethod, 
  setDefaultPaymentMethod,
  getPaymentHistory,
  getPayment,
  getPaymentsByBooking,
  refundPayment,
  getPaymentStats,
  retryPayment,
  handleWebhook
} from '../controllers/paymentController.js';
import { protect, restrictTo } from '../middleware/auth.js';

const router = Router();

// Webhook endpoint (public, but uses Stripe signature verification)
// Must be raw body for signature verification
router.post(
  '/webhook', 
  express.raw({ type: 'application/json' }), 
  handleWebhook
);

// Protected routes
router.use(protect);

// Payment methods
router.get('/methods', getPaymentMethods);
router.post('/methods', addPaymentMethod);
router.put('/methods/:methodId/default', setDefaultPaymentMethod);
router.delete('/methods/:methodId', removePaymentMethod);

// Payments
router.post('/create-intent', createPaymentIntent);
router.post('/confirm', confirmPayment);
router.get('/history', getPaymentHistory);
router.get('/stats', getPaymentStats);
router.get('/:id', getPayment);
router.post('/:paymentId/retry', retryPayment);

// Booking payments
router.get('/booking/:bookingId', getPaymentsByBooking);

// Admin only
router.post('/:paymentId/refund', restrictTo('admin'), refundPayment);

export default router;