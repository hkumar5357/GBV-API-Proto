import React from 'react';
import { STATE_ABBR } from '../data/verticals.js';

export default function LocationBadge({ provisioning, onChange }) {
  const abbr = STATE_ABBR[provisioning.state] || provisioning.state;
  const label = `📍 ${provisioning.orgName}${provisioning.locationId ? ' ' + provisioning.locationId : ''} · ${abbr}`;
  return (
    <div className="location-badge">
      <span>{label}</span>
      {onChange && (
        <button type="button" className="location-badge__change" onClick={onChange}>
          Change
        </button>
      )}
    </div>
  );
}
