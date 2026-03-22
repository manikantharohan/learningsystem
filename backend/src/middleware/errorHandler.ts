import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    res.status(statusCode).json({
        error: message,
        code: err.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const notFoundHandler = (req: Request, res: Response): void => {
    res.status(404).json({
        error: 'Resource not found',
        code: 'NOT_FOUND',
    });
};

export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
