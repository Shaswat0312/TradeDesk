import { Router } from 'express';
import { getPortfolio, getTransactions } from '../controllers/portfolio.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, getPortfolio);
router.get('/transactions', authMiddleware, getTransactions);

export default router;