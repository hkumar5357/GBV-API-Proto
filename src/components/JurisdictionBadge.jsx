import React from 'react';

export default function JurisdictionBadge({ jurisdiction }) {
  const isUnknown = !jurisdiction || /unknown/i.test(jurisdiction);
  const label = isUnknown ? 'General guidance (no state specified)' : `${jurisdiction} workplace protection law`;
  return (
    <div className="jurisdiction-line">
      <span className="jurisdiction-line__check" aria-hidden="true">✓</span>
      <span>{label}</span>
    </div>
  );
}
