import express from 'express';
import * as reportController from '../controllers/reportController.js';

const router = express.Router();

// Public route for submitting reports
router.post('/', reportController.submitReport);

export default router;
