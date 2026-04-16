import React from 'react';

export default function JurisdictionBadge({ jurisdiction }) {
  const isUnknown = !jurisdiction || /unknown/i.test(jurisdiction);
  const label = isUnknown ? jurisdiction : `${jurisdiction} workplace protection law`;
  return (
    <section className="phase-block phase-block--fade">
      <h2 className="phase-rule">Jurisdiction</h2>
      <div className="jurisdiction-line">
        <span className="jurisdiction-line__check">✓</span>
        <span>{label}</span>
      </div>
    </section>
  );
}
