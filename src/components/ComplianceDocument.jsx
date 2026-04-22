import React from 'react';
import AuditTimeline from './AuditTimeline.jsx';
import { formatAuditTimestamp } from '../utils/auditEvents.js';

/**
 * On-screen preview of the full compliance record. This mirrors the
 * printable PDF one-to-one so the manager sees exactly what HR will
 * receive. Each section header carries its own timestamp, and the full
 * audit trail renders at the bottom.
 */
export default function ComplianceDocument({ record }) {
  if (!record) return null;
  const hasFollowups = record.followups && record.followups.length > 0;
  const issues = record.issues || [];
  const sources = record.sources || [];

  return (
    <article className="compliance-doc" aria-label="Compliance record preview">
      <header className="compliance-doc__header">
        <div className="compliance-doc__brand">
          <span className="compliance-doc__brand-mark" aria-hidden="true"></span>
          <div>
            <div className="compliance-doc__brand-name">Uplevyl</div>
            <div className="compliance-doc__brand-sub">Confidential Compliance Record</div>
          </div>
        </div>
        <div className="compliance-doc__record-id">
          Record ID
          <strong>{record.recordId}</strong>
        </div>
      </header>

      <h3 className="compliance-doc__title">Manager Compliance Record</h3>
      <div className="compliance-doc__generated">Generated {record.timestamp}</div>

      <dl className="compliance-doc__grid">
        <dt>Organization</dt><dd>{record.organization}</dd>
        <dt>Industry</dt><dd>{record.industry}</dd>
        <dt>Deployment</dt><dd>{record.location}</dd>
        <dt>Employee ID</dt><dd>{record.employeeId}</dd>
        <dt>Jurisdiction</dt><dd>{record.jurisdiction} workplace protection law</dd>
      </dl>

      {record.mandatoryReporting && (
        <div className="compliance-mandatory">
          ⚠️ Mandatory reporting flagged
          {record.mandatoryAtLabel ? ` · ${record.mandatoryAtLabel}` : ''}
        </div>
      )}

      {/* 1. Initial disclosure */}
      <section className="doc-section">
        <header className="doc-section__head">
          <div className="doc-section__num">1</div>
          <div className="doc-section__title">Initial Disclosure</div>
          <div className="doc-section__time">{record.submittedAtLabel}</div>
        </header>
        <blockquote className="doc-quote">{record.initialDisclosure}</blockquote>
      </section>

      {/* 2. Jurisdiction & Issues */}
      <section className="doc-section">
        <header className="doc-section__head">
          <div className="doc-section__num">2</div>
          <div className="doc-section__title">Jurisdiction &amp; Issues Identified</div>
          <div className="doc-section__time">{record.guidanceAtLabel}</div>
        </header>
        <div className="doc-para"><strong>Jurisdiction:</strong> {record.jurisdiction} workplace protection law</div>
        <div className="doc-subhead">Issues identified</div>
        {issues.length === 0 ? (
          <div className="doc-muted">No issues flagged.</div>
        ) : (
          <ul className="doc-list doc-list--issues">
            {issues.map((i, idx) => (
              <li key={idx}>
                <span className={`issue-pill issue-pill--${i.priority}`}>{priorityLabel(i.priority)}</span>
                <strong>{i.label}</strong>
                {i.summary && <> — {i.summary}</>}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 3. Guidance + sources */}
      <section className="doc-section">
        <header className="doc-section__head">
          <div className="doc-section__num">3</div>
          <div className="doc-section__title">Compliance Guidance</div>
          <div className="doc-section__time">{record.guidanceAtLabel}</div>
        </header>
        <div className="doc-guidance">{record.guidance}</div>
        {sources.length > 0 && (
          <>
            <div className="doc-subhead">Sources &amp; authorities</div>
            <ul className="doc-list">
              {sources.map((s, i) => (
                <li key={i}>
                  <strong>{s.title || 'Source'}</strong>
                  {s.source_url && <> — <a href={s.source_url} target="_blank" rel="noreferrer">{s.source_url}</a></>}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* 4. Next Steps */}
      <section className="doc-section">
        <header className="doc-section__head">
          <div className="doc-section__num">4</div>
          <div className="doc-section__title">Next Steps &amp; Completion Status</div>
        </header>
        {record.stepStatus.length === 0 ? (
          <div className="doc-muted">No next steps provided.</div>
        ) : (
          <ol className="doc-list doc-list--steps">
            {record.stepStatus.map((s, i) => (
              <li key={i} className={s.completed ? 'doc-step--done' : 'doc-step--pending'}>
                <span className="doc-step__box" aria-hidden="true">{s.completed ? '✓' : '☐'}</span>
                <div>
                  <div>{s.text}</div>
                  <div className="doc-step__meta">
                    {s.completed && s.completedAt
                      ? `Completed at ${formatAuditTimestamp(s.completedAt)}`
                      : s.completed ? 'Completed' : 'Not completed'}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {/* 5. Follow-ups (if any) */}
      {hasFollowups && (
        <section className="doc-section">
          <header className="doc-section__head">
            <div className="doc-section__num">5</div>
            <div className="doc-section__title">Follow-up Questions</div>
          </header>
          <div className="doc-qa">
            {record.followups.map((f, i) => (
              <div key={f.id} className="doc-qa__item">
                <div className="doc-qa__q">
                  <span className="doc-qa__ts">[{formatAuditTimestamp(f.askedAt)}]</span>
                  <strong>Q{i + 1}.</strong> {f.question}
                </div>
                <div className="doc-qa__a">
                  <span className="doc-qa__ts">[{formatAuditTimestamp(f.answeredAt)}]</span>
                  <strong>A{i + 1}.</strong> {f.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final: audit trail */}
      <section className="doc-section">
        <header className="doc-section__head">
          <div className="doc-section__num">{hasFollowups ? '6' : '5'}</div>
          <div className="doc-section__title">Full Audit Trail</div>
        </header>
        <AuditTimeline
          events={record.events || []}
          session={{ id: record.sessionId, startTime: record.sessionStartedAt }}
          provisioning={null}
          employeeId={record.employeeId}
          collapsible={false}
        />
      </section>

      <footer className="compliance-doc__footer">
        <strong>Confidentiality notice</strong>
        This document contains confidential compliance guidance generated by the Uplevyl GBV Response API.
        Attorney-supervised · No PII collected · All interactions anonymously logged.
      </footer>
    </article>
  );
}

function priorityLabel(p) {
  switch (p) {
    case 'urgent': return 'Urgent';
    case 'resolved': return 'Informational';
    default: return 'Action needed';
  }
}
