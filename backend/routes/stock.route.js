import { Router } from 'express';
import { getQuote } from '../controllers/stock.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/quote/:symbol', authMiddleware, getQuote);

export default router;