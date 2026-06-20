import axios from 'axios';

const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

export const fetchHistoricalData = async (symbol) => {
  const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
    params: {
      function: 'TIME_SERIES_DAILY',
      symbol: symbol,
      outputsize: 'compact',
      apikey: process.env.ALPHA_VANTAGE_API_KEY,
    },
  });

  const timeSeries = response.data['Time Series (Daily)'];

  if (!timeSeries) {
    throw new Error('No historical data found for this symbol');
  }

  const formatted = Object.entries(timeSeries).map(([date, values]) => ({
    date,
    open: parseFloat(values['1. open']),
    high: parseFloat(values['2. high']),
    low: parseFloat(values['3. low']),
    close: parseFloat(values['4. close']),
    volume: parseInt(values['5. volume']),
  }));

  return formatted;
};