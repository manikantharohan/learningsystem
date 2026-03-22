import { Router } from 'express';
import { 
    getVideoProgressData, 
    updateVideoProgressData, 
    getSubjectProgressData,
    getAllProgress 
} from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/videos/:id', authenticate, getVideoProgressData);
router.post('/videos/:id', authenticate, updateVideoProgressData);
router.get('/subjects/:id', authenticate, getSubjectProgressData);
router.get('/all', authenticate, getAllProgress);

export default router;
