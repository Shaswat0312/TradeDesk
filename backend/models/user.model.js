import pool from '../config/db.js';

export const createUser = async (name, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, balance',
    [name, email, hashedPassword]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const findUserById = async (id) => {
  const result = await pool.query(
    'SELECT id, name, email, balance FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

export const updateBalance = async (userId, newBalance) => {
  const result = await pool.query(
    'UPDATE users SET balance = $1 WHERE id = $2 RETURNING id, name, email, balance',
    [newBalance, userId]
  );
  return result.rows[0];
};