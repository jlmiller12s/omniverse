// Tenant Middleware - Extract tenant context from JWT
import { Request, Response, NextFunction } from 'express';

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Tenant ID is already set by auth middleware from JWT
    // This middleware can be extended for additional tenant validation
    if (!req.tenantId) {
        // Allow unauthenticated requests to pass through
        // Auth middleware will handle authentication separately
    }
    next();
};
