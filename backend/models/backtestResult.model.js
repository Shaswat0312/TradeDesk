import pool from '../config/db.js';

export const saveBacktestResult = async (userId, result, params) => {
  const query = `
    INSERT INTO backtest_results 
      (user_id, symbol, strategy, params, initial_capital, final_capital, total_return, return_percent, trades)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
  `;

  const values = [
    userId,
    result.symbol,
    result.strategy,
    JSON.stringify(params),
    result.initialCapital,
    result.finalCapital,
    result.totalReturn,
    result.returnPercent,
    JSON.stringify(result.trades),
  ];

  const queryResult = await pool.query(query, values);
  return formatBacktest(queryResult.rows[0]);
};

const formatBacktest = (row) => ({
  ...row,
  initial_capital: parseFloat(row.initial_capital),
  final_capital: parseFloat(row.final_capital),
  total_return: parseFloat(row.total_return),
  return_percent: parseFloat(row.return_percent),
});

export const getBacktestHistory = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM backtest_results WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows.map(formatBacktest);
};

export const getBacktestById = async (userId, id) => {
  const result = await pool.query(
    'SELECT * FROM backtest_results WHERE user_id = $1 AND id = $2',
    [userId, id]
  );
  return result.rows[0] ? formatBacktest(result.rows[0]) : null;
};

export const compareBacktests = async (userId, ids) => {
  const result = await pool.query(
    'SELECT * FROM backtest_results WHERE user_id = $1 AND id = ANY($2)',
    [userId, ids]
  );
  return result.rows.map(formatBacktest);
};