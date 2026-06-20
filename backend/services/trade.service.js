import pool from '../config/db.js';
import { getLiveQuote } from './stock.service.js';
import { getHolding, upsertHolding, deleteHolding } from '../models/portfolio.model.js';
import { createTransaction } from '../models/transaction.model.js';
import { findUserById, updateBalance } from '../models/user.model.js';

export const buyStock = async (userId, symbol, quantity) => {
  const quote = await getLiveQuote(symbol);
  const price = quote.c;

  if (!price || price <= 0) {
    throw new Error('Invalid price received for symbol');
  }

  const totalCost = price * quantity;

  const user = await findUserById(userId);
  if (user.balance < totalCost) {
    throw new Error('Insufficient balance');
  }

  const existingHolding = await getHolding(userId, symbol);

  let newQuantity = quantity;
  let newAvgPrice = price;

  if (existingHolding) {
    const oldQty = parseFloat(existingHolding.quantity);
    const oldAvg = parseFloat(existingHolding.avg_buy_price);

    newQuantity = oldQty + quantity;
    newAvgPrice = ((oldQty * oldAvg) + (quantity * price)) / newQuantity;
  }

  await upsertHolding(userId, symbol, newQuantity, newAvgPrice);
  await updateBalance(userId, user.balance - totalCost);
  const transaction = await createTransaction(userId, symbol, 'BUY', quantity, price, totalCost);

  return transaction;
};

export const sellStock = async (userId, symbol, quantity) => {
  const holding = await getHolding(userId, symbol);

  if (!holding || parseFloat(holding.quantity) < quantity) {
    throw new Error('Insufficient shares to sell');
  }

  const quote = await getLiveQuote(symbol);
  const price = quote.c;

  if (!price || price <= 0) {
    throw new Error('Invalid price received for symbol');
  }

  const totalValue = price * quantity;
  const remainingQty = parseFloat(holding.quantity) - quantity;

  if (remainingQty === 0) {
    await deleteHolding(userId, symbol);
  } else {
    await upsertHolding(userId, symbol, remainingQty, holding.avg_buy_price);
  }

  const user = await findUserById(userId);
  await updateBalance(userId, user.balance + totalValue);

  const transaction = await createTransaction(userId, symbol, 'SELL', quantity, price, totalValue);

  return transaction;
};