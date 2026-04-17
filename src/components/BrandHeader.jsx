import React from 'react';

export default function BrandHeader({ onHome, pageLabel, pageLabelActive = false }) {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <button
          type="button"
          className="brand"
          onClick={onHome}
          aria-label="Uplevyl home"
        >
          <span className="brand__mark" aria-hidden="true"></span>
          <span>Uplevyl</span>
        </button>
        {pageLabel && (
          <div className="navbar__right">
            <span className="navbar__pagelabel">
              {pageLabelActive && <span className="navbar__pagelabel-dot" aria-hidden="true"></span>}
              {pageLabel}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
