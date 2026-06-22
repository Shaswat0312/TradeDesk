import api from './client';

export const registerUser = (data) => api.post('/auth/register', data).then(res => res.data);

export const loginUser = (data) => api.post('/auth/login', data).then(res => res.data);

export const getMe = () => api.get('/auth/me').then(res => res.data);