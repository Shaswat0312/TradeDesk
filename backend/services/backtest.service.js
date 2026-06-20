import { getHistoricalPrices } from '../models/historicalPrice.model.js';

const calculateSMA = (prices, period, index) => {
  if (index < period - 1) return null;

  let total = 0;

  for (let i = index - period + 1; i <= index; i++) {
    total += prices[i].close;
  }

  return total / period;
};

export const runMACrossoverBacktest = async (
  symbol,
  shortPeriod = 10,
  longPeriod = 50,
  initialCapital = 100000
) => {
  const prices = await getHistoricalPrices(symbol);

  if (prices.length < longPeriod) {
    throw new Error('Not enough historical data for backtest');
  }

  let capital = initialCapital;
  let shares = 0;
  let holding = false;

  const trades = [];

  for (let i = 0; i < prices.length; i++) {
    const shortMA = calculateSMA(prices, shortPeriod, i);
    const longMA = calculateSMA(prices, longPeriod, i);

    if (!shortMA || !longMA) continue;

    const prevShortMA = calculateSMA(prices, shortPeriod, i - 1);
    const prevLongMA = calculateSMA(prices, longPeriod, i - 1);

    if (!prevShortMA || !prevLongMA) continue;

    const price = prices[i].close;

    if (prevShortMA <= prevLongMA && shortMA > longMA && !holding) {
      shares = capital / price;
      capital = 0;
      holding = true;

      trades.push({
        date: prices[i].date,
        type: 'BUY',
        price,
      });
    }

    if (prevShortMA >= prevLongMA && shortMA < longMA && holding) {
      capital = shares * price;
      shares = 0;
      holding = false;

      trades.push({
        date: prices[i].date,
        type: 'SELL',
        price,
      });
    }
  }

  if (holding) {
    capital = shares * prices[prices.length - 1].close;
  }

  const totalReturn = capital - initialCapital;
  const returnPercent = (totalReturn / initialCapital) * 100;

  return {
    symbol,
    strategy: 'MA_CROSSOVER',
    initialCapital,
    finalCapital: capital,
    totalReturn,
    returnPercent,
    trades,
  };
};


const calculateRSI = (prices, period, index) => {
  if (index < period) return null;

  let gains = 0;
  let losses = 0;

  for (let i = index - period + 1; i <= index; i++) {
    const change = prices[i].close - prices[i - 1].close;
    if (change > 0) {
      gains += change;
    } else {
      losses += Math.abs(change);
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;

  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));

  return rsi;
};

export const runRSIBacktest = async (symbol, period = 14, oversold = 30, overbought = 70, initialCapital = 100000) => {
  const prices = await getHistoricalPrices(symbol);

  if (prices.length < period + 1) {
    throw new Error('Not enough historical data for backtest');
  }

  let capital = initialCapital;
  let shares = 0;
  let position = null;
  const trades = [];

  for (let i = period; i < prices.length; i++) {
    const rsi = calculateRSI(prices, period, i);
    if (rsi === null) continue;
    

    const currentPrice = prices[i].close;

    if (rsi < oversold && position !== 'LONG') {
      shares = capital / currentPrice;
      capital = 0;
      position = 'LONG';
      trades.push({ date: prices[i].date, type: 'BUY', price: currentPrice, rsi });
    }

    if (rsi > overbought && position === 'LONG') {
      capital = shares * currentPrice;
      shares = 0;
      position = null;
      trades.push({ date: prices[i].date, type: 'SELL', price: currentPrice, rsi });
    }
  }

  if (position === 'LONG') {
    capital = shares * prices[prices.length - 1].close;
  }

  const totalReturn = capital - initialCapital;
  const returnPercent = (totalReturn / initialCapital) * 100;

  return {
    symbol,
    strategy: 'RSI',
    initialCapital,
    finalCapital: capital,
    totalReturn,
    returnPercent,
    trades,
  };
};