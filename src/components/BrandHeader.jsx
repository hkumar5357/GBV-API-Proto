import React from 'react';

export default function BrandHeader({ onHome, subtitle }) {
  return (
    <header className="topnav">
      <button
        type="button"
        className="brand"
        onClick={onHome}
        aria-label="Uplevyl home"
      >
        <span className="brand__mark" aria-hidden="true"></span>
        <span>Uplevyl</span>
      </button>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{subtitle}</div>}
    </header>
  );
}
