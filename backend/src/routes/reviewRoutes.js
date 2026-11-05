import { Router } from 'express';
import { createReview, getProviderReviews, replyToReview } from '../controllers/reviewController.js';
import { authenticateUser, requireRole } from '../middleware/auth.js';

const router = Router();

router.get('/provider/:providerId', getProviderReviews);
router.post('/', authenticateUser, requireRole('customer'), createReview);
router.post('/:reviewId/reply', authenticateUser, requireRole('provider'), replyToReview);

export default router;
