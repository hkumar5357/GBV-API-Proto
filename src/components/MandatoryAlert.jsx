import React, { useState } from 'react';

export default function MandatoryAlert({ citations }) {
  const [showReqs, setShowReqs] = useState(false);
  return (
    <section className="mandatory-alert" role="alert">
      <div className="mandatory-alert__header">
        <span className="mandatory-alert__icon">⚠️</span>
        <span className="mandatory-alert__title">MANDATORY REPORTING MAY APPLY</span>
      </div>
      <div className="mandatory-alert__body">
        Based on this jurisdiction, reporting obligations may apply. Contact your HR department or legal team.
      </div>
      <div className="mandatory-alert__actions">
        <button
          type="button"
          className="btn btn--warning"
          onClick={() => alert('Opening HR contact channel (mock)')}
        >
          Contact HR
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setShowReqs(s => !s)}
        >
          {showReqs ? 'Hide Requirements' : 'View Requirements'}
        </button>
      </div>
      {showReqs && citations && citations.length > 0 && (
        <ul className="mandatory-alert__reqs">
          {citations.map((c, i) => (
            <li key={i}>
              <strong>{c.statute}</strong> — {c.description}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
