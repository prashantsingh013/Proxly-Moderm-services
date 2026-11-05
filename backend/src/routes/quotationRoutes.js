import { Router } from 'express';
import { createQuotation, getQuotationsForBooking, acceptQuotation } from '../controllers/quotationController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateUser);

router.post('/', requireRole('provider'), createQuotation);
router.get('/:bookingId', getQuotationsForBooking);
router.post('/:bookingId/accept', requireRole('customer'), acceptQuotation);

export default router;
