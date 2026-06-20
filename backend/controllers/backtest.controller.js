import { runMACrossoverBacktest, runRSIBacktest } from '../services/backtest.service.js';
import { saveBacktestResult, getBacktestHistory, compareBacktests } from '../models/backtestResult.model.js';

export const backtestMA = async (req, res) => {
  const { symbol } = req.params;
  const { shortPeriod, longPeriod, initialCapital } = req.body;

  try {
    const params = {
      shortPeriod: shortPeriod || 10,
      longPeriod: longPeriod || 50,
      initialCapital: initialCapital || 100000,
    };

    const result = await runMACrossoverBacktest(
      symbol,
      params.shortPeriod,
      params.longPeriod,
      params.initialCapital
    );

    const saved = await saveBacktestResult(req.user.id, result, params);

    res.status(200).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const backtestRSI = async (req, res) => {
  const { symbol } = req.params;
  const { period, oversold, overbought, initialCapital } = req.body;

  try {
    const params = {
      period: period || 14,
      oversold: oversold || 30,
      overbought: overbought || 70,
      initialCapital: initialCapital || 100000,
    };

    const result = await runRSIBacktest(
      symbol,
      params.period,
      params.oversold,
      params.overbought,
      params.initialCapital
    );

    const saved = await saveBacktestResult(req.user.id, result, params);

    res.status(200).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    const history = await getBacktestHistory(req.user.id);
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const compare = async (req, res) => {
  const { ids } = req.body;

  try {
    const results = await compareBacktests(req.user.id, ids);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};