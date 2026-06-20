CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  balance NUMERIC(15, 2) DEFAULT 100000.00,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS historical_prices (
  id SERIAL PRIMARY KEY,
  symbol VARCHAR(10) NOT NULL,
  date DATE NOT NULL,
  open NUMERIC(12, 4),
  high NUMERIC(12, 4),
  low NUMERIC(12, 4),
  close NUMERIC(12, 4),
  volume BIGINT,
  UNIQUE(symbol, date)
);

CREATE TABLE IF NOT EXISTS portfolio (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL DEFAULT 0,
  avg_buy_price NUMERIC(12, 4) NOT NULL,
  UNIQUE(user_id, symbol)
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  type VARCHAR(4) CHECK (type IN ('BUY', 'SELL')) NOT NULL,
  quantity NUMERIC(15, 4) NOT NULL,
  price NUMERIC(12, 4) NOT NULL,
  total NUMERIC(15, 4) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS backtest_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  symbol VARCHAR(10) NOT NULL,
  strategy VARCHAR(20) NOT NULL,
  params JSONB NOT NULL,
  initial_capital NUMERIC(15, 2) NOT NULL,
  final_capital NUMERIC(15, 2) NOT NULL,
  total_return NUMERIC(15, 2) NOT NULL,
  return_percent NUMERIC(8, 4) NOT NULL,
  trades JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);