import { Router } from 'express';
import { importHistoricalData, getHistory } from '../controllers/historicalData.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/import/:symbol', authMiddleware, importHistoricalData);
router.get('/:symbol', authMiddleware, getHistory);

export default router;