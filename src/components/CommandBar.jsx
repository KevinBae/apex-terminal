import React, { useState, useEffect, useRef } from 'react';
import './CommandBar.css';

const CommandBar = ({ activeSymbol, onSymbolChange }) => {
  const [value, setValue] = useState(activeSymbol.toUpperCase());
  const inputRef = useRef(null);

  useEffect(() => {
    setValue(activeSymbol.toUpperCase());
  }, [activeSymbol]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleGo = () => {
    if (value && value.trim()) {
      let sym = value.trim().toLowerCase();
      if (!sym.endsWith('usdt')) sym += 'usdt';
      onSymbolChange(sym);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleGo();
    if (e.key === 'Escape') inputRef.current?.blur();
  };

  return (
    <div className="command-bar-container">
      <div className="command-prompt">{'>'}</div>
      <input 
        ref={inputRef}
        type="text" 
        className="command-input" 
        placeholder="SEARCH SYMBOL..."
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        onKeyDown={handleKeyDown}
      />
      <button className="command-go-btn" onClick={handleGo}>EXEC</button>
      <div className="command-divider"></div>
      <div className="command-status-label">SYS_RUNNING</div>
    </div>
  );
};

export default CommandBar;
