// Auth Routes
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), authController.login);

// POST /api/auth/register
router.post('/register', validateRequest(registerSchema), authController.register);

// POST /api/auth/refresh
router.post('/refresh', authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authController.logout);

export default router;
