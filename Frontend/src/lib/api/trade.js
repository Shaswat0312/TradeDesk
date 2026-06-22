import api from './client';

export const buyStock = (data) => api.post('/trade/buy', data).then(res => res.data);

export const sellStock = (data) => api.post('/trade/sell', data).then(res => res.data);