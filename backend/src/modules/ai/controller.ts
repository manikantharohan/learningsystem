import { Request, Response } from 'express';
import { chatWithAI, generateSummary, generateQuiz, explainConcept } from './service';
import { aiChatSchema } from '../../utils/validation';
import { asyncHandler } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const chat = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const validatedData = aiChatSchema.parse(req.body);
    const response = await chatWithAI(
        validatedData.message,
        req.user.userId,
        validatedData.context
    );

    res.json(response);
});

export const summarize = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const { videoId } = req.body;
    
    if (!videoId) {
        res.status(400).json({ error: 'Video ID is required' });
        return;
    }

    const summary = await generateSummary(videoId);
    res.json({ summary });
});

export const quiz = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const { videoId } = req.body;
    
    if (!videoId) {
        res.status(400).json({ error: 'Video ID is required' });
        return;
    }

    const questions = await generateQuiz(videoId);
    res.json({ questions });
});

export const explain = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const { concept, videoId } = req.body;
    
    if (!concept) {
        res.status(400).json({ error: 'Concept is required' });
        return;
    }

    const explanation = await explainConcept(concept, videoId);
    res.json({ explanation });
});
