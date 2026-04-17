import React from 'react';
import ComplianceDocument from '../ComplianceDocument.jsx';

export default function DocumentPage({
  record,
  onDownload,
  onCopy,
  onNewSituation,
  onSendToHr
}) {
  return (
    <div className="wizard__page" aria-labelledby="page-document-title">
      <div>
        <div className="wizard__section-head">
          <h2 id="page-document-title" className="wizard__section-title">Compliance record</h2>
        </div>
        <div className="compliance-intro">
          ✓ Your session is documented. Download the record as a PDF or copy it to your clipboard.
        </div>
        <ComplianceDocument
          record={record}
          onDownload={onDownload}
          onCopy={onCopy}
          onSendToHr={onSendToHr}
        />
      </div>

      <div className="session-complete">
        <div className="session-complete__done">✅ All issues addressed.</div>
        <div className="session-complete__actions">
          <button className="btn btn--primary" onClick={onDownload}>📥 Download PDF</button>
          <button className="btn btn--ghost" onClick={onCopy}>📋 Copy Record</button>
          <button className="btn btn--ghost" onClick={onSendToHr}>📧 Send to HR</button>
          <button className="btn btn--ghost" onClick={onNewSituation}>← Start New Situation</button>
        </div>
      </div>
    </div>
  );
}
