import api from './client';

export const runMACrossover = (symbol, params) =>
  api.post(`/backtest/ma-crossover/${symbol}`, params).then(res => res.data);

export const runRSI = (symbol, params) =>
  api.post(`/backtest/rsi/${symbol}`, params).then(res => res.data);

export const getBacktestHistory = () => api.get('/backtest/history').then(res => res.data);

export const compareBacktests = (ids) =>
  api.post('/backtest/compare', { ids }).then(res => res.data);