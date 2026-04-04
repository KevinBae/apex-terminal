import React from 'react';
import './OrderBook.css';

const OrderBook = ({ orderBook, currentPrice }) => {
  const bids = orderBook?.bids || [];
  const asks = [...(orderBook?.asks || [])].reverse();

  if (bids.length === 0 && asks.length === 0) {
    return <div className="orderbook-loading">SYNCING_DOM...</div>;
  }

  const maxVolume = Math.max(
    ...bids.map(b => b.qty),
    ...asks.map(a => a.qty),
    0.001
  );

  const bestBid = bids[0]?.price || 0;
  const bestAsk = orderBook?.asks?.[0]?.price || 0;
  const spread = bestAsk - bestBid;
  const spreadPercent = bestAsk > 0 ? (spread / bestAsk) * 100 : 0;

  return (
    <div className="orderbook-container">
      <div className="orderbook-grid-header">
        <span className="col-price">PRICE</span>
        <span className="col-qty">QUANTITY</span>
        <span className="col-total">TOTAL</span>
      </div>

      <div className="orderbook-scroll-area">
        <div className="orderbook-section asks">
          {asks.slice(-18).map((ask, i) => (
            <div className="orderbook-row ask-row" key={`ask-${i}`}>
              <div className="depth-bar ask-bar" style={{ width: `${(ask.qty / maxVolume) * 100}%` }}></div>
              <span className="row-price neon-text-down">{ask.price.toFixed(2)}</span>
              <span className="row-qty">{ask.qty.toFixed(4)}</span>
              <span className="row-total">{(ask.price * ask.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="orderbook-price-hero">
          <div className="hero-stats">
            <span className="hero-price" style={{ color: currentPrice >= bestBid ? 'var(--up-color)' : 'var(--down-color)' }}>
              {currentPrice ? currentPrice.toFixed(2) : '---'}
            </span>
            <span className="hero-spread">SPREAD: {spread.toFixed(2)} ({spreadPercent.toFixed(3)}%)</span>
          </div>
        </div>

        <div className="orderbook-section bids">
          {bids.slice(0, 18).map((bid, i) => (
            <div className="orderbook-row bid-row" key={`bid-${i}`}>
              <div className="depth-bar bid-bar" style={{ width: `${(bid.qty / maxVolume) * 100}%` }}></div>
              <span className="row-price neon-text-up">{bid.price.toFixed(2)}</span>
              <span className="row-qty">{bid.qty.toFixed(4)}</span>
              <span className="row-total">{(bid.price * bid.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
