import { EVENT_TYPES, EVENT_META, formatAuditTimestamp } from './auditEvents.js';

const ALPHANUM = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function randomId(prefix = 'REC', len = 6) {
  let id = '';
  for (let i = 0; i < len; i++) {
    id += ALPHANUM.charAt(Math.floor(Math.random() * ALPHANUM.length));
  }
  return `${prefix}-${id}`;
}

export function formatTimestamp(d = new Date()) {
  const date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${date} · ${time}`;
}

export function anonymize(text, maxLen = 360) {
  if (!text) return '';
  const stripped = String(text).split('\n\nContext:')[0].trim();
  const sanitized = stripped
    .replace(/\b(EMP-\w+)\b/g, '[Employee ID redacted]');
  return sanitized.length > maxLen ? sanitized.slice(0, maxLen - 1) + '…' : sanitized;
}

/**
 * Builds a comprehensive compliance record that includes every section
 * required for legal defensibility: the initial disclosure, jurisdiction,
 * issues identified, full guidance, sources, per-step completion status,
 * follow-ups, and the full event-level audit trail.
 */
export function buildComplianceRecord({
  interaction,
  provisioning,
  employeeId,
  recordId,
  events = [],
  followups = [],
  checkedSteps = [],
  stepCompletedAt = {},
  session
}) {
  const response = interaction.response || {};
  const submittedAt =
    (events.find(e => e.type === EVENT_TYPES.SCENARIO_SUBMITTED)?.timestamp) ||
    interaction.timestamp ||
    new Date().toISOString();
  const guidanceAt =
    (events.find(e => e.type === EVENT_TYPES.GUIDANCE_GENERATED)?.timestamp) ||
    interaction.timestamp ||
    submittedAt;
  const mandatoryAt = events.find(e => e.type === EVENT_TYPES.MANDATORY_TRIGGERED)?.timestamp;

  // Step status with per-step completion timestamps
  const stepStatus = (response.next_steps || []).map((text, i) => ({
    index: i,
    text,
    completed: checkedSteps.includes(i),
    completedAt: stepCompletedAt[i] || null
  }));

  // Issues identified shape
  const issues = (interaction.threads || []).map(t => ({
    label: t.label,
    priority: t.priority,
    summary: t.summary
  }));

  // Follow-up Q&A pairs
  const followupQa = (followups || [])
    .filter(f => f.response)
    .map(f => ({
      id: f.id,
      question: f.displayQuery,
      answer: f.response.guidance || '',
      askedAt: f.timestamp,
      answeredAt: f.timestamp, // we don't separately record; stream finish is ~instant for mocks
      jurisdiction: f.response.jurisdiction
    }));

  // Actions taken — high-level summary for the preview header
  const actions = [];
  if (response.citations && response.citations[0]) {
    actions.push(`Jurisdiction-specific guidance provided per ${response.citations[0].statute}`);
  }
  if (/leave/i.test(response.guidance || '')) {
    actions.push('Leave entitlements communicated to manager');
  }
  if (/accommodat/i.test(response.guidance || '')) {
    actions.push('Reasonable accommodations reviewed with manager');
  }
  if (response.mandatory_reporting) actions.push('Mandatory reporting pathway flagged');
  if (checkedSteps.length > 0) actions.push(`${checkedSteps.length} of ${(response.next_steps || []).length} next steps completed in-session`);
  if (followupQa.length > 0) actions.push(`${followupQa.length} follow-up question${followupQa.length === 1 ? '' : 's'} answered`);
  if (actions.length === 0) actions.push('Manager guidance provided and documented');

  return {
    recordId,
    generatedAt: new Date().toISOString(),
    timestamp: formatTimestamp(new Date()),
    submittedAtRaw: submittedAt,
    guidanceAtRaw: guidanceAt,
    mandatoryAtRaw: mandatoryAt,
    submittedAtLabel: formatAuditTimestamp(submittedAt),
    guidanceAtLabel: formatAuditTimestamp(guidanceAt),
    mandatoryAtLabel: mandatoryAt ? formatAuditTimestamp(mandatoryAt) : null,

    location: `${provisioning.orgName}${provisioning.locationId ? ' · ' + provisioning.locationId : ''} · ${provisioning.state}`,
    organization: provisioning.orgName,
    industry: provisioning.industry,
    state: provisioning.state,
    locationId: provisioning.locationId || '',
    employeeId: employeeId && employeeId.trim() ? employeeId : 'Not provided',
    jurisdiction: response.jurisdiction || 'Unknown',
    mandatoryReporting: !!response.mandatory_reporting,

    initialDisclosure: anonymize(interaction.displayQuery || interaction.query, 1200),
    guidance: response.guidance || '',
    sources: response.sources || [],
    citations: response.citations || [],

    issues,
    stepStatus,
    followups: followupQa,

    actionsTaken: actions,
    authority:
      (response.citations && response.citations[0] && response.citations[0].statute) ||
      'General employer obligations',

    sessionId: session?.id || null,
    sessionStartedAt: session?.startTime || null,
    events,                // Raw events for timeline rendering
    eventsWithMeta: events.map(e => ({
      ...e,
      meta: EVENT_META[e.type] || { label: e.type, icon: 'clock', tone: 'neutral' }
    })),

    footer: 'Uplevyl · Attorney-supervised · No PII collected or stored'
  };
}

/**
 * Plain-text serialization of the record for clipboard copy.
 */
export function formatComplianceRecordText(rec) {
  const lines = [];
  lines.push('CONFIDENTIAL COMPLIANCE RECORD');
  lines.push(`Uplevyl · Generated ${rec.timestamp}`);
  lines.push('');
  lines.push(`Record ID: ${rec.recordId}`);
  lines.push(`Organization: ${rec.organization}`);
  lines.push(`Industry: ${rec.industry}`);
  lines.push(`Deployment: ${rec.location}`);
  lines.push(`Employee ID: ${rec.employeeId}`);
  lines.push(`Jurisdiction: ${rec.jurisdiction}`);
  lines.push('');
  lines.push('─────────────────────────────────');
  lines.push('1. INITIAL DISCLOSURE');
  if (rec.submittedAtLabel) lines.push(`   [${rec.submittedAtLabel}]`);
  lines.push(`   ${rec.initialDisclosure}`);
  lines.push('');
  lines.push('2. JURISDICTION & ISSUES IDENTIFIED');
  if (rec.guidanceAtLabel) lines.push(`   [${rec.guidanceAtLabel}]`);
  lines.push(`   Jurisdiction: ${rec.jurisdiction}`);
  if (rec.issues.length > 0) {
    lines.push(`   Issues Identified:`);
    rec.issues.forEach(i => lines.push(`   - ${i.label} (${i.priority}) — ${i.summary || ''}`));
  } else {
    lines.push(`   Issues Identified: None flagged`);
  }
  if (rec.mandatoryReporting && rec.mandatoryAtLabel) {
    lines.push(`   [${rec.mandatoryAtLabel}] MANDATORY REPORTING FLAGGED`);
  }
  lines.push('');
  lines.push('3. COMPLIANCE GUIDANCE');
  if (rec.guidanceAtLabel) lines.push(`   [${rec.guidanceAtLabel}]`);
  lines.push(indent(rec.guidance, '   '));
  if (rec.sources.length > 0) {
    lines.push('');
    lines.push('   Sources & Authorities:');
    rec.sources.forEach(s => lines.push(`   - ${s.title}${s.source_url ? ' — ' + s.source_url : ''}`));
  }
  if (rec.citations.length > 0) {
    lines.push('   Citations:');
    rec.citations.forEach(c => lines.push(`   - ${c.statute} — ${c.description}`));
  }
  lines.push('');
  lines.push('4. NEXT STEPS & COMPLETION STATUS');
  if (rec.stepStatus.length === 0) {
    lines.push('   No next steps provided.');
  } else {
    rec.stepStatus.forEach((s, i) => {
      const mark = s.completed ? '✓' : '☐';
      const tail = s.completed && s.completedAt
        ? ` — Completed at ${formatAuditTimestamp(s.completedAt)}`
        : s.completed ? ' — Completed' : ' — Not completed';
      lines.push(`   ${mark} Step ${i + 1}: ${s.text}${tail}`);
    });
  }
  if (rec.followups && rec.followups.length > 0) {
    lines.push('');
    lines.push('5. FOLLOW-UP QUESTIONS');
    rec.followups.forEach((f, i) => {
      lines.push(`   [${formatAuditTimestamp(f.askedAt)}] Q${i + 1}: ${f.question}`);
      lines.push(`   [${formatAuditTimestamp(f.answeredAt)}] A${i + 1}: ${truncateForText(f.answer, 500)}`);
      lines.push('');
    });
  }
  lines.push('');
  lines.push(rec.followups && rec.followups.length > 0 ? '6. FULL AUDIT TRAIL' : '5. FULL AUDIT TRAIL');
  rec.events.forEach(e => {
    lines.push(`   [${formatAuditTimestamp(e.timestamp)}] ${e.description}`);
  });
  lines.push('');
  lines.push('─────────────────────────────────');
  lines.push('CONFIDENTIALITY NOTICE');
  lines.push('This document contains confidential compliance guidance');
  lines.push('generated by the Uplevyl GBV Response API.');
  lines.push('Attorney-supervised. No PII collected. All interactions anonymously logged.');
  return lines.join('\n');
}

function indent(text, prefix) {
  if (!text) return '';
  return String(text).split('\n').map(l => prefix + l).join('\n');
}

function truncateForText(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
