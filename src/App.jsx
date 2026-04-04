import { useState } from 'react'
import Layout from './components/Layout'
// HMR force trigger change
import { useBinanceWebSocket } from './hooks/useBinanceWebSocket'
import './App.css'

function App() {
  const [symbol, setSymbol] = useState('btcusdt');
  const [interval, setInterval] = useState('1m');
  const { isConnected, tickerData, chartData, chartHistory, orderBook, currentPrice, trades, isMock } = useBinanceWebSocket(symbol, interval);

  const [balance, setBalance] = useState(100000);
  const [positions, setPositions] = useState({});
  const [tradeHistory, setTradeHistory] = useState([]);

  const handleTrade = (type, amount, price, asset) => {
    const cost = amount * price;
    if (type === 'BUY') {
      if (balance >= cost) {
        setBalance(prev => prev - cost);
        setPositions(prev => ({
          ...prev,
          [asset]: (prev[asset] || 0) + amount
        }));
        setTradeHistory(prev => [...prev, { type, amount, price, asset, cost, time: new Date() }]);
      } else {
        alert('Insufficient USDT balance');
      }
    } else if (type === 'SELL') {
      const currentPos = positions[asset] || 0;
      if (currentPos >= amount) {
        setBalance(prev => prev + cost);
        setPositions(prev => ({
          ...prev,
          [asset]: currentPos - amount
        }));
        setTradeHistory(prev => [...prev, { type, amount, price, asset, cost, time: new Date() }]);
      } else {
        alert('Insufficient asset balance');
      }
    }
  };

  return (
    <Layout 
      isConnected={isConnected}
      tickerData={tickerData}
      chartData={chartData}
      chartHistory={chartHistory}
      orderBook={orderBook}
      currentPrice={currentPrice}
      balance={balance}
      positions={positions}
      onTrade={handleTrade}
      symbol={symbol}
      onSymbolChange={setSymbol}
      trades={trades}
      interval={interval}
      onIntervalChange={setInterval}
      isMock={isMock}
    />
  )
}

export default App
