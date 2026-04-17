import React, { useState } from 'react';

const PRIORITY_META = {
  urgent: { label: 'Urgent', className: 'thread--urgent' },
  open: { label: 'Action needed', className: 'thread--open' },
  resolved: { label: 'Informational', className: 'thread--resolved' }
};

export default function ThreadCards({ threads }) {
  const [expanded, setExpanded] = useState({});
  if (!threads || threads.length === 0) return null;
  return (
    <div className="threads" aria-label="Issues identified">
      {threads.map((t, i) => {
        const meta = PRIORITY_META[t.priority] || PRIORITY_META.open;
        const isExpanded = !!expanded[i];
        return (
          <div
            key={t.id}
            className={`thread ${meta.className}`}
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="thread__header">
              <span className="thread__dot" aria-hidden="true"></span>
              <span className="thread__label">{t.label}</span>
              <span className="thread__severity-label" aria-label={`Severity: ${meta.label}`}>
                {meta.label}
              </span>
            </div>
            <div className="thread__summary">{t.summary}</div>
            <button
              type="button"
              className="thread__confidence"
              onClick={() => setExpanded(e => ({ ...e, [i]: !e[i] }))}
              aria-expanded={isExpanded}
            >
              <span>
                ✓ {t.confidence}
                <span className="thread__confidence-label"> · Details</span>
              </span>
              <span className="thread__caret" aria-hidden="true">{isExpanded ? '▴' : '▾'}</span>
            </button>
            {isExpanded && t.citation && (
              <div className="thread__citation">
                <div className="thread__citation-statute">{t.citation.statute}</div>
                <div className="thread__citation-desc">{t.citation.description}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
