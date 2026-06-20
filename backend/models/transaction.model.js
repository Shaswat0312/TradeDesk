import pool from '../config/db.js';

export const createTransaction = async (userId, symbol, type, quantity, price, total) => {
  const result = await pool.query(
    `INSERT INTO transactions (user_id, symbol, type, quantity, price, total)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, symbol, type, quantity, price, total]
  );
  return result.rows[0];
};

export const getUserTransactions = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};