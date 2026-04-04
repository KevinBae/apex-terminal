import React, { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries, ColorType, CrosshairMode } from 'lightweight-charts';
import './Chart.css';

/**
 * Apex Professional Charting Component (V9 - ATOMIC)
 * - Pure data-driven rendering
 * - Dynamic precision for all asset classes
 * - Zero-leakage cleanup on symbol switch
 */
const Chart = ({ data, historyData, activeSymbol, interval, onIntervalChange }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const priceLineRef = useRef(null);
    const lastTimeRef = useRef(null);

    // 1. Initial Mount & Chart Setup
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#0d1117' },
                textColor: '#aaa',
                fontFamily: 'Inter, sans-serif',
                fontSize: 11,
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: { color: '#444', style: 1, labelBackgroundColor: '#111' },
                horzLine: { color: '#444', style: 1, labelBackgroundColor: '#111' },
            },
            leftPriceScale: {
                visible: true,
                borderColor: '#222',
                autoScale: true,
                scaleMargins: { top: 0.1, bottom: 0.1 },
            },
            rightPriceScale: { visible: false },
            timeScale: {
                borderColor: '#222',
                timeVisible: true,
                barSpacing: 8,
                fixLeftEdge: true, // Start history from the left
            },
        });

        const series = chart.addSeries(CandlestickSeries, {
            upColor: '#00ff6b',
            downColor: '#ff4444',
            borderVisible: false,
            wickUpColor: '#00ff6b',
            wickDownColor: '#ff4444',
            priceScaleId: 'left',
            priceLineVisible: false, // Disable default
            lastValueVisible: false,  // Disable default
        });

        series.applyOptions({
            lastPriceAnimationMode: 1,
        });

        chartRef.current = chart;
        seriesRef.current = series;

        const resizeObserver = new ResizeObserver(entries => {
            if (entries.length === 0 || !chartRef.current) return;
            const { width, height } = entries[0].contentRect;
            chartRef.current.applyOptions({ width, height });
        });

        resizeObserver.observe(chartContainerRef.current);

        return () => {
            resizeObserver.disconnect();
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
                seriesRef.current = null;
                priceLineRef.current = null;
            }
        };
    }, []); // One-time setup, Layout key handles re-mount

    // 2. History & Precision Sync
    useEffect(() => {
        if (!seriesRef.current || !historyData || historyData.length === 0) return;

        // Dynamic Precision
        const lastPrice = historyData[historyData.length - 1].close;
        const precision = lastPrice > 1000 ? 2 : (lastPrice > 1 ? 3 : 5);
        seriesRef.current.applyOptions({
            priceFormat: { 
                type: 'price', 
                precision: precision, 
                minMove: 1 / Math.pow(10, precision) 
            }
        });

        seriesRef.current.setData(historyData);
        lastTimeRef.current = historyData[historyData.length - 1].time;
        
        // Removed fitContent to allow natural left-to-right flow
    }, [historyData, activeSymbol]);

    // 3. Live Tick & High-Fidelity Price Line
    useEffect(() => {
        if (!seriesRef.current || !data || !lastTimeRef.current) return;

        // Custom High-Viz Price Line Management
        const series = seriesRef.current;
        
        if (priceLineRef.current) {
            series.removePriceLine(priceLineRef.current);
        }

        priceLineRef.current = series.createPriceLine({
            price: data.close,
            color: data.close >= data.open ? '#00ff6b' : '#ff4444',
            lineWidth: 1,
            lineStyle: 1, // Solid
            axisLabelVisible: true,
            title: 'LIVE',
        });

        if (data.time >= lastTimeRef.current) {
            series.update(data);
            lastTimeRef.current = data.time;
        }
    }, [data]);

    return (
        <div className="chart-outer-container">
            <div className="chart-controls">
                <div className="chart-actions">
                    {['1m', '1h', '1d'].map(val => (
                        <button 
                            key={val}
                            className={`chart-btn ${interval === val ? 'active' : ''}`}
                            onClick={() => onIntervalChange(val)}
                        >{val.toUpperCase()}</button>
                    ))}
                </div>
                <div className="chart-meta">
                    <div className="meta-item">SYM: <span>{activeSymbol.toUpperCase()}</span></div>
                    <div className="meta-item">INT: <span>{interval.toUpperCase()}</span></div>
                </div>
            </div>
            <div 
                ref={chartContainerRef} 
                className="chart-canvas-container" 
            >
                {!historyData && (
                    <div className="chart-loading-overlay">
                        <div className="loading-spinner"></div>
                        <span>SYNCING_MARKET_DATA...</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chart;
