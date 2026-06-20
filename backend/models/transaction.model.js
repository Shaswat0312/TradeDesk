import pool from '../config/db.js';

export const createTransaction = async (userId, symbol, type, quantity, price, total) => {
  const result = await pool.query(
    `INSERT INTO transactions (user_id, symbol, type, quantity, price, total)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [userId, symbol, type, quantity, price, total]
  );
  const tx = result.rows[0];
  tx.quantity = parseFloat(tx.quantity);
  tx.price = parseFloat(tx.price);
  tx.total = parseFloat(tx.total);
  return tx;
};

export const getUserTransactions = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(row => ({
    ...row,
    quantity: parseFloat(row.quantity),
    price: parseFloat(row.price),
    total: parseFloat(row.total),
  }));
};