import React, { useState } from 'react';

const PRIORITY_META = {
  urgent: { dot: '🔴', className: 'thread--urgent' },
  open: { dot: '🔵', className: 'thread--open' },
  resolved: { dot: '✅', className: 'thread--resolved' }
};

export default function ThreadCards({ threads }) {
  const [expanded, setExpanded] = useState({});
  if (!threads || threads.length === 0) return null;
  return (
    <section className="phase-block">
      <h2 className="phase-rule">Issues Identified</h2>
      <div className="threads">
        {threads.map((t, i) => {
          const meta = PRIORITY_META[t.priority] || PRIORITY_META.open;
          const isExpanded = !!expanded[i];
          return (
            <div
              key={t.id}
              className={`thread ${meta.className}`}
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="thread__header">
                <span className="thread__dot">{meta.dot}</span>
                <span className="thread__label">{t.label}</span>
              </div>
              <div className="thread__summary">{t.summary}</div>
              <button
                type="button"
                className="thread__confidence"
                onClick={() => setExpanded(e => ({ ...e, [i]: !e[i] }))}
              >
                <span>✓ {t.confidence}</span>
                <span className="thread__caret">{isExpanded ? '▴' : '▾'}</span>
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
    </section>
  );
}
