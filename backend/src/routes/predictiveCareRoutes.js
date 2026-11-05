import { Router } from 'express';
import {
  getPredictions,
  getCustomerServiceTimeline,
  addServiceHistoryEntry
} from '../controllers/predictiveCareController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.get('/:customerId/predictions', getPredictions);
router.get('/:customerId/timeline', getCustomerServiceTimeline);
router.post('/history', addServiceHistoryEntry);

export default router;
