// Error Handler Middleware
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('Error:', error);

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json(
                    ApiResponse.error('A record with this value already exists', 'DUPLICATE_ENTRY')
                );
            case 'P2025':
                return res.status(404).json(
                    ApiResponse.error('Record not found', 'NOT_FOUND')
                );
            default:
                return res.status(500).json(
                    ApiResponse.error('Database error', 'DATABASE_ERROR')
                );
        }
    }

    // Zod validation errors
    if (error instanceof ZodError) {
        const details: Record<string, string[]> = {};
        error.errors.forEach((err) => {
            const path = err.path.join('.');
            if (!details[path]) details[path] = [];
            details[path].push(err.message);
        });
        return res.status(400).json(
            ApiResponse.error('Validation failed', 'VALIDATION_ERROR', details)
        );
    }

    // Default error
    res.status(500).json(
        ApiResponse.error(
            process.env.NODE_ENV === 'production'
                ? 'Internal server error'
                : error.message,
            'INTERNAL_ERROR'
        )
    );
};
