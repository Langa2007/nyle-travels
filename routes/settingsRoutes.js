import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';

const router = Router();

// Public endpoints to fetch site content config (like hero images, video)
router.get('/:key?', settingsController.getSettings);

export default router;
