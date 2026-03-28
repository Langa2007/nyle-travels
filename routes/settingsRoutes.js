import { Router } from 'express';
import * as settingsController from '../controllers/settingsController.js';

const router = Router();

// Public endpoints to fetch site content config (like hero images, video)
router.get('/', settingsController.getSettings);
router.get('/:section', settingsController.getSectionSettings);

export default router;
