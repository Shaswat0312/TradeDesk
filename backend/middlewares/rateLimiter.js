import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});

export const importLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 5,
  message: { message: 'Too many import requests. Alpha Vantage has limited quota — try again later.' },
});