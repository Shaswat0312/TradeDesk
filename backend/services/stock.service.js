import axios from 'axios';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';

export const getLiveQuote = async (symbol) => {
  const url = `${FINNHUB_BASE_URL}/quote`;

  const response = await axios.get(url, {
    params: {
      symbol: symbol,
      token: process.env.FINNHUB_API_KEY,
    },
  });

  return response.data;
};