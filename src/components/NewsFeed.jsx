import React, { useState, useEffect } from 'react';
import './NewsFeed.css';

const MOCK_HEADLINES = [
  "FED SIGNALS RATE HOLD // STABLE OUTLOOK",
  "BTC BREAKS RESISTANCE AT 68K // VOLATILITY UP",
  "ETH SHAPELLA UPGRADE COMPLETE // NETWORK STABLE",
  "GOLD HITS ALL-TIME HIGH // MACRO UNCERTAINTY",
  "S&P 500 FUTURES TRADE FLAT // PRE-MARKET",
  "OIL PRICES SLIP ON SUPPLY DATA // INVENTORY UP",
  "TECH SECTOR RALLY CONTINUES // AI DOMINANCE",
  "BANK OF JAPAN MAINTAINS RATE // YEN WEAKENS",
  "EUROPEAN MARKETS OPEN HIGHER // GDP BEAT",
  "NVIDIA EARNINGS EXPECTED // HIGH ANTICIPATION",
  "TREASURY YIELDS STABILIZE // 10Y AT 4.3%",
  "DXY TRENDS LOWER // DOLLAR WEAKNESS"
];

const NewsFeed = () => {
  const [headline, setHeadline] = useState(MOCK_HEADLINES[0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHeadline(MOCK_HEADLINES[Math.floor(Math.random() * MOCK_HEADLINES.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="news-feed-container">
      <span className="news-tag">BREAKING</span>
      <span className="news-headline">{headline}</span>
    </div>
  );
};

export default NewsFeed;
