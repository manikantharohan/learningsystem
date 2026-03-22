import { Request, Response } from 'express';
import { 
    getVideoProgress, 
    updateVideoProgress, 
    getSubjectProgress,
    getLastWatchedVideo,
    getAllSubjectProgress
} from './service';
import { progressUpdateSchema } from '../../utils/validation';
import { asyncHandler } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getVideoProgressData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    const progress = await getVideoProgress(req.user.userId, id as string);
    
    res.json({ progress });
});

export const updateVideoProgressData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    const validatedData = progressUpdateSchema.parse(req.body);
    
    const progress = await updateVideoProgress(req.user.userId, id as string, {
        lastPositionSeconds: validatedData.lastPositionSeconds,
        isCompleted: validatedData.isCompleted,
    });

    res.json({ progress });
});

export const getSubjectProgressData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const { id } = req.params;
    const progress = await getSubjectProgress(req.user.userId, id as string);
    const lastWatched = await getLastWatchedVideo(req.user.userId, id as string);
    
    res.json({ 
        progress,
        lastWatched
    });
});

export const getAllProgress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const allProgress = await getAllSubjectProgress(req.user.userId);
    res.json({ progress: allProgress });
});
