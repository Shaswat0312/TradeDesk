import pool from '../config/db.js';
import { getLiveQuote } from './stock.service.js';

export const buyStock = async (userId, symbol, quantity) => {
  const quote = await getLiveQuote(symbol);
  const price = quote.c;

  if (!price || price <= 0) {
    throw new Error('Invalid price received for symbol');
  }

  const totalCost = price * quantity;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query('SELECT balance FROM users WHERE id = $1', [userId]);
    const balance = parseFloat(userResult.rows[0].balance);

    if (balance < totalCost) {
      throw new Error('Insufficient balance');
    }

    const holdingResult = await client.query(
      'SELECT * FROM portfolio WHERE user_id = $1 AND symbol = $2',
      [userId, symbol]
    );
    const existingHolding = holdingResult.rows[0];

    let newQuantity = quantity;
    let newAvgPrice = price;

    if (existingHolding) {
      const oldQty = parseFloat(existingHolding.quantity);
      const oldAvg = parseFloat(existingHolding.avg_buy_price);
      newQuantity = oldQty + quantity;
      newAvgPrice = ((oldQty * oldAvg) + (quantity * price)) / newQuantity;
    }

    await client.query(
      `INSERT INTO portfolio (user_id, symbol, quantity, avg_buy_price)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, symbol)
       DO UPDATE SET quantity = $3, avg_buy_price = $4`,
      [userId, symbol, newQuantity, newAvgPrice]
    );

    await client.query('UPDATE users SET balance = $1 WHERE id = $2', [balance - totalCost, userId]);

    const txResult = await client.query(
      `INSERT INTO transactions (user_id, symbol, type, quantity, price, total)
       VALUES ($1, $2, 'BUY', $3, $4, $5) RETURNING *`,
      [userId, symbol, quantity, price, totalCost]
    );

    await client.query('COMMIT');

    const tx = txResult.rows[0];
    tx.quantity = parseFloat(tx.quantity);
    tx.price = parseFloat(tx.price);
    tx.total = parseFloat(tx.total);
    return tx;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const sellStock = async (userId, symbol, quantity) => {
  const quote = await getLiveQuote(symbol);
  const price = quote.c;

  if (!price || price <= 0) {
    throw new Error('Invalid price received for symbol');
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const holdingResult = await client.query(
      'SELECT * FROM portfolio WHERE user_id = $1 AND symbol = $2',
      [userId, symbol]
    );
    const holding = holdingResult.rows[0];

    if (!holding || parseFloat(holding.quantity) < quantity) {
      throw new Error('Insufficient shares to sell');
    }

    const totalValue = price * quantity;
    const remainingQty = parseFloat(holding.quantity) - quantity;

    if (remainingQty === 0) {
      await client.query('DELETE FROM portfolio WHERE user_id = $1 AND symbol = $2', [userId, symbol]);
    } else {
      await client.query(
        'UPDATE portfolio SET quantity = $1 WHERE user_id = $2 AND symbol = $3',
        [remainingQty, userId, symbol]
      );
    }

    const userResult = await client.query('SELECT balance FROM users WHERE id = $1', [userId]);
    const balance = parseFloat(userResult.rows[0].balance);

    await client.query('UPDATE users SET balance = $1 WHERE id = $2', [balance + totalValue, userId]);

    const txResult = await client.query(
      `INSERT INTO transactions (user_id, symbol, type, quantity, price, total)
       VALUES ($1, $2, 'SELL', $3, $4, $5) RETURNING *`,
      [userId, symbol, quantity, price, totalValue]
    );

    await client.query('COMMIT');

    const tx = txResult.rows[0];
    tx.quantity = parseFloat(tx.quantity);
    tx.price = parseFloat(tx.price);
    tx.total = parseFloat(tx.total);
    return tx;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};