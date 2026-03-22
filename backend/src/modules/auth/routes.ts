import { Router } from 'express';
import { register, login, logout, refresh, me, logoutAll } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, me);
router.post('/logout-all', authenticate, logoutAll);

export default router;
