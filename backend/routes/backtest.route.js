import { Router } from 'express';
import { backtestMA, backtestRSI, getHistory, compare } from '../controllers/backtest.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/ma-crossover/:symbol', authMiddleware, backtestMA);
router.post('/rsi/:symbol', authMiddleware, backtestRSI);
router.get('/history', authMiddleware, getHistory);
router.post('/compare', authMiddleware, compare);

export default router;