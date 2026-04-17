import React from 'react';

export default function Toast({ message, variant = 'success' }) {
  const cls = variant === 'success'
    ? 'toast'
    : `toast toast--${variant}`;
  return (
    <div className={cls} role="status" aria-live="polite">
      {message}
    </div>
  );
}
