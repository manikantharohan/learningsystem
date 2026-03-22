import { Router } from 'express';
import { getVideo, checkLock } from './controller';
import { authenticate, optionalAuth } from '../../middleware/auth';

const router = Router();

router.get('/:id', optionalAuth, getVideo);
router.get('/:id/lock-status', authenticate, checkLock);

export default router;
