import { Router } from 'express';
import authRoutes from '../modules/auth/routes';
import subjectRoutes from '../modules/subjects/routes';
import videoRoutes from '../modules/videos/routes';
import progressRoutes from '../modules/progress/routes';
import gamificationRoutes from '../modules/gamification/routes';
import aiRoutes from '../modules/ai/routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/videos', videoRoutes);
router.use('/progress', progressRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/ai', aiRoutes);

export default router;
