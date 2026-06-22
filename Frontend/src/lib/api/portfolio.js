import api from './client';

export const getPortfolio = () => api.get('/portfolio').then(res => res.data);

export const getTransactions = () => api.get('/portfolio/transactions').then(res => res.data);