import { Request, Response } from 'express';
import { createUser, authenticateUser, logoutUser, logoutAllDevices, getUserById } from './service';
import { registerSchema, loginSchema } from '../../utils/validation';
import { verifyRefreshToken, generateTokens } from '../../utils/jwt';
import { asyncHandler } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const register = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = registerSchema.parse(req.body);
    const user = await createUser(validatedData);
    
    res.status(201).json({
        message: 'User registered successfully',
        user,
    });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = loginSchema.parse(req.body);
    const { user, tokens } = await authenticateUser(validatedData);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
        message: 'Login successful',
        user,
        accessToken: tokens.accessToken,
    });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    
    if (refreshToken) {
        await logoutUser(refreshToken);
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logout successful' });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
        res.status(401).json({ error: 'Refresh token required' });
        return;
    }

    const payload = await verifyRefreshToken(refreshToken);
    const tokens = await generateTokens({ userId: payload.userId, email: payload.email });

    // Set new refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
        accessToken: tokens.accessToken,
    });
});

export const me = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    const user = await getUserById(req.user.userId);
    
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.json({ user });
});

export const logoutAll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
    }

    await logoutAllDevices(req.user.userId);
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logged out from all devices' });
});
