import { buyStock, sellStock } from '../services/trade.service.js';

export const buy = async (req, res) => {
  const userId = req.user.id;
  const { symbol, quantity } = req.body;

  try {
    const transaction = await buyStock(userId, symbol, quantity);
    res.status(200).json({ message: 'Stock purchased', transaction });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const sell = async (req, res) => {
  const userId = req.user.id;
  const { symbol, quantity } = req.body;

  try {
    const transaction = await sellStock(userId, symbol, quantity);
    res.status(200).json({ message: 'Stock sold', transaction });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};