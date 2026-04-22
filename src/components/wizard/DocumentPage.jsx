import React from 'react';
import ComplianceDocument from '../ComplianceDocument.jsx';

export default function DocumentPage({
  record,
  onDownload,
  onCopy,
  onSendToHr,
  onNewSituation
}) {
  return (
    <div className="wizard__page" aria-labelledby="page-document-title">
      <div>
        <div className="wizard__section-head">
          <h2 id="page-document-title" className="wizard__section-title">Compliance record</h2>
        </div>
        <div className="compliance-intro">
          ✓ Session documented. Download the record as a PDF, send it to HR,
          or copy the full text to your clipboard.
        </div>
        <ComplianceDocument record={record} />
      </div>

      <div className="compliance-actions">
        <button className="btn btn--primary" onClick={onDownload}>
          📥 Download PDF
        </button>
        <button className="btn btn--ghost" onClick={onSendToHr}>
          📧 Email to HR
        </button>
        <button className="btn btn--ghost" onClick={onCopy}>
          📋 Copy Record
        </button>
        <button className="btn btn--ghost" onClick={onNewSituation}>
          ← Start New Situation
        </button>
      </div>
    </div>
  );
}
