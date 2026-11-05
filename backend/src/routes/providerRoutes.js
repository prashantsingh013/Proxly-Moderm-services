import { Router } from 'express';
import {
  getAllProviders,
  getNearbyProviders,
  getProviderById,
  updateProviderProfile,
  verifyProviderDocs
} from '../controllers/providerController.js';
import { getProviderEndorsements } from '../controllers/endorsementController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllProviders);
router.get('/nearby', getNearbyProviders);
router.get('/:id', getProviderById);
router.get('/:id/endorsements', getProviderEndorsements);
router.put('/profile', authenticateUser, requireRole('provider'), updateProviderProfile);
router.post('/verify-docs', authenticateUser, requireRole('admin'), verifyProviderDocs);

export default router;
