// User Controller
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const userController = {
    /**
     * Get current user profile
     */
    async getCurrentUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatar: true,
                    role: true,
                    status: true,
                    department: true,
                    title: true,
                    permissions: true,
                    lastLoginAt: true,
                    createdAt: true,
                    tenant: true,
                },
            });

            if (!user) {
                return res.status(404).json(ApiResponse.error('User not found', 'NOT_FOUND'));
            }

            res.json(ApiResponse.success(user));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update current user profile
     */
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, avatar, department, title } = req.body;

            const user = await prisma.user.update({
                where: { id: req.userId },
                data: { name, avatar, department, title },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatar: true,
                    role: true,
                    department: true,
                    title: true,
                },
            });

            res.json(ApiResponse.success(user, 'Profile updated'));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get all users in tenant
     */
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { page = 1, limit = 20 } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where: { tenantId: req.tenantId },
                    skip,
                    take: Number(limit),
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        avatar: true,
                        role: true,
                        status: true,
                        department: true,
                        lastLoginAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                }),
                prisma.user.count({ where: { tenantId: req.tenantId } }),
            ]);

            res.json(ApiResponse.paginated(users, Number(page), Number(limit), total));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Get user by ID
     */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await prisma.user.findFirst({
                where: { id: req.params.id, tenantId: req.tenantId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    avatar: true,
                    role: true,
                    status: true,
                    department: true,
                    title: true,
                    lastLoginAt: true,
                    createdAt: true,
                },
            });

            if (!user) {
                return res.status(404).json(ApiResponse.error('User not found', 'NOT_FOUND'));
            }

            res.json(ApiResponse.success(user));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Update user role (admin only)
     */
    async updateRole(req: Request, res: Response, next: NextFunction) {
        try {
            const { role } = req.body;

            const user = await prisma.user.updateMany({
                where: { id: req.params.id, tenantId: req.tenantId },
                data: { role },
            });

            if (user.count === 0) {
                return res.status(404).json(ApiResponse.error('User not found', 'NOT_FOUND'));
            }

            res.json(ApiResponse.success(null, 'Role updated'));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Invite new user
     */
    async invite(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, role } = req.body;

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json(
                    ApiResponse.error('User already exists', 'USER_EXISTS')
                );
            }

            // Create invitation
            const invitation = await prisma.invitation.create({
                data: {
                    email,
                    role: role || 'MEMBER',
                    token: crypto.randomBytes(32).toString('hex'),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    tenantId: req.tenantId!,
                    invitedById: req.userId!,
                },
            });

            // TODO: Send invitation email

            res.status(201).json(ApiResponse.success(invitation, 'Invitation sent'));
        } catch (error) {
            next(error);
        }
    },
};
