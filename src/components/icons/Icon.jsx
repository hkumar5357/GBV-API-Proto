import React from 'react';

/**
 * Small inline-SVG icon set used in the audit timeline.
 * All icons are 20x20, stroke-based, and inherit `currentColor`.
 */

const STROKE_COMMON = {
  width: 20, height: 20, viewBox: '0 0 20 20', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round'
};

const ICONS = {
  clock: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.5V10l3 2" />
    </>
  ),
  mapPin: (
    <>
      <path d="M10 18s5.5-5.5 5.5-9.5a5.5 5.5 0 10-11 0C4.5 12.5 10 18 10 18z" />
      <circle cx="10" cy="8.5" r="2" />
    </>
  ),
  chat: (
    <>
      <path d="M16.5 10.5a6 6 0 01-6 6c-.9 0-1.8-.2-2.6-.6L4 17l1.1-3.9A6 6 0 1116.5 10.5z" />
    </>
  ),
  shield: (
    <>
      <path d="M10 2.5l6 2v5c0 3.6-2.4 6.8-6 8-3.6-1.2-6-4.4-6-8v-5l6-2z" />
    </>
  ),
  alert: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6v4.5M10 13v.5" />
    </>
  ),
  warning: (
    <>
      <path d="M10 3l7.5 13h-15L10 3z" />
      <path d="M10 8.5V12M10 14v.5" />
    </>
  ),
  checkCircle: (
    <>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M6.5 10.5l2.5 2.5L14 8" />
    </>
  ),
  search: (
    <>
      <circle cx="9" cy="9" r="5.5" />
      <path d="M13 13l3.5 3.5" />
    </>
  ),
  document: (
    <>
      <path d="M5.5 3h6l3.5 3.5V17a0 0 0 010 0H5.5a0 0 0 010 0V3z" />
      <path d="M11.5 3v3.5H15" />
      <path d="M7.5 10h5M7.5 13h5" />
    </>
  ),
  download: (
    <>
      <path d="M10 3v10" />
      <path d="M5.5 9l4.5 4.5L14.5 9" />
      <path d="M4 16.5h12" />
    </>
  ),
  envelope: (
    <>
      <rect x="3" y="5" width="14" height="10" rx="1.5" />
      <path d="M3.5 6l6.5 5 6.5-5" />
    </>
  )
};

export default function Icon({ type, className = '', size = 20, ariaHidden = true, title }) {
  const children = ICONS[type];
  if (!children) return null;
  return (
    <svg
      {...STROKE_COMMON}
      width={size}
      height={size}
      className={className}
      aria-hidden={ariaHidden}
      role={title ? 'img' : undefined}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
