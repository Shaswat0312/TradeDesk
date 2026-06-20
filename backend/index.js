import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger.js';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv'
import './config/db.js';
import './config/redis.js';
import stockRoutes from './routes/stock.route.js';
import historicalDataRoutes from './routes/historicalData.route.js';


dotenv.config({});
const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/auth', authRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/historical', historicalDataRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'TradeDesk API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));