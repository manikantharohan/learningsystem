import { Router } from 'express';
import { chat, summarize, quiz, explain } from './controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.post('/chat', authenticate, chat);
router.post('/summarize', authenticate, summarize);
router.post('/quiz', authenticate, quiz);
router.post('/explain', authenticate, explain);

export default router;
