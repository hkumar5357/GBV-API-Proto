import React from 'react';

export default function BackRow({ label = '← Back', onClick, ariaLabel }) {
  return (
    <div className="backrow">
      <button
        type="button"
        className="btn--back"
        onClick={onClick}
        aria-label={ariaLabel || label}
      >
        {label}
      </button>
    </div>
  );
}
