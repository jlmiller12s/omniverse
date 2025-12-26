// User Routes
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware, requireRole } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/users/me - Get current user
router.get('/me', userController.getCurrentUser);

// PATCH /api/users/me - Update current user profile
router.patch('/me', userController.updateProfile);

// GET /api/users - List all users (admin only)
router.get('/', requireRole('ADMIN', 'MANAGER'), userController.getAll);

// GET /api/users/:id - Get user by ID
router.get('/:id', userController.getById);

// PATCH /api/users/:id/role - Update user role (admin only)
router.patch('/:id/role', requireRole('ADMIN'), userController.updateRole);

// POST /api/users/invite - Invite new user
router.post('/invite', requireRole('ADMIN', 'MANAGER'), userController.invite);

export default router;
