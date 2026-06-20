import pool from '../config/db.js';

export const getHolding = async (userId, symbol) => {
  const result = await pool.query(
    'SELECT * FROM portfolio WHERE user_id = $1 AND symbol = $2',
    [userId, symbol]
  );
  return result.rows[0];
};

export const getAllHoldings = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM portfolio WHERE user_id = $1',
    [userId]
  );
  return result.rows;
};

export const upsertHolding = async (userId, symbol, quantity, avgBuyPrice) => {
  const query = `
    INSERT INTO portfolio (user_id, symbol, quantity, avg_buy_price)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, symbol)
    DO UPDATE SET quantity = $3, avg_buy_price = $4
  `;
  await pool.query(query, [userId, symbol, quantity, avgBuyPrice]);
};

export const deleteHolding = async (userId, symbol) => {
  await pool.query(
    'DELETE FROM portfolio WHERE user_id = $1 AND symbol = $2',
    [userId, symbol]
  );
};