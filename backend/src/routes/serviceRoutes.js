import { Router } from 'express';
import { getServices, getCategories, getServiceById } from '../controllers/serviceController.js';

const router = Router();

router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/:id', getServiceById);

export default router;
