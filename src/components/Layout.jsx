import React from 'react';
import TickerTape from './TickerTape';
import Chart from './Chart';
import OrderBook from './OrderBook';
import Watchlist from './Watchlist';
import ErrorBoundary from './ErrorBoundary';
import TradingPanel from './TradingPanel';
import Portfolio from './Portfolio';
import CommandBar from './CommandBar';
import StatusBar from './StatusBar';
import TradeHistory from './TradeHistory';
import NewsFeed from './NewsFeed';
import './Layout.css';

const Layout = ({ 
  isConnected, tickerData, chartData, chartHistory, orderBook, 
  currentPrice, balance, positions, onTrade, symbol, 
  onSymbolChange, trades, interval, onIntervalChange, isMock
}) => {
  return (
    <div className="terminal-layout">
      <header className="terminal-header">
        <div className="terminal-header-title">APEX TERMINAL v2.0</div>
        
        <div className="header-center">
          <CommandBar activeSymbol={symbol} onSymbolChange={onSymbolChange} />
        </div>

        <div className="terminal-header-status" style={{ color: isMock ? 'var(--amber-color)' : isConnected ? 'var(--up-color)' : 'var(--down-color)' }}>
          {isMock ? '● SIMULATED FEED' : isConnected ? '● REAL-TIME SYNC' : '● CONNECTION LOST'}
        </div>
      </header>

      <div className="terminal-macro-ribbon">
        <div className="macro-item">
          <span className="macro-label">S&P 500</span>
          <span className="macro-value neon-text-up">5,204.34 +0.32%</span>
        </div>
        <div className="macro-item">
          <span className="macro-label">GOLD</span>
          <span className="macro-value neon-text-up">2,232.10 +1.45%</span>
        </div>
        <div className="macro-item">
          <span className="macro-label">DXY</span>
          <span className="macro-value neon-text-down">104.22 -0.12%</span>
        </div>
        <div className="macro-item">
          <span className="macro-label">10Y YIELD</span>
          <span className="macro-value">4.32%</span>
        </div>
        <div style={{ flex: 1 }}></div>
        <TickerTape items={tickerData} />
      </div>
      <NewsFeed />
      
      <main className="terminal-main">
        <div className="panel-header">
          <span>MAIN CHART // {symbol.toUpperCase()}</span>
          <span className="amber-text">{interval} INTERVAL</span>
        </div>
        <div className="panel-content" id="main-chart-container" style={{ padding: 0, flex: 1, minHeight: 0, position: 'relative', overflow: 'hidden' }}>
          <Chart 
            key={`${symbol}-${interval}`}
            data={chartData} 
            historyData={chartHistory} 
            activeSymbol={symbol} 
            interval={interval} 
            onIntervalChange={onIntervalChange} 
          />
        </div>
      </main>
      
      <aside className="terminal-side">
        <div className="side-top">
          <div className="panel-header">ORDER BOOK (L2 DEPTH)</div>
          <div className="panel-content orderbook-panel" style={{ flex: 2 }}>
            <OrderBook orderBook={orderBook} currentPrice={currentPrice} />
          </div>
          
          <div className="panel-header">EXECUTION LOG</div>
          <div className="panel-content trades-panel" style={{ flex: 1 }}>
            <TradeHistory trades={trades} />
          </div>
        </div>
        <div className="side-bottom">
          <div className="panel-header">DIRECT ORDER ENTRY</div>
          <div className="panel-content" style={{ flex: 'none', overflow: 'hidden' }}>
            <TradingPanel currentPrice={currentPrice} onTrade={onTrade} symbol={symbol.split('usdt')[0].toUpperCase()} />
          </div>
        </div>
      </aside>
      
      <footer className="terminal-bottom">
        <div className="bottom-left">
          <div className="panel-header">MARKET WATCHLIST (QUOTES)</div>
          <div className="panel-content">
            <Watchlist data={tickerData} onSymbolChange={onSymbolChange} activeSymbol={symbol} />
          </div>
        </div>
        <div className="bottom-right">
          <div className="panel-header">PORTFOLIO & RISK SUMMARY</div>
          <div className="panel-content">
            <Portfolio balance={balance} positions={positions} currentPrice={currentPrice} />
          </div>
        </div>
      </footer>

      <StatusBar isConnected={isConnected} />
    </div>
  );
};

export default Layout;
