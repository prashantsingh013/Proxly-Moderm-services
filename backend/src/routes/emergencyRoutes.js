import { Router } from 'express';
import {
  getEmergencyEstimate,
  searchEmergencyNearby,
  requestEmergencyDispatch
} from '../controllers/emergencyController.js';
import { authenticateUser, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/estimate', optionalAuth, getEmergencyEstimate);
router.get('/nearby', optionalAuth, searchEmergencyNearby);
router.post('/request', authenticateUser, requestEmergencyDispatch);

export default router;
