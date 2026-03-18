import { Router } from 'express';
import { 
  createBooking, getMyBookings, getBooking, getBookingByNumber,
  cancelBooking, getUpcomingBookings, getBookingStats, addPayment
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { body } from 'express-validator';

const router = Router();

// All booking routes require authentication
router.use(protect);

router.post('/', [
  body('tour_package_id').isUUID(),
  body('start_date').isISO8601().toDate(),
  body('guests').isInt({ min: 1 }),
  body('emergency_contact_name').notEmpty(),
  body('emergency_contact_phone').notEmpty()
], validate, createBooking);

router.get('/', getMyBookings);
router.get('/upcoming', getUpcomingBookings);
router.get('/stats', getBookingStats);
router.get('/number/:number', getBookingByNumber);
router.get('/:id', getBooking);

router.patch('/:id/cancel', cancelBooking);
router.post('/:id/payments', addPayment);

export default router;