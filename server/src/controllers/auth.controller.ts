// Auth Controller
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { ApiResponse } from '../utils/ApiResponse';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = 86400; // 1 day in seconds
const JWT_REFRESH_EXPIRES_IN = 604800; // 7 days in seconds

export const authController = {
    /**
     * Login with email and password
     */
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            // Find user with tenant
            const user = await prisma.user.findUnique({
                where: { email },
                include: { tenant: true },
            });

            if (!user) {
                return res.status(401).json(
                    ApiResponse.error('Invalid credentials', 'INVALID_CREDENTIALS')
                );
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, user.passwordHash);
            if (!isValidPassword) {
                return res.status(401).json(
                    ApiResponse.error('Invalid credentials', 'INVALID_CREDENTIALS')
                );
            }

            // Check if user is active
            if (user.status !== 'ACTIVE') {
                return res.status(403).json(
                    ApiResponse.error('Account is not active', 'ACCOUNT_INACTIVE')
                );
            }

            // Generate tokens
            const accessToken = jwt.sign(
                { userId: user.id, tenantId: user.tenantId, role: user.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            const refreshToken = jwt.sign(
                { userId: user.id, type: 'refresh' },
                JWT_SECRET,
                { expiresIn: JWT_REFRESH_EXPIRES_IN }
            );

            // Update last login
            await prisma.user.update({
                where: { id: user.id },
                data: { lastLoginAt: new Date() },
            });

            // Remove sensitive data
            const { passwordHash: _, ...safeUser } = user;

            res.json(ApiResponse.success({
                user: safeUser,
                tenant: user.tenant,
                accessToken,
                refreshToken,
                expiresIn: 86400, // 1 day in seconds
            }));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Register a new user and tenant
     */
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, name, companyName, domain } = req.body;

            // Check if user exists
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(400).json(
                    ApiResponse.error('Email already registered', 'EMAIL_EXISTS')
                );
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 12);

            // Create tenant and user in transaction
            const result = await prisma.$transaction(async (tx) => {
                const tenant = await tx.tenant.create({
                    data: {
                        name: companyName,
                        domain: domain || `${companyName.toLowerCase().replace(/\s+/g, '-')}.omniverse`,
                    },
                });

                const user = await tx.user.create({
                    data: {
                        email,
                        passwordHash,
                        name,
                        role: 'ADMIN',
                        tenantId: tenant.id,
                        permissions: ['*'], // Full permissions for admin
                    },
                    include: { tenant: true },
                });

                return { user, tenant };
            });

            // Generate tokens
            const accessToken = jwt.sign(
                { userId: result.user.id, tenantId: result.tenant.id, role: 'ADMIN' },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            const refreshToken = jwt.sign(
                { userId: result.user.id, type: 'refresh' },
                JWT_SECRET,
                { expiresIn: JWT_REFRESH_EXPIRES_IN }
            );

            const { passwordHash: _, ...safeUser } = result.user;

            res.status(201).json(ApiResponse.success({
                user: safeUser,
                tenant: result.tenant,
                accessToken,
                refreshToken,
                expiresIn: 86400,
            }, 'Registration successful'));
        } catch (error) {
            next(error);
        }
    },

    /**
     * Refresh access token
     */
    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json(
                    ApiResponse.error('Refresh token required', 'MISSING_TOKEN')
                );
            }

            // Verify refresh token
            const decoded = jwt.verify(refreshToken, JWT_SECRET) as { userId: string; type: string };

            if (decoded.type !== 'refresh') {
                return res.status(401).json(
                    ApiResponse.error('Invalid token type', 'INVALID_TOKEN')
                );
            }

            // Get user
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user || user.status !== 'ACTIVE') {
                return res.status(401).json(
                    ApiResponse.error('User not found or inactive', 'USER_INACTIVE')
                );
            }

            // Generate new access token
            const accessToken = jwt.sign(
                { userId: user.id, tenantId: user.tenantId, role: user.role },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            res.json(ApiResponse.success({
                accessToken,
                expiresIn: 86400,
            }));
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).json(
                    ApiResponse.error('Refresh token expired', 'TOKEN_EXPIRED')
                );
            }
            next(error);
        }
    },

    /**
     * Logout (client-side token invalidation)
     */
    async logout(req: Request, res: Response) {
        // In a production app, you'd add the token to a blacklist
        res.json(ApiResponse.success(null, 'Logged out successfully'));
    },
};
