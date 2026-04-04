import React from 'react';

/**
 * High-performance SVG Sparkline
 * - Optimized for density (100x30 viewbox)
 * - Dynamic color based on trend
 */
const Sparkline = ({ data, isUp }) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const color = isUp ? 'var(--up-color)' : 'var(--down-color)';

  return (
    <svg width="80" height="24" viewBox={`0 0 ${width} ${height}`} className="sparkline-svg">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
        style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
      />
    </svg>
  );
};

export default Sparkline;
