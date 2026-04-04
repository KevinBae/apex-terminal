import { useState, useEffect, useRef } from 'react';

const TOP_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT', 'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT'];

// Professional Baseline Prices
const getBasePrice = (s) => {
    const sym = s.toLowerCase();
    if (sym.includes('btc')) return 67450.40;
    if (sym.includes('eth')) return 3520.10;
    if (sym.includes('bnb')) return 582.30;
    if (sym.includes('sol')) return 145.80;
    if (sym.includes('xrp')) return 0.62;
    if (sym.includes('ada')) return 0.58;
    if (sym.includes('doge')) return 0.18;
    if (sym.includes('avax')) return 52.40;
    if (sym.includes('dot')) return 9.20;
    if (sym.includes('link')) return 18.50;
    return 100.00;
};

const getVolFactor = (i) => {
    if (i === '1m') return 0.0006;
    if (i === '1h') return 0.0001;
    if (i === '1d') return 0.00002;
    return 0.0001;
};

/**
 * Data Engine V10 - TOTAL SYNC
 * - Backward Walking History (Legacy -> Future)
 * - Single Tick Source of Truth
 */
export const useBinanceWebSocket = (symbol = 'btcusdt', interval = '1m') => {
    const wsRef = useRef(null);
    const lastUpdate = useRef(Date.now());
    const tickerCache = useRef({});
    const activeSymbolRef = useRef(symbol);
    
    useEffect(() => {
        activeSymbolRef.current = symbol;
    }, [symbol]);
    
    const [isConnected, setIsConnected] = useState(false);
    const [tickerData, setTickerData] = useState([]);
    const [chartData, setChartData] = useState(null);
    const [chartHistory, setChartHistory] = useState(null);
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
    const [currentPrice, setCurrentPrice] = useState(0);
    const [isMock, setIsMock] = useState(false);

    const generateHistory = (s, i, targetPrice) => {
        setIsMock(true);
        const count = 300;
        const now = new Date();
        const history = [];
        const vol = getVolFactor(i) * 5;
        
        let p = targetPrice;
        for (let j = 0; j < count; j++) {
            const offset = (count - 1 - j);
            let time;
            if (i === '1m') time = Math.floor((now.getTime() - offset * 60000) / 60000) * 60;
            else if (i === '1h') time = Math.floor((now.getTime() - offset * 3600000) / 3600000) * 3600;
            else if (i === '1d') time = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - offset) / 1000);
            else time = Math.floor(now.getTime() / 1000) - offset * 60;

            const move = (Math.random() - 0.5) * (p * vol);
            const open = p - move;
            const close = p;
            
            history.push({
                time,
                open, high: Math.max(open, close) + Math.abs(move * 0.2), 
                low: Math.min(open, close) - Math.abs(move * 0.2), close
            });
            p = open;
        }
        setChartHistory(history);
        setCurrentPrice(targetPrice);
    };

    // 1. Data Hub (Ticker & Mock Pulse)
    useEffect(() => {
        if (tickerData.length === 0) {
            const initial = TOP_SYMBOLS.map(s => ({ symbol: s, price: getBasePrice(s), changePercent: 0, volume: 50000 }));
            setTickerData(initial);
            initial.forEach(t => tickerCache.current[t.symbol] = t);
        }

        const pulse = setInterval(() => {
            if (Date.now() - lastUpdate.current > 5000 || isMock) {
                setIsConnected(true);
                const s = symbol.toUpperCase();
                const i = interval;
                const cached = tickerCache.current[s] || { price: getBasePrice(s) };
                
                const move = (Math.random() - 0.5) * (cached.price * getVolFactor(i));
                const nextPrice = cached.price + move;
                
                // Keep cache updated
                tickerCache.current[s] = { ...cached, symbol: s, price: nextPrice, changePercent: (cached.changePercent || 0) + (move/nextPrice)*100 };
                
                setChartData({
                    time: Math.floor(Date.now() / 1000),
                    open: cached.price, high: Math.max(cached.price, nextPrice),
                    low: Math.min(cached.price, nextPrice), close: nextPrice
                });
                setCurrentPrice(nextPrice);
                
                // Broad market pulse
                TOP_SYMBOLS.forEach(sym => {
                    const c = tickerCache.current[sym] || { price: getBasePrice(sym), volume: 0 };
                    const m = (Math.random() - 0.5) * (c.price * 0.0001);
                    tickerCache.current[sym] = { ...c, symbol: sym, price: c.price + m, volume: (c.volume || 0), changePercent: (c.changePercent || 0) + (m/c.price)*100 };
                });
                setTickerData(Object.values(tickerCache.current));

                setOrderBook({
                    bids: Array.from({length: 12}).map((_, idx) => ({ price: nextPrice - 0.05 - idx*0.1, qty: Math.random()*2 })),
                    asks: Array.from({length: 12}).map((_, idx) => ({ price: nextPrice + 0.05 + idx*0.1, qty: Math.random()*2 }))
                });
            }
        }, 200); // Super responsive

        return () => clearInterval(pulse);
    }, [symbol, interval, isMock]);

    // 2. Fetch & Stream Lifecycle
    useEffect(() => {
        const q = symbol.toUpperCase();
        const initialPrice = (tickerCache.current[q] && tickerCache.current[q].price) || getBasePrice(symbol);
        
        // Critical Reset
        setChartHistory(null);
        setChartData(null);
        setCurrentPrice(initialPrice);

        const fetchKlines = async () => {
            const q = symbol.toUpperCase();
            // Multi-path high-resilience history fetch
            const paths = [
                `/api/v3/klines?symbol=${q}&interval=${interval}&limit=500`, // Vite Proxy
                `https://api.binance.us/api/v3/klines?symbol=${q}&interval=${interval}&limit=500`, // Public US
                `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.binance.com/api/v3/klines?symbol=${q}&interval=${interval}&limit=500`)}` // CORS Proxy
            ];
            
            for (let j = 0; j < paths.length; j++) {
                const url = paths[j];
                try {
                    console.log(`FETCHING_HISTORY [Path ${j}]:`, url);
                    const r = await fetch(url);
                    if (r.ok) {
                        let d = await r.json();
                        // Allorigins wraps data in a 'contents' string or JSON
                        if (d.contents) d = JSON.parse(d.contents);
                        
                        const h = d.map(c => ({ time: c[0]/1000, open: +c[1], high: +c[2], low: +c[3], close: +c[4] }));
                        if (activeSymbolRef.current === symbol) {
                            setChartHistory(h);
                            setCurrentPrice(h[h.length - 1].close);
                            setIsMock(false);
                            console.log(`HISTORY_SYNC_SUCCESS [Path ${j}]`, q);
                            return;
                        }
                    }
                } catch(e) {
                    console.warn(`HISTORY_SYNC_FAIL [Path ${j}]:`, url);
                }
            }
            
            // Critical Fail: Fallback to high-quality procedural generation
            console.error("ALL REAL-TIME HISTORY PATHS FAILED. ACTIVATING EMERGENCY MOCK FEDERATION.");
            generateHistory(symbol, interval, initialPrice);
        };

        fetchKlines();

        const streams = `!ticker@arr/${symbol.toLowerCase()}@kline_${interval}/${symbol.toLowerCase()}@depth20@100ms`;
        const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`);
        
        ws.onmessage = (e) => {
            const { stream, data } = JSON.parse(e.data);
            lastUpdate.current = Date.now();
            setIsConnected(true);
            setIsMock(false);

            if (stream === '!ticker@arr') {
                data.forEach(t => {
                    if (TOP_SYMBOLS.includes(t.s)) {
                        tickerCache.current[t.s] = { symbol: t.s, price: +t.c, changePercent: +t.P };
                    }
                });
                setTickerData(Object.values(tickerCache.current));
            } else if (stream.includes('@kline')) {
                const k = data.k;
                setChartData({ time: k.t/1000, open: +k.o, high: +k.h, low: +k.l, close: +k.c });
                setCurrentPrice(+k.c);
            } else if (stream.includes('@depth')) {
                setOrderBook({
                    bids: data.bids.map(b => ({ price: +b[0], qty: +b[1] })),
                    asks: data.asks.map(a => ({ price: +a[0], qty: +a[1] }))
                });
            }
        };

        wsRef.current = ws;
        return () => ws.close();
    }, [symbol, interval]);

    return { isConnected, tickerData, chartData, chartHistory, orderBook, currentPrice, isMock };
};
