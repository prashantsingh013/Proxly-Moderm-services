import { Router } from 'express';
import { createReport, getAllReports, resolveReport } from '../controllers/reportController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.post('/', createReport);
router.get('/', requireRole('admin'), getAllReports);
router.patch('/:reportId/resolve', requireRole('admin'), resolveReport);

export default router;
