// Authentication Middleware
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse';

// Extend Express Request type
declare global {
    namespace Express {
        interface Request {
            userId?: string;
            tenantId?: string;
            userRole?: string;
        }
    }
}

interface JwtPayload {
    userId: string;
    tenantId: string;
    role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json(
                ApiResponse.error('Authentication required', 'UNAUTHORIZED')
            );
        }

        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'your-secret-key';

        const decoded = jwt.verify(token, secret) as JwtPayload;

        req.userId = decoded.userId;
        req.tenantId = decoded.tenantId;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json(
                ApiResponse.error('Token expired', 'TOKEN_EXPIRED')
            );
        }
        return res.status(401).json(
            ApiResponse.error('Invalid token', 'INVALID_TOKEN')
        );
    }
};

/**
 * Role-based access control middleware
 */
export const requireRole = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.userRole || !roles.includes(req.userRole)) {
            return res.status(403).json(
                ApiResponse.error('Insufficient permissions', 'FORBIDDEN')
            );
        }
        next();
    };
};
