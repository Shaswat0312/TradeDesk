import { Router } from 'express';
import { buy, sell } from '../controllers/trade.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/buy', authMiddleware, buy);
router.post('/sell', authMiddleware, sell);

export default router;