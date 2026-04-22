import React, { useEffect, useState } from 'react';

/**
 * Simulated Email to HR flow.
 * Shows an email preview, then on confirm plays a brief success animation
 * before the parent closes the modal and logs the event in the audit trail.
 */
export default function EmailToHrModal({ record, provisioning, onCancel, onConfirm }) {
  const [toAddress, setToAddress] = useState('hr@' + domainize(provisioning.orgName) + '.com');
  const [note, setNote] = useState('');
  const [stage, setStage] = useState('preview'); // 'preview' | 'sending' | 'sent'

  const issuesSummary = (record.issues || [])
    .map(i => `${i.label} (${i.priority})`)
    .join(', ') || 'None flagged';
  const stepSummary = `${record.stepStatus.filter(s => s.completed).length} of ${record.stepStatus.length} next steps completed in-session`;

  const send = () => {
    setStage('sending');
    setTimeout(() => {
      setStage('sent');
      setTimeout(() => onConfirm(), 900);
    }, 700);
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
      onClick={onCancel}
    >
      <div className="modal modal--email" onClick={e => e.stopPropagation()}>
        {stage === 'sent' ? (
          <div className="email-sent">
            <div className="email-sent__check" aria-hidden="true">✓</div>
            <h3>Sent to HR (demo mode)</h3>
            <p>
              In production, the record would be delivered to your configured HR contact
              via email or HRIS integration. The action has been logged in the audit trail.
            </p>
          </div>
        ) : (
          <>
            <h3 id="email-modal-title">Send compliance record to HR</h3>
            <p>
              Review the preview below and confirm. In production, this would be delivered via
              your configured HR integration (email, Workday, ServiceNow, etc.).
            </p>

            <div className="email-preview">
              <div className="email-preview__row">
                <label>To</label>
                <input
                  type="email"
                  value={toAddress}
                  onChange={e => setToAddress(e.target.value)}
                  disabled={stage === 'sending'}
                />
              </div>
              <div className="email-preview__row">
                <label>Subject</label>
                <div className="email-preview__readonly">
                  [Uplevyl · Confidential] Compliance Record {record.recordId}
                </div>
              </div>
              <div className="email-preview__row">
                <label>Note (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Add a note for HR..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  disabled={stage === 'sending'}
                />
              </div>

              <div className="email-preview__body">
                <div className="email-preview__summary-label">Record summary</div>
                <dl>
                  <dt>Record ID</dt><dd>{record.recordId}</dd>
                  <dt>Generated</dt><dd>{record.timestamp}</dd>
                  <dt>Deployment</dt><dd>{record.location}</dd>
                  <dt>Employee ID</dt><dd>{record.employeeId}</dd>
                  <dt>Jurisdiction</dt><dd>{record.jurisdiction}</dd>
                  <dt>Issues</dt><dd>{issuesSummary}</dd>
                  <dt>Next steps</dt><dd>{stepSummary}</dd>
                  {record.mandatoryReporting && (
                    <>
                      <dt style={{ color: 'var(--color-warning)' }}>Mandatory reporting</dt>
                      <dd style={{ color: 'var(--color-warning)' }}>Flagged</dd>
                    </>
                  )}
                </dl>
              </div>
            </div>

            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={onCancel}
                disabled={stage === 'sending'}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`btn btn--primary ${stage === 'sending' ? 'btn--loading' : ''}`}
                onClick={send}
                disabled={!toAddress.trim() || stage === 'sending'}
              >
                Send to HR →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function domainize(orgName) {
  return (orgName || 'company')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^(the|a|an)/, '')
    .slice(0, 24) || 'company';
}
