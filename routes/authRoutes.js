import { Router } from 'express';
import { 
  register, login, logout, refreshToken,
  forgotPassword, resetPassword, verifyEmail,
  getMe, updateMe, updatePassword, deleteMe
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { body } from 'express-validator';

const router = Router();

// Public routes
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('first_name').notEmpty().trim(),
  body('last_name').notEmpty().trim(),
  body('phone').optional().isMobilePhone()
], validate, register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], validate, login);

router.post('/refresh-token', refreshToken);
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], validate, forgotPassword);

router.post('/reset-password/:token', [
  body('password').isLength({ min: 8 }),
  body('confirmPassword').notEmpty()
], validate, resetPassword);

router.get('/verify-email/:token', verifyEmail);

// Protected routes
router.use(protect); // All routes after this require authentication

router.post('/logout', logout);
router.get('/me', getMe);
router.patch('/update-me', updateMe);
router.patch('/update-password', [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
  body('confirmPassword').notEmpty()
], validate, updatePassword);

router.delete('/delete-me', deleteMe);

export default router;