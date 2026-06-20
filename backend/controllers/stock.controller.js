import { getLiveQuote } from '../services/stock.service.js';

export const getQuote = async (req, res) => {
  const { symbol } = req.params;

  try {
    const data = await getLiveQuote(symbol);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch quote', error: err.message });
  }
};