import { Router } from 'express';
import {
  createEndorsement,
  getProviderEndorsements,
  toggleNeighborhoodFavorite,
  getCommunityFeed
} from '../controllers/endorsementController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/community-feed', getCommunityFeed);
router.get('/provider/:providerId', getProviderEndorsements);

router.post('/', authenticateUser, requireRole('provider'), createEndorsement);
router.post('/favorite', authenticateUser, requireRole('customer'), toggleNeighborhoodFavorite);

export default router;
