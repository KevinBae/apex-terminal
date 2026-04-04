import React from 'react';
import './Portfolio.css';

const Portfolio = ({ balance, positions, currentPrice }) => {
  const btcPosition = positions['BTC'] || 0;
  const positionValue = btcPosition * (currentPrice || 0);
  const totalValue = balance + positionValue;
  
  // Mock PnL for visual enrichment
  const unrealizedPnL = btcPosition > 0 ? (positionValue * 0.024) : 0;
  
  return (
    <div className="portfolio-risk-container">
      <div className="risk-summary-header">
        <div className="risk-stat">
          <span className="risk-label">EQUITY</span>
          <span className="risk-value">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="risk-stat">
          <span className="risk-label">CASH</span>
          <span className="risk-value">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="risk-stat">
          <span className="risk-label">UPNL</span>
          <span className={`risk-value ${unrealizedPnL >= 0 ? 'neon-text-up' : 'neon-text-down'}`}>
            {unrealizedPnL >= 0 ? '+' : ''}${unrealizedPnL.toFixed(2)}
          </span>
        </div>
      </div>
      
      <div className="risk-table-wrapper">
        <table className="risk-table">
          <thead>
            <tr>
              <th className="left-align">IDENT</th>
              <th className="right-align">POS_QTY</th>
              <th className="right-align">MKT_VAL</th>
              <th className="right-align">EXPOSURE</th>
            </tr>
          </thead>
          <tbody>
            {btcPosition > 0 ? (
              <tr>
                <td className="left-align amber-text">BTC/USDT</td>
                <td className="right-align">{btcPosition.toFixed(4)}</td>
                <td className="right-align">${currentPrice ? currentPrice.toFixed(2) : '---'}</td>
                <td className="right-align">${positionValue.toFixed(2)}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4" className="empty-risk">NO_ACTIVE_EXPOSURE</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Portfolio;
