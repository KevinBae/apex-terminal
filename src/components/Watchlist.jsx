import React, { useMemo } from 'react';
import Sparkline from './Sparkline';
import './Watchlist.css';

const Watchlist = ({ data, onSymbolChange, activeSymbol }) => {
  const stableBases = useMemo(() => {
    const bases = {};
    data.forEach(item => {
        bases[item.symbol] = Array.from({length: 12}).map(() => (Math.random() * 0.06) - 0.03);
    });
    return bases;
  }, [data.length]);

  if (!data || data.length === 0) {
    return <div className="watchlist-loading">BUSING_MARKET_FEED...</div>;
  }

  return (
    <div className="watchlist-container">
      <table className="watchlist-table">
        <thead>
          <tr>
            <th className="left-align">TICKER</th>
            <th className="right-align">LAST_PRC</th>
            <th className="right-align">CHG_PCT</th>
            <th className="right-align">24H_VOL</th>
            <th className="center-align">TREND</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const isUp = item.changePercent >= 0;
            const isActive = activeSymbol.toUpperCase() === item.symbol.toUpperCase();
            
            const base = stableBases[item.symbol] || [0,0,0,0,0,0,0,0,0,0,0,0];
            const liveTrend = base.map((offset, i) => {
                if (i === base.length - 1) return item.price;
                return item.price * (1 + offset);
            });

            const symbolBase = (item.symbol || '').replace('USDT', '');

            return (
              <tr 
                key={item.symbol} 
                onClick={() => onSymbolChange(item.symbol.toLowerCase())}
                className={isActive ? 'active-row' : ''}
              >
                <td className="watchlist-symbol amber-text">{symbolBase}</td>
                <td className="right-align price-cell">{Number(item.price).toFixed(item.price < 1 ? 4 : 2)}</td>
                <td className={`right-align ${isUp ? 'neon-text-up' : 'neon-text-down'}`}>
                  {isUp ? '+' : ''}{Number(item.changePercent).toFixed(2)}%
                </td>
                <td className="right-align volume-cell">
                  {item.volume && item.volume > 1000000 ? `${(item.volume / 1000000).toFixed(1)}M` : (item.volume || 0).toLocaleString()}
                </td>
                <td className="center-align trend-cell">
                  <Sparkline data={liveTrend} isUp={isUp} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist;
