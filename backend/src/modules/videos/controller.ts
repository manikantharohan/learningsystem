import { Request, Response } from 'express';
import { getVideoWithContext, checkVideoLockStatus } from './service';
import { asyncHandler } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const getVideo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const context = await getVideoWithContext(id);
    
    if (!context) {
        res.status(404).json({ error: 'Video not found' });
        return;
    }

    // Check lock status if user is authenticated
    let lockStatus: { isLocked: boolean; reason?: string } = { isLocked: false };
    if (req.user) {
        lockStatus = await checkVideoLockStatus(id as string, req.user.userId);
    } else {
        lockStatus = { isLocked: true, reason: 'Authentication required' };
    }

    res.json({
        video: context.video,
        nextVideo: context.nextVideo,
        prevVideo: context.prevVideo,
        lockStatus
    });
});

export const checkLock = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const id = req.params.id as string;
    const lockStatus = await checkVideoLockStatus(id, req.user.userId);
    
    res.json(lockStatus);
});
