import { fetchHistoricalData } from '../services/historicalData.service.js';
import { insertHistoricalPrices, getHistoricalPrices } from '../models/historicalPrice.model.js';

export const importHistoricalData = async (req, res) => {
  const { symbol } = req.params;

  try {
    const data = await fetchHistoricalData(symbol);
    await insertHistoricalPrices(symbol, data);
    res.status(200).json({ message: `Imported ${data.length} records for ${symbol}` });
  } catch (err) {
    res.status(500).json({ message: 'Failed to import historical data', error: err.message });
  }
};

export const getHistory = async (req, res) => {
  const { symbol } = req.params;

  try {
    const data = await getHistoricalPrices(symbol);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch historical data', error: err.message });
  }
};