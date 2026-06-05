import express from 'express';
import { body } from 'express-validator';
import * as contactController from '../controllers/contactController.js';
import { contactSubmitLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

const contactValidation = [
  body('website')
    .optional({ values: 'falsy' })
    .isEmpty()
    .withMessage('Invalid submission'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage('Name must be between 2 and 120 characters'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email address is too long'),
  body('phone')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 50 })
    .withMessage('Phone number is too long')
    .matches(/^[+()\-\s0-9.]*$/)
    .withMessage('Phone number contains invalid characters'),
  body('interest')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Interest must be between 2 and 255 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Message must be between 10 and 5000 characters'),
];

// Public route for submitting inquiries
router.post('/', contactSubmitLimiter, contactValidation, validate, contactController.submitContact);

export default router;
