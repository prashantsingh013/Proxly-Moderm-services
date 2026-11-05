import { Router } from 'express';
import {
  getProviderTrustScore,
  getProviderTrustHistory,
  recalculateTrustScore
} from '../controllers/trustScoreController.js';
import { authenticateUser, requireRole, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:providerId', optionalAuth, getProviderTrustScore);
router.get('/:providerId/history', optionalAuth, getProviderTrustHistory);
router.post('/:providerId/recalculate', authenticateUser, requireRole('admin', 'provider'), recalculateTrustScore);

export default router;
