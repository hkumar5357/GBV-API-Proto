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
  // Drop anything after "Context:" added by the composer
  const stripped = text.split('\n\nContext:')[0].trim();
  // Replace common PII-ish tokens (naive but good enough for a prototype)
  const sanitized = stripped
    .replace(/\b(EMP-\w+)\b/g, '[Employee ID redacted]')
    .replace(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g, '[name redacted]');
  return sanitized.length > maxLen ? sanitized.slice(0, maxLen - 1) + '…' : sanitized;
}

export function buildComplianceRecord({ interaction, provisioning, employeeId, recordId }) {
  const response = interaction.response || {};
  const actions = [];
  if (response.citations && response.citations[0]) {
    actions.push(`Guidance provided per ${response.citations[0].statute}`);
  }
  if (/leave/i.test(response.guidance || '')) {
    actions.push('Leave entitlements communicated');
  }
  if (/accommodat/i.test(response.guidance || '')) {
    actions.push('Reasonable accommodations reviewed with manager');
  }
  if (response.mandatory_reporting) {
    actions.push('Mandatory reporting pathway flagged');
  }
  if (actions.length === 0) {
    actions.push('Manager guidance provided and documented');
  }

  return {
    recordId,
    timestamp: formatTimestamp(new Date(interaction.timestamp || Date.now())),
    location: `${provisioning.orgName}${provisioning.locationId ? ' ' + provisioning.locationId : ''} · ${provisioning.state}`,
    employeeId: employeeId || 'Not provided',
    jurisdiction: response.jurisdiction || 'Unknown',
    situationSummary: anonymize(interaction.query),
    actionsTaken: actions,
    authority: (response.citations && response.citations[0] && response.citations[0].statute) || 'General employer obligations',
    footer: 'Uplevyl · Attorney-supervised\nNo PII collected or stored'
  };
}

export function formatComplianceRecordText(rec) {
  return [
    'MANAGER COMPLIANCE RECORD',
    '',
    `Record ID: ${rec.recordId}`,
    `Date: ${rec.timestamp}`,
    `Location: ${rec.location}`,
    `Employee ID: ${rec.employeeId}`,
    `Jurisdiction: ${rec.jurisdiction}`,
    '',
    'Situation Summary:',
    rec.situationSummary,
    '',
    'Actions Taken:',
    ...rec.actionsTaken.map(a => `  ✓ ${a}`),
    '',
    `Authority: ${rec.authority}`,
    '─────────────────────────────',
    rec.footer
  ].join('\n');
}
