import { Router } from 'express';
import { 
    listSubjects, 
    getSubject, 
    getSubjectTreeData, 
    enroll,
    getMyEnrollments,
    getMyEnrollmentsWithProgress,
    getContinueLearningData,
    getCategoriesList,
    getFeatured,
    getSubjectStatsData
} from './controller';
import { authenticate, optionalAuth } from '../../middleware/auth';

const router = Router();

// Public routes
router.get('/categories', getCategoriesList);
router.get('/featured', getFeatured);
router.get('/', listSubjects);
router.get('/:slug', getSubject);
router.get('/:id/tree', optionalAuth, getSubjectTreeData);
router.get('/:id/stats', optionalAuth, getSubjectStatsData);

// Protected routes
router.get('/enrolled/progress', authenticate, getMyEnrollmentsWithProgress);
router.get('/enrolled', authenticate, getMyEnrollments);
router.get('/continue-learning', authenticate, getContinueLearningData);
router.post('/:id/enroll', authenticate, enroll);

export default router;
