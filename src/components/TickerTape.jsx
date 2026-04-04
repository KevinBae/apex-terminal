import React from 'react';
import './TickerTape.css';

const TickerTape = ({ items }) => {
  if (!items || items.length === 0) {
    return <div style={{ padding: '0 1rem', color: 'var(--text-secondary)', fontSize: '10px' }}>BUSING DATA...</div>;
  }

  // Double the items for seamless loop
  const duplicatedItems = [...items, ...items];

  return (
    <div className="tickertape-viewport">
      <div className="tickertape-scroll">
        {duplicatedItems.map((item, index) => {
          const isUp = item.changePercent >= 0;
          const symbolBase = item.symbol.replace('USDT', '');
          return (
            <div key={`${item.symbol}-${index}`} className="ticker-item">
              <span className="ticker-symbol">{symbolBase}</span>
              <span className="ticker-price">{Number(item.price).toFixed(item.price < 1 ? 4 : 2)}</span>
              <span className={`ticker-change ${isUp ? 'neon-text-up' : 'neon-text-down'}`}>
                {isUp ? '+' : ''}{Math.abs(Number(item.changePercent)).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TickerTape;
