import { Router } from 'express';
import { 
    getProfile, 
    getUserAchievements, 
    earnXP,
    completeVideo 
} from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/profile', authenticate, getProfile);
router.get('/achievements', authenticate, getUserAchievements);
router.post('/xp/earn', authenticate, earnXP);
router.post('/complete-video', authenticate, completeVideo);

export default router;
