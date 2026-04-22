import React, { useState } from 'react';
import Icon from './icons/Icon.jsx';
import { EVENT_META, formatAuditTimestamp } from '../utils/auditEvents.js';
import { STATE_ABBR } from '../data/verticals.js';

/**
 * AuditTimeline — rich, timestamped timeline of every session event.
 *
 * Renders a vertical line with a per-event icon, precise timestamp, and
 * description. Each icon color is driven by the event's tone (neutral,
 * accent, info, warning, success).
 *
 * The same event list also feeds the printed compliance record so the
 * in-app view and the document are guaranteed to match.
 */
export default function AuditTimeline({
  events = [],
  session,
  provisioning,
  employeeId,
  collapsible = true,
  defaultOpen = false
}) {
  const [open, setOpen] = useState(defaultOpen);

  const header = (
    <header className="audit-header">
      <h3 className="audit-header__title">Session audit trail</h3>
      <div className="audit-header__meta">
        <span>Session ID: <strong>{session?.id || '—'}</strong></span>
        <span>·</span>
        <span>
          Employee ID: <strong>{employeeId && employeeId.trim() ? employeeId : 'Not provided'}</strong>
        </span>
        {provisioning && (
          <>
            <span>·</span>
            <span>
              {provisioning.orgName}{provisioning.locationId ? ' · ' + provisioning.locationId : ''} ·
              {' '}{STATE_ABBR[provisioning.state] || provisioning.state}
            </span>
          </>
        )}
      </div>
    </header>
  );

  const body = events.length === 0 ? (
    <div className="audit-empty">No events yet.</div>
  ) : (
    <ol className="timeline" aria-label="Session timeline">
      {events.map((ev, i) => {
        const meta = EVENT_META[ev.type] || { icon: 'clock', tone: 'neutral', label: ev.type };
        return (
          <li key={i} className={`timeline-item timeline-item--${meta.tone}`}>
            <div className={`timeline-item__icon timeline-item__icon--${meta.tone}`} aria-hidden="true">
              <Icon type={meta.icon} size={16} />
            </div>
            <div className="timeline-item__body">
              <div className="timeline-item__time">{formatAuditTimestamp(ev.timestamp)}</div>
              <div className="timeline-item__desc">{ev.description}</div>
            </div>
          </li>
        );
      })}
    </ol>
  );

  if (!collapsible) {
    return (
      <div className="audit">
        {header}
        {body}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        className="audit-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>📋 View full audit trail ({events.length} event{events.length === 1 ? '' : 's'})</span>
        <span aria-hidden="true">{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="audit">
          {header}
          {body}
        </div>
      )}
    </div>
  );
}
