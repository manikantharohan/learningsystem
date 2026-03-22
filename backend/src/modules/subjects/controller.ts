import { Request, Response } from 'express';
import { 
    getAllSubjects, 
    getSubjectBySlug, 
    getSubjectTreeBySlug,
    getSubjectTree,
    enrollUser,
    getUserEnrollments,
    getUserEnrollmentsWithProgress,
    getContinueLearning,
    isUserEnrolled,
    getCategories,
    getFeaturedSubjects,
    getSubjectStats,
    SubjectFilters
} from './service';
import { asyncHandler } from '../../middleware/errorHandler';
import { AuthenticatedRequest } from '../../middleware/auth';

export const listSubjects = asyncHandler(async (req: Request, res: Response) => {
    const { category, difficulty, search, featured } = req.query;
    
    const filters: SubjectFilters = {};
    if (category && typeof category === 'string') filters.category = category;
    if (difficulty && typeof difficulty === 'string') filters.difficulty = difficulty;
    if (search && typeof search === 'string') filters.search = search;
    if (featured === 'true') filters.featured = true;
    
    const subjects = await getAllSubjects(filters, true);
    res.json({ subjects, count: subjects.length });
});

export const getCategoriesList = asyncHandler(async (req: Request, res: Response) => {
    const categories = await getCategories();
    res.json({ categories });
});

export const getFeatured = asyncHandler(async (req: Request, res: Response) => {
    const subjects = await getFeaturedSubjects();
    res.json({ subjects });
});

export const getSubject = asyncHandler(async (req: Request, res: Response) => {
    const slug = req.params.slug as string;
    const subject = await getSubjectBySlug(slug);
    
    if (!subject) {
        res.status(404).json({ error: 'Subject not found' });
        return;
    }
    
    res.json({ subject });
});

export const getSubjectTreeData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const subject = await getSubjectTreeBySlug(id);
    
    if (!subject) {
        res.status(404).json({ error: 'Subject not found' });
        return;
    }

    // Check enrollment if user is authenticated
    let isEnrolled = false;
    if (req.user) {
        isEnrolled = await isUserEnrolled(req.user.userId, subject.id);
    }
    
    res.json({ subject, isEnrolled });
});

export const getSubjectStatsData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const stats = await getSubjectStats(id, req.user?.userId);
    
    if (!stats) {
        res.status(404).json({ error: 'Subject not found' });
        return;
    }
    
    res.json({ stats });
});

export const enroll = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const id = req.params.id as string;
    await enrollUser(req.user.userId, id);
    
    res.status(201).json({ message: 'Enrolled successfully' });
});

export const getMyEnrollments = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const subjects = await getUserEnrollments(req.user.userId);
    res.json({ subjects });
});

export const getMyEnrollmentsWithProgress = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const subjects = await getUserEnrollmentsWithProgress(req.user.userId);
    res.json({ subjects });
});

export const getContinueLearningData = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    const limit = parseInt(req.query.limit as string) || 5;
    const subjects = await getContinueLearning(req.user.userId, limit);
    res.json({ subjects });
});
