import { Router } from 'express';
import {
  createTravelFund,
  getCustodyConfig,
  getMyTravelFunds,
  initiateContribution,
} from '../controllers/travelFundController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/custody-config', getCustodyConfig);
router.post('/:fundId/contributions', initiateContribution);

router.use(protect);

router.get('/', getMyTravelFunds);
router.post('/', createTravelFund);

export default router;
