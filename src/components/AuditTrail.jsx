import React, { useState } from 'react';
import { formatTimestamp } from '../utils/documentGenerator.js';
import { STATE_ABBR } from '../data/verticals.js';

export default function AuditTrail({ session, provisioning }) {
  const [expanded, setExpanded] = useState(false);
  const interactions = session.interactions.filter(i => i.response);
  if (interactions.length === 0) return null;

  return (
    <section className="phase-block">
      <button
        type="button"
        className="audit-toggle"
        onClick={() => setExpanded(e => !e)}
      >
        <span>📋 View Full Audit Trail</span>
        <span>{expanded ? '▴' : '▾'}</span>
      </button>
      {expanded && (
        <div className="audit">
          <header className="audit__header">
            <h3>📋 Session Audit Trail</h3>
            <div className="audit__meta">
              <div>{formatTimestamp(new Date(session.startTime))}</div>
              <div>{provisioning.orgName}{provisioning.locationId ? ' ' + provisioning.locationId : ''} · {STATE_ABBR[provisioning.state] || provisioning.state}</div>
              <div>Employee ID: {session.employeeId || 'Not provided'}</div>
              <div>Session ID: {session.id}</div>
            </div>
          </header>

          {interactions.map((it, i) => (
            <div key={it.id} className="audit__interaction">
              <div className="audit__label">Interaction {i + 1}</div>
              <div className="audit__query"><strong>Query:</strong> "{it.query.length > 160 ? it.query.slice(0, 160) + '…' : it.query}"</div>
              <div className="audit__line"><strong>Timestamp:</strong> {formatTimestamp(new Date(it.timestamp))}</div>
              <div className="audit__line"><strong>Mode:</strong> Manager Guidance</div>
              <div className="audit__subsection">
                <div><strong>Jurisdiction:</strong> {it.response.jurisdiction}</div>
                <div><strong>Mandatory Reporting:</strong> {it.response.mandatory_reporting ? 'Yes' : 'No'}</div>
              </div>
              {it.response.citations && it.response.citations.length > 0 && (
                <div className="audit__subsection">
                  <div><strong>Claims:</strong></div>
                  {it.response.citations.map((c, j) => (
                    <div key={j} className="audit__claim">
                      <div>▸ {c.description}</div>
                      <div className="audit__source">Source: {c.statute}</div>
                      <div className="audit__source">Confidence: High</div>
                    </div>
                  ))}
                </div>
              )}
              {it.response.sources && it.response.sources.length > 0 && (
                <div className="audit__subsection">
                  <div><strong>Sources Referenced:</strong></div>
                  {it.response.sources.map((s, j) => (
                    <div key={j}>▸ {s.title}</div>
                  ))}
                </div>
              )}
              <div className="audit__subsection audit__meta-line">
                <strong>API Metadata:</strong> Segments: {it.response.segments_found ?? '—'} | Latency: {(it.response.search_latency || 0).toFixed(1)}s
              </div>
            </div>
          ))}

          <div className="audit__actions">
            <button className="btn btn--ghost" onClick={() => window.print()}>
              📥 Export Audit Trail as PDF
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
