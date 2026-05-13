import express from 'express';
import * as contactController from '../controllers/contactController.js';

const router = express.Router();

// Public route for submitting inquiries
router.post('/', contactController.submitContact);

export default router;
