/**
 * Audit event model. Every significant action in a session becomes an entry
 * in the timeline. The in-app audit trail and the exported compliance
 * document render from the same event list.
 */

export const EVENT_TYPES = {
  SESSION_STARTED: 'session_started',
  CONTEXT_SET: 'context_set',
  SCENARIO_SUBMITTED: 'scenario_submitted',
  GUIDANCE_GENERATED: 'guidance_generated',
  ISSUES_IDENTIFIED: 'issues_identified',
  MANDATORY_TRIGGERED: 'mandatory_triggered',
  STEP_COMPLETED: 'step_completed',
  FOLLOWUP_ASKED: 'followup_asked',
  DOCUMENT_GENERATED: 'document_generated',
  DOCUMENT_EXPORTED: 'document_exported',
  DOCUMENT_EMAILED: 'document_emailed'
};

export const EVENT_META = {
  [EVENT_TYPES.SESSION_STARTED]:     { icon: 'clock',      tone: 'neutral', label: 'Session started' },
  [EVENT_TYPES.CONTEXT_SET]:         { icon: 'mapPin',     tone: 'neutral', label: 'Deployment context set' },
  [EVENT_TYPES.SCENARIO_SUBMITTED]:  { icon: 'chat',       tone: 'accent',  label: 'Scenario submitted' },
  [EVENT_TYPES.GUIDANCE_GENERATED]:  { icon: 'shield',     tone: 'accent',  label: 'Guidance generated' },
  [EVENT_TYPES.ISSUES_IDENTIFIED]:   { icon: 'alert',      tone: 'info',    label: 'Issues identified' },
  [EVENT_TYPES.MANDATORY_TRIGGERED]: { icon: 'warning',    tone: 'warning', label: 'Mandatory reporting flagged' },
  [EVENT_TYPES.STEP_COMPLETED]:      { icon: 'checkCircle', tone: 'success', label: 'Next step completed' },
  [EVENT_TYPES.FOLLOWUP_ASKED]:      { icon: 'search',     tone: 'neutral', label: 'Follow-up asked' },
  [EVENT_TYPES.DOCUMENT_GENERATED]:  { icon: 'document',   tone: 'accent',  label: 'Compliance record generated' },
  [EVENT_TYPES.DOCUMENT_EXPORTED]:   { icon: 'download',   tone: 'success', label: 'Record exported as PDF' },
  [EVENT_TYPES.DOCUMENT_EMAILED]:    { icon: 'envelope',   tone: 'success', label: 'Record sent to HR' }
};

export function createEvent(type, description, metadata = {}) {
  return {
    type,
    timestamp: new Date().toISOString(),
    description,
    metadata
  };
}

/**
 * Format a timestamp in the style required by the compliance doc:
 *   Apr 22, 2026 at 2:45:32 PM ET
 */
export function formatAuditTimestamp(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    // Manually assemble to guarantee the requested format across browsers.
    const date = d.toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    });
    const time = d.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
    });
    // Try to get a short timezone label (falls back gracefully).
    const tzShort = (() => {
      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZoneName: 'short', hour: '2-digit'
        }).formatToParts(d);
        const tz = parts.find(p => p.type === 'timeZoneName');
        return tz ? tz.value : '';
      } catch {
        return '';
      }
    })();
    return `${date} at ${time}${tzShort ? ' ' + tzShort : ''}`;
  } catch {
    return '';
  }
}

export function formatAuditDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    });
  } catch {
    return '';
  }
}
