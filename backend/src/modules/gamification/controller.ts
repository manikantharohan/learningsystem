import { Request, Response } from 'express';
import { 
    getGamificationProfile, 
    getAchievements,
    addXP,
    awardVideoCompletionXP 
} from './service';
import { asyncHandler } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const profile = await getGamificationProfile(req.user.userId);
    res.json(profile);
});

export const getUserAchievements = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const achievements = await getAchievements(req.user.userId);
    res.json({ achievements });
});

export const earnXP = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const { amount, reason } = req.body;
    
    if (!amount || amount <= 0) {
        res.status(400).json({ error: 'Invalid XP amount' });
        return;
    }

    const xp = await addXP(req.user.userId, amount, reason || 'Manual XP award');
    res.json({ xp });
});

export const completeVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    await awardVideoCompletionXP(req.user.userId);
    const profile = await getGamificationProfile(req.user.userId);
    
    res.json({ 
        message: 'Video completion recorded',
        profile 
    });
});
