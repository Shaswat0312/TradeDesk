import axios from 'axios';
import redisClient from '../config/redis.js';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const CACHE_TTL = 10; // seconds

export const getLiveQuote = async (symbol) => {
  const cacheKey = `quote:${symbol}`;

  const cached = await redisClient.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const url = `${FINNHUB_BASE_URL}/quote`;
  const response = await axios.get(url, {
    params: {
      symbol: symbol,
      token: process.env.FINNHUB_API_KEY,
    },
  });

  await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response.data));

  return response.data;
};