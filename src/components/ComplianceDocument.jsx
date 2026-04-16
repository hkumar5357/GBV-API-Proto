import React, { useState } from 'react';
import { formatComplianceRecordText } from '../utils/documentGenerator.js';

export default function ComplianceDocument({ record }) {
  const [copied, setCopied] = useState(false);
  if (!record) return null;

  const copyRecord = async () => {
    try {
      await navigator.clipboard.writeText(formatComplianceRecordText(record));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="phase-block">
      <h2 className="phase-rule">Compliance Record</h2>
      <div className="compliance-intro">✅ Your compliance documentation is ready.</div>
      <article className="compliance-doc">
        <header className="compliance-doc__header">
          <span className="compliance-doc__icon">📄</span>
          <span className="compliance-doc__title">Manager Compliance Record</span>
        </header>
        <dl className="compliance-doc__grid">
          <dt>Record ID</dt><dd>{record.recordId}</dd>
          <dt>Date</dt><dd>{record.timestamp}</dd>
          <dt>Location</dt><dd>{record.location}</dd>
          <dt>Employee ID</dt><dd>{record.employeeId}</dd>
          <dt>Jurisdiction</dt><dd>{record.jurisdiction}</dd>
        </dl>
        <div className="compliance-doc__section">
          <h4>Situation Summary</h4>
          <p>{record.situationSummary}</p>
        </div>
        <div className="compliance-doc__section">
          <h4>Actions Taken</h4>
          <ul>
            {record.actionsTaken.map((a, i) => <li key={i}>✓ {a}</li>)}
          </ul>
        </div>
        <div className="compliance-doc__section">
          <h4>Authority</h4>
          <p>{record.authority}</p>
        </div>
        <footer className="compliance-doc__footer">
          {record.footer.split('\n').map((l, i) => <div key={i}>{l}</div>)}
        </footer>
      </article>
      <div className="compliance-doc__actions">
        <button className="btn btn--primary" onClick={() => window.print()}>📥 Download PDF</button>
        <button className="btn btn--ghost" onClick={copyRecord}>
          {copied ? '✓ Copied' : '📋 Copy Record'}
        </button>
      </div>
    </section>
  );
}
