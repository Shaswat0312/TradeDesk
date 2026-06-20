import { getAllHoldings } from '../models/portfolio.model.js';
import { getUserTransactions } from '../models/transaction.model.js';

export const getPortfolio = async (req, res) => {
  try {
    const holdings = await getAllHoldings(req.user.id);
    res.status(200).json(holdings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await getUserTransactions(req.user.id);
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};