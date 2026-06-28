# TradeDesk

A full-stack paper-trading platform supporting **dual-market trading** — US stocks and Indian (NSE) equities — with live quotes, portfolio tracking, transaction history, and strategy backtesting.

---

## Features

- **Dual-market support**
  - US stocks via **Finnhub** (live quotes) + **Alpha Vantage** (historical data)
  - Indian `.NS` stocks via **yahoo-finance2**
- **Live trading simulation**
  - Symbol search with debounced autocomplete merging Finnhub + Yahoo Finance results
  - Real-time OHLC quotes
  - Buy/sell with cash balance validation
- **Atomic trade execution**
  - All buy/sell operations wrapped in PostgreSQL transactions (`BEGIN` / `COMMIT` / `ROLLBACK`) to prevent partial writes
- **Multi-currency architecture**
  - Single INR-denominated balance
  - USD trades automatically converted to INR using live FX rates (Alpha Vantage, Redis-cached)
- **Portfolio & dashboard**
  - Holdings table with auto-refresh polling
  - Transaction history with currency and FX details
- **Strategy backtesting**
  - MA Crossover and RSI backtesting engines
  - Results persisted as JSONB
  - Supports both US and `.NS` historical data

---

## Tech Stack

### Backend
- Node.js (Express, ES Modules)
- PostgreSQL
- Redis (caching: symbol search, FX rates)
- Docker

### Frontend
- React (JSX)
- Vite
- Tailwind CSS v4 (CSS-first config)
- shadcn/ui (neutral base, radix primitives)
- TanStack Query
- Zustand (with persistence)
- React Router v7
- Sonner (toasts)
- Lucide (icons)

### Data Providers
- Finnhub — live US quotes
- Alpha Vantage — historical US data, FX rates
- yahoo-finance2 — live and historical Indian (`.NS`) equities

---

## Architecture Highlights

- **Numeric precision handling:** PostgreSQL returns `NUMERIC` columns as JS strings. All financial math (SMA, RSI, balance arithmetic) explicitly parses these at the model layer to avoid silent string-concatenation bugs.
- **Transactional integrity:** Trade execution uses `pool.connect()` with explicit transaction blocks, ensuring no partial state is written if a trade fails mid-way.
- **Currency-aware schema:** `transactions` table stores `currency`, `fx_rate`, and `inr_equivalent_total` per trade; `portfolio` stores `currency`. All balances are tracked in INR.
- **Symbol-aware formatting:** A centralized `formatCurrency(value, symbol)` utility detects `.NS` suffixes to apply the correct currency locale across the UI.
- **Resilient data sourcing:** Indian market data was migrated from a stale third-party package to `yahoo-finance2` after data accuracy issues were identified.

---

## Project Structure

```
TradeDesk/
├── backend/
│   ├── config/
│   │   └── schema.sql
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   │   ├── trade.service.js
│   │   └── fx.service.js
│   └── index.js
└── Frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── DashboardPage.jsx
    │   │   ├── PortfolioPage.jsx
    │   │   ├── TradePage.jsx
    │   │   └── BacktestPage.jsx
    │   ├── lib/
    │   │   └── format.js
    │   └── store/
    └── vite.config.js
```

---

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL
- Redis
- Docker (optional, for containerized services)

### Environment Variables
Create a `.env` file in `backend/` with the following:

```
DATABASE_URL=
REDIS_URL=
FINNHUB_API_KEY=
ALPHA_VANTAGE_API_KEY=
JWT_SECRET=
```

### Installation

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd Frontend
npm install
npm run dev
```

### Database Setup

```bash
psql -U <user> -d <database> -f backend/config/schema.sql
```

---

## Pages

| Page | Description |
|------|-------------|
| **Login / Register** | User authentication |
| **Dashboard** | Stat strip + holdings table with auto-refresh polling |
| **Trade** | Symbol search, live quote, buy/sell panel, position card |
| **Portfolio** | Full transaction history with currency/FX breakdown |
| **Backtest** | Run MA Crossover and RSI strategies on historical data |

---

