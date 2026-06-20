import pool from '../config/db.js';

export const insertHistoricalPrices = async (symbol, priceData) => {
  const query = `
    INSERT INTO historical_prices (symbol, date, open, high, low, close, volume)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (symbol, date) DO NOTHING
  `;

  for (const day of priceData) {
    await pool.query(query, [
      symbol,
      day.date,
      day.open,
      day.high,
      day.low,
      day.close,
      day.volume,
    ]);
  }
};

export const getHistoricalPrices = async (symbol) => {
  const result = await pool.query(
    'SELECT * FROM historical_prices WHERE symbol = $1 ORDER BY date ASC',
    [symbol]
  );
  return result.rows;
};