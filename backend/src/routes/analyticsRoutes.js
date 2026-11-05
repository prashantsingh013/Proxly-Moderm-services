import { Router } from 'express';
import { getAdminAnalytics } from '../controllers/analyticsController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/admin', authenticateUser, requireRole('admin'), getAdminAnalytics);

export default router;
