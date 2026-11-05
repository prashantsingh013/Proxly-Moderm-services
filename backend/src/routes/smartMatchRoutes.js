import { Router } from 'express';
import { getSmartMatches } from '../controllers/smartMatchController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getSmartMatches);

export default router;
