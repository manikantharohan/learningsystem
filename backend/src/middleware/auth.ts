import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends Request {
    user?: TokenPayload;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token);
        req.user = payload;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyAccessToken(token);
            req.user = payload;
        }
        
        next();
    } catch (error) {
        // Continue without user
        next();
    }
};
