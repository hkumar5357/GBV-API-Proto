import React, { useState } from 'react';

export default function MandatoryAlert({ citations, onEscalateHr }) {
  const [showReqs, setShowReqs] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleContactHr = () => {
    if (onEscalateHr) onEscalateHr();
    setShowModal(true);
  };

  return (
    <section className="mandatory-alert" role="alert">
      <div className="mandatory-alert__header">
        <span className="mandatory-alert__icon" aria-hidden="true">⚠️</span>
        <span className="mandatory-alert__title">MANDATORY REPORTING MAY APPLY</span>
      </div>
      <div className="mandatory-alert__body">
        Based on this jurisdiction, reporting obligations may apply. Contact your HR department or legal team.
      </div>
      <div className="mandatory-alert__actions">
        <button
          type="button"
          className="btn btn--warning"
          onClick={handleContactHr}
        >
          Contact HR
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setShowReqs(s => !s)}
          aria-expanded={showReqs}
        >
          {showReqs ? 'Hide Details' : 'View Details'} <span aria-hidden="true">{showReqs ? '▴' : '▾'}</span>
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

      {showModal && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hr-modal-title"
          onClick={() => setShowModal(false)}
        >
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__check">
              <span aria-hidden="true">✓</span>
              <span>HR escalation logged</span>
            </div>
            <h3 id="hr-modal-title">Contact HR</h3>
            <p>
              In production, this would notify your HR department via your configured integration
              (email, Slack, Workday, etc.). For this prototype, the escalation has been logged
              in the session audit trail.
            </p>
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setShowModal(false)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
