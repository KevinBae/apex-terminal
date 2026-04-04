import React, { useState, useEffect } from 'react';
import './StatusBar.css';

const StatusBar = ({ isConnected }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="terminal-status-bar">
      <div className="status-group">
        <div className="status-item">
          <span className="status-label">SYS_UTC</span>
          <span className="status-value">{time.toLocaleTimeString([], { hour12: false })}</span>
        </div>
        <div className="status-divider"></div>
        <div className="status-item">
          <span className="status-label">LATENCY</span>
          <span className="status-value neon-text-up">
            {isConnected ? '24' : '---'} MS
          </span>
        </div>
        <div className="status-divider"></div>
        <div className="status-item">
          <span className="status-label">CORE_LOAD</span>
          <span className="status-value">1.4%</span>
        </div>
      </div>

      <div className="status-group">
        <div className="status-item">
          <span className="status-label">FEED_SYNC</span>
          <span className="status-value amber-text">{isConnected ? 'ACTIVE_L2' : 'OFFLINE'}</span>
        </div>
        <div className="status-divider"></div>
        <div className="status-item">
          <span className="status-label">REGION</span>
          <span className="status-value">US-EAST-1</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
