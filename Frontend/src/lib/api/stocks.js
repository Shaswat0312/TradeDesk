import api from './client';

export const getLiveQuote = (symbol) => api.get(`/stocks/quote/${symbol}`).then(res => res.data);