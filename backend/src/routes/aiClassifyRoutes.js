import { Router } from 'express';
import { classifyProblemDescription } from '../controllers/aiClassifyController.js';

const router = Router();

router.post('/', classifyProblemDescription);

export default router;
