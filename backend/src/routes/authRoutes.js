import { Router } from 'express';
import { register, login, getMe, updateProfile, registerSchema, loginSchema } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.get('/me', authenticateUser, getMe);
router.put('/profile', authenticateUser, updateProfile);

export default router;
