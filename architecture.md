# Project Architecture: Apex Terminal v2.0

A high-performance, real-time financial data terminal built with modern web technologies, mimicking the aesthetics and functionality of professional trading platforms. Featuring a resilient "Self-Healing" data engine and ultra-low latency execution feeds.

## 🚀 Tech Stack

- **Core**: React 19 (JavaScript)
- **Build Tool**: Vite
- **Charting**: Lightweight Charts (TradingView)
- **Styling**: Vanilla CSS (Terminal-centric design)
- **Data Source**: Live Binance WebSocket & REST API

## 🏗️ Core Architecture

The application follows a **Unidirectional Data Flow** pattern:

1.  **State Orchestration**: `App.jsx` acts as the root controller, managing user-specific state like `balance`, `portfolio`, and `tradeHistory`.
2.  **Resilient Data Ingestion**: The `useBinanceWebSocket` custom hook (V8 SYNC Engine) manages the lifecycle of data updates. It features a "Self-Healing" mechanism that automatically falls back to mock data if all API endpoints are unreachable.
3.  **Context-less Props Drilling**: Data is passed down from `App` to `Layout`, and then distributed to specialized child components.
4.  **Decoupled View Logic**: Each UI component in `/src/components` is responsible for its own rendering logic and local UI state, relying on props for financial data.

## 🧩 Key Components

### 1. `Layout.jsx`
The grid-based skeleton of the application. It defines the "Terminal" feel, managing the responsive placement of all other panels.

### 2. `Chart.jsx`
Integrates `lightweight-charts`. It handles real-time 1-second interval updates, price scales, and time-axis synchronization. It uses a `ResizeObserver` to maintain chart dimensions within its grid cell.

### 3. `OrderBook.jsx` (L2 Depth)
Displays live Bids and Asks with 100ms updates. It features market depth visualization using CSS-based progress bars to show volume levels.

### 4. `CommandBar.jsx` & `StatusBar.jsx`
The `CommandBar` allows for terminal-style asset switching (`/BTCUSDT`). The `StatusBar` provides real-time connectivity health and identifies when the terminal is in "LIVE" vs "MOCK" mode.

### 5. `TradingPanel.jsx` & `TradeHistory.jsx`
The transactional core. Users execute "Paper Trades" (Buy/Sell) which are calculated against live prices and logged in a persistent session history feed.

### 6. `Watchlist.jsx` & `TickerTape.jsx`
Global market monitoring. Featuring high-density layouts and custom `Sparkline` mini-charts to show 24h trends at a glance.

### 7. `Portfolio.jsx`
Real-time position tracker that calculates P&L dynamically based on the current market price vs the entry price.

## 📡 Data Management & Integration

The terminal leverages a **Multi-Path Connectivity** strategy for high-fidelity data:
-   **Initial Load**: Attempts historical `klines` fetch via `api.binance.com`, falling back to `api.binance.us` or a CORS proxy if regions are blocked.
-   **Real-time Streams**:
    -   `!ticker@arr`: Global price updates for all major pairs.
    -   `${symbol}@kline_1s`: Ultra-high frequency 1-second candle building.
    -   `${symbol}@depth20@100ms`: High-speed Level 2 order book updates.
    -   `${symbol}@aggTrade`: Real-time execution tape for actual trades across the exchange.
-   **Self-Healing Fallback**: If the network is restricted, the engine initializes a **Volatility-Matched Mock Pulse** (250ms interval) to ensure the terminal remains functional for paper trading.

## 🎨 Design Philosophy

-   **Bloomberg Aesthetic**: High-contrast dark backgrounds (`#0a0a0a`), neon cyan/orange accents, and mono-spaced utility fonts.
-   **Information Density**: Maximizing screen real estate with small font sizes and tight padding, consistent with professional Bloomberg Terminals.
-   **Performance First**: Minimal component re-renders by passing primitive data types where possible and leveraging optimized charting libraries.

## 📁 File Structure

```text
bloomberg-clone/
├── src/
│   ├── components/       # Reusable UI Blocks
│   │   ├── Layout.jsx    # Terminal Skeleton
│   │   ├── Chart.jsx     # Financial Charts
│   │   └── ...           # OrderBook, Portfolio, etc.
│   ├── hooks/            # Custom Data Logic
│   │   └── useBinanceWebSocket.js
│   ├── App.jsx           # Root State Controller
│   ├── index.css         # Global Design Tokens
│   └── main.jsx          # Entry Point
├── public/               # Static Assets
└── vite.config.js        # Build Configuration
```
