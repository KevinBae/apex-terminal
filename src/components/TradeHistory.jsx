import React from 'react';
import './TradeHistory.css';

const TradeHistory = ({ trades }) => {
  if (!trades || trades.length === 0) {
    return <div className="trades-loading">AWAITING_TRADES...</div>;
  }

  return (
    <div className="trades-container">
      <div className="trades-header">
        <span className="col-time">TIME</span>
        <span className="col-price">PRICE</span>
        <span className="col-size">SIZE</span>
      </div>
      <div className="trades-list">
        {trades.map((trade) => (
          <div className="trade-row" key={trade.id}>
            <span className="trade-time">
              {new Date(trade.time).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <span className={`trade-price ${trade.isBuyerMaker ? 'down' : 'up'}`}>
              {trade.price.toFixed(2)}
            </span>
            <span className="trade-size">{trade.qty.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TradeHistory;
