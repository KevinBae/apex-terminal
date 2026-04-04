import React, { useState } from 'react';
import './TradingPanel.css';

const TradingPanel = ({ currentPrice, onTrade, symbol = 'BTC' }) => {
  const [amount, setAmount] = useState('');
  const [orderType, setOrderType] = useState('MARKET');
  const [tif, setTif] = useState('GTC');

  const handleBuy = () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    onTrade('BUY', parseFloat(amount), currentPrice, symbol);
    setAmount('');
  };

  const handleSell = () => {
    if (!amount || isNaN(amount) || amount <= 0) return;
    onTrade('SELL', parseFloat(amount), currentPrice, symbol);
    setAmount('');
  };

  const estimatedValue = currentPrice && amount && !isNaN(amount) ? (currentPrice * parseFloat(amount)).toFixed(2) : '0.00';

  return (
    <div className="trading-doe-container">
      <div className="doe-row">
        <div className="doe-group">
          <label className="doe-label">TYPE</label>
          <select className="doe-select" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option>MARKET</option>
            <option>LIMIT</option>
            <option>STOP</option>
          </select>
        </div>
        <div className="doe-group">
          <label className="doe-label">TIF</label>
          <select className="doe-select" value={tif} onChange={(e) => setTif(e.target.value)}>
            <option>GTC</option>
            <option>IOC</option>
            <option>FOK</option>
          </select>
        </div>
      </div>

      <div className="doe-row">
        <div className="doe-group flex-2">
          <label className="doe-label">QUANTITY ({symbol})</label>
          <input 
            type="number" 
            step="0.001" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="0.00"
            className="doe-input"
          />
        </div>
      </div>

      <div className="doe-row stats">
        <div className="doe-stat">
          <span className="doe-label">PRICE:</span>
          <span className="doe-value amber-text">{currentPrice ? `$${currentPrice.toFixed(2)}` : '---'}</span>
        </div>
        <div className="doe-stat">
          <span className="doe-label">VALUE:</span>
          <span className="doe-value">${estimatedValue}</span>
        </div>
      </div>

      <div className="doe-actions">
        <button className="doe-btn-long" onClick={handleBuy}>
          LONG <span className="doe-btn-sub">BUY</span>
        </button>
        <button className="doe-btn-short" onClick={handleSell}>
          SHORT <span className="doe-btn-sub">SELL</span>
        </button>
      </div>
    </div>
  );
};

export default TradingPanel;
