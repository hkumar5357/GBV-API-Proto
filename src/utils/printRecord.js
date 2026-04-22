import { formatAuditTimestamp } from './auditEvents.js';

/**
 * Renders a comprehensive compliance record as a structured, printable
 * HTML document in a new window, then triggers print. Users "Save as PDF"
 * from the browser print dialog.
 *
 * The document mirrors the in-app audit trail so the two are guaranteed
 * to match — every significant action appears with its precise timestamp
 * woven into the relevant section, plus a full event timeline at the end.
 */
export function openPrintableRecord(record) {
  const win = window.open('', '_blank', 'width=900,height=1100');
  if (!win) {
    window.print();
    return;
  }
  const html = buildRecordHtml(record);
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 350);
  };
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(s) {
  return esc(s).replace(/\n/g, '<br/>');
}

const ICON_PATHS = {
  clock: '<circle cx="10" cy="10" r="7.5"/><path d="M10 5.5V10l3 2"/>',
  mapPin: '<path d="M10 18s5.5-5.5 5.5-9.5a5.5 5.5 0 10-11 0C4.5 12.5 10 18 10 18z"/><circle cx="10" cy="8.5" r="2"/>',
  chat: '<path d="M16.5 10.5a6 6 0 01-6 6c-.9 0-1.8-.2-2.6-.6L4 17l1.1-3.9A6 6 0 1116.5 10.5z"/>',
  shield: '<path d="M10 2.5l6 2v5c0 3.6-2.4 6.8-6 8-3.6-1.2-6-4.4-6-8v-5l6-2z"/>',
  alert: '<circle cx="10" cy="10" r="7.5"/><path d="M10 6v4.5M10 13v.5"/>',
  warning: '<path d="M10 3l7.5 13h-15L10 3z"/><path d="M10 8.5V12M10 14v.5"/>',
  checkCircle: '<circle cx="10" cy="10" r="7.5"/><path d="M6.5 10.5l2.5 2.5L14 8"/>',
  search: '<circle cx="9" cy="9" r="5.5"/><path d="M13 13l3.5 3.5"/>',
  document: '<path d="M5.5 3h6l3.5 3.5V17H5.5V3z"/><path d="M11.5 3v3.5H15"/><path d="M7.5 10h5M7.5 13h5"/>',
  download: '<path d="M10 3v10"/><path d="M5.5 9l4.5 4.5L14.5 9"/><path d="M4 16.5h12"/>',
  envelope: '<rect x="3" y="5" width="14" height="10" rx="1.5"/><path d="M3.5 6l6.5 5 6.5-5"/>'
};

function iconSvg(type, color) {
  const paths = ICON_PATHS[type] || ICON_PATHS.clock;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
}

function toneColor(tone) {
  switch (tone) {
    case 'accent': return '#c45520';
    case 'info': return '#2563eb';
    case 'warning': return '#b45309';
    case 'success': return '#15803d';
    default: return '#6c6a65';
  }
}

function buildRecordHtml(record) {
  const hasFollowups = record.followups && record.followups.length > 0;
  const mandatoryBadge = record.mandatoryReporting
    ? `<div class="mandatory-badge"><span>⚠</span><span>Mandatory reporting flagged${record.mandatoryAtLabel ? ` · ${esc(record.mandatoryAtLabel)}` : ''}</span></div>`
    : '';

  const issuesHtml = record.issues && record.issues.length > 0
    ? `<ul class="issues-list">${record.issues.map(i =>
        `<li><span class="issue-pill issue-pill--${esc(i.priority)}">${esc(priorityLabel(i.priority))}</span> <strong>${esc(i.label)}</strong> — ${esc(i.summary || '')}</li>`
      ).join('')}</ul>`
    : `<p class="muted">No issues flagged.</p>`;

  const sourcesHtml = record.sources && record.sources.length > 0
    ? `<ul class="clean-list">${record.sources.map(s =>
        `<li><strong>${esc(s.title || 'Source')}</strong>${s.source_url ? ` — <span class="url">${esc(s.source_url)}</span>` : ''}</li>`
      ).join('')}</ul>`
    : '';

  const citationsHtml = record.citations && record.citations.length > 0
    ? `<ul class="clean-list">${record.citations.map(c =>
        `<li><strong>${esc(c.statute)}</strong> — ${esc(c.description || '')}</li>`
      ).join('')}</ul>`
    : '';

  const stepsHtml = record.stepStatus && record.stepStatus.length > 0
    ? `<ol class="steps-list">${record.stepStatus.map(s => `
        <li class="${s.completed ? 'step--done' : 'step--pending'}">
          <span class="step-box">${s.completed ? '✓' : '☐'}</span>
          <div>
            <div>${esc(s.text)}</div>
            <div class="step-meta">${
              s.completed
                ? (s.completedAt
                    ? 'Completed at ' + esc(formatAuditTimestamp(s.completedAt))
                    : 'Completed')
                : 'Not completed'
            }</div>
          </div>
        </li>
      `).join('')}</ol>`
    : '<p class="muted">No next steps provided.</p>';

  const followupsHtml = hasFollowups
    ? `<div class="qa-list">${record.followups.map((f, i) => `
        <div class="qa-item">
          <div class="qa-q">
            <span class="qa-ts">[${esc(formatAuditTimestamp(f.askedAt))}]</span>
            <strong>Q${i + 1}.</strong> ${esc(f.question)}
          </div>
          <div class="qa-a">
            <span class="qa-ts">[${esc(formatAuditTimestamp(f.answeredAt))}]</span>
            <strong>A${i + 1}.</strong> ${nl2br(f.answer)}
          </div>
        </div>
      `).join('')}</div>`
    : '';

  const timelineHtml = (record.eventsWithMeta || []).map(ev => `
    <li class="tl-item">
      <span class="tl-icon" style="color:${toneColor(ev.meta.tone)}">${iconSvg(ev.meta.icon, toneColor(ev.meta.tone))}</span>
      <div class="tl-body">
        <div class="tl-time">${esc(formatAuditTimestamp(ev.timestamp))}</div>
        <div class="tl-desc">${esc(ev.description)}</div>
      </div>
    </li>
  `).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Uplevyl · Compliance Record ${esc(record.recordId)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --orange: #c45520;
    --orange-light: #e8692a;
    --ink: #17140f;
    --muted: #6c6a65;
    --line: #d9d4cc;
    --line-light: #ebe7df;
    --paper: #ffffff;
    --bg: #f1eee8;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); }
  body {
    font-family: "DM Sans", -apple-system, sans-serif;
    color: var(--ink);
    font-size: 13.5px;
    line-height: 1.65;
    padding: 32px 24px 48px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    max-width: 800px;
    margin: 0 auto;
    background: var(--paper);
    border: 1px solid var(--line);
    padding: 56px 64px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  /* Letterhead */
  .letterhead {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 20px;
    border-bottom: 3px solid var(--orange);
    margin-bottom: 32px;
  }
  .brand { display: flex; align-items: center; gap: 14px; }
  .brand__mark {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--orange-light), var(--orange));
  }
  .brand__name {
    font-family: "Sora", sans-serif;
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .brand__sub {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--muted);
    margin-top: 2px;
    font-weight: 600;
  }
  .record-id {
    text-align: right;
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .record-id strong {
    display: block;
    font-family: "DM Sans", monospace;
    font-weight: 700;
    color: var(--ink);
    font-size: 16px;
    margin-top: 4px;
    letter-spacing: 0;
    text-transform: none;
  }
  h1.doctitle {
    font-family: "Sora", sans-serif;
    font-size: 22px;
    letter-spacing: -0.02em;
    margin: 0 0 6px 0;
    font-weight: 700;
  }
  .doc-generated {
    font-size: 12px;
    color: var(--muted);
    margin-bottom: 24px;
  }

  /* Metadata grid */
  .meta-grid {
    display: grid;
    grid-template-columns: 140px 1fr 140px 1fr;
    gap: 10px 20px;
    margin-bottom: 20px;
    padding: 18px 0;
    border-top: 1px solid var(--line-light);
    border-bottom: 1px solid var(--line-light);
  }
  .meta-grid dt {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted);
  }
  .meta-grid dd {
    margin: 0;
    font-weight: 500;
    font-size: 13.5px;
  }

  .mandatory-badge {
    margin: 20px 0;
    padding: 12px 16px;
    background: #fff8ec;
    border: 1px solid #f6d89e;
    border-left: 3px solid #d9891e;
    border-radius: 6px;
    font-size: 13px;
    color: #7a4a07;
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
  }
  .mandatory-badge span:first-child { font-size: 16px; }

  /* Numbered section heading */
  .section {
    margin: 32px 0;
    page-break-inside: avoid;
  }
  .section__head {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 10px;
    padding-bottom: 6px;
    border-bottom: 2px solid var(--orange);
  }
  .section__num {
    font-family: "Sora", sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--orange);
    letter-spacing: -0.02em;
    flex-shrink: 0;
    min-width: 28px;
  }
  .section__title {
    font-family: "Sora", sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    flex: 1;
  }
  .section__time {
    font-size: 11px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
  }

  .muted { color: var(--muted); font-size: 13px; }
  .quote-block {
    background: #faf7f1;
    border-left: 3px solid var(--orange);
    padding: 14px 18px;
    font-style: italic;
    font-size: 14px;
    line-height: 1.7;
    color: #2a2620;
  }

  /* Issues */
  .issues-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .issues-list li {
    padding: 10px 0;
    border-bottom: 1px solid var(--line-light);
    font-size: 13.5px;
  }
  .issues-list li:last-child { border-bottom: none; }
  .issue-pill {
    display: inline-block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 2px 8px;
    border-radius: 4px;
    margin-right: 8px;
  }
  .issue-pill--urgent { background: #fde2e2; color: #9a1e1e; }
  .issue-pill--open { background: #e4effe; color: #1e4b9a; }
  .issue-pill--resolved { background: #e3f7ea; color: #1a6a38; }

  /* Guidance body */
  .guidance-body {
    background: #fbfaf7;
    border: 1px solid var(--line-light);
    border-radius: 6px;
    padding: 16px 20px;
    font-size: 13.5px;
    line-height: 1.75;
    white-space: pre-wrap;
  }
  .subhead {
    font-family: "Sora", sans-serif;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin: 20px 0 8px;
    font-weight: 600;
  }
  .clean-list { list-style: none; padding: 0; margin: 0; font-size: 13px; }
  .clean-list li { padding: 5px 0; border-bottom: 1px solid var(--line-light); }
  .clean-list li:last-child { border-bottom: none; }
  .url { color: var(--orange); font-size: 11.5px; font-family: "DM Sans", monospace; }

  /* Steps */
  .steps-list { list-style: none; padding: 0; margin: 0; }
  .steps-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--line-light);
    font-size: 13.5px;
  }
  .steps-list li:last-child { border-bottom: none; }
  .step-box {
    font-weight: 700;
    color: var(--orange);
    flex-shrink: 0;
    width: 20px;
  }
  .step-meta {
    font-size: 11px;
    color: var(--muted);
    margin-top: 2px;
  }
  .step--done { color: #444; }

  /* Q&A */
  .qa-list { display: flex; flex-direction: column; gap: 16px; }
  .qa-item {
    padding: 14px 16px;
    border: 1px solid var(--line-light);
    border-radius: 6px;
    background: #fbfaf7;
  }
  .qa-q, .qa-a { font-size: 13px; line-height: 1.65; }
  .qa-q { margin-bottom: 8px; }
  .qa-a { color: #2a2620; }
  .qa-ts { font-size: 11px; color: var(--muted); margin-right: 6px; font-variant-numeric: tabular-nums; }

  /* Timeline */
  .timeline {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
  }
  .tl-item {
    display: flex;
    gap: 14px;
    padding: 10px 0;
    border-left: 1px solid var(--line);
    margin-left: 10px;
    padding-left: 18px;
    position: relative;
  }
  .tl-item::before {
    content: '';
    position: absolute;
    left: -6px; top: 16px;
    width: 11px; height: 11px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--orange);
  }
  .tl-icon {
    margin-top: -1px;
    margin-left: -6px;
    background: #fff;
    padding: 1px;
    border-radius: 4px;
  }
  .tl-body { flex: 1; }
  .tl-time {
    font-size: 11px;
    color: var(--muted);
    font-variant-numeric: tabular-nums;
    margin-bottom: 2px;
  }
  .tl-desc { font-size: 13px; }

  /* Signature */
  .signature {
    margin-top: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .signature__field {
    padding-top: 24px;
    border-top: 1px solid var(--ink);
    font-size: 11px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* Footer */
  .confidentiality {
    margin-top: 40px;
    padding: 16px 20px;
    background: #faf7f1;
    border: 1px solid var(--line);
    border-radius: 6px;
    font-size: 11.5px;
    color: var(--muted);
    line-height: 1.7;
    text-align: center;
  }
  .confidentiality strong {
    color: var(--ink);
    display: block;
    font-size: 12px;
    font-family: "Sora", sans-serif;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  /* Print toolbar (hidden on print) */
  .print-toolbar {
    position: fixed;
    top: 16px; right: 16px;
    display: flex;
    gap: 8px;
    z-index: 100;
  }
  .print-toolbar button {
    font-family: "DM Sans", sans-serif;
    font-size: 13px;
    padding: 10px 16px;
    border-radius: 8px;
    background: var(--ink);
    color: #fff;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }
  .print-toolbar button.secondary {
    background: #fff;
    color: var(--ink);
    border: 1px solid var(--line);
  }
  @media print {
    body { background: #fff; padding: 0; }
    .page {
      border: none; box-shadow: none; padding: 24px 40px;
      margin: 0; max-width: none;
    }
    .print-toolbar { display: none; }
    @page { margin: 0.5in; size: letter; }
    .section { page-break-inside: avoid; }
    .tl-item { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="print-toolbar">
    <button class="secondary" onclick="window.close()">Close</button>
    <button onclick="window.print()">Save as PDF</button>
  </div>

  <div class="page">
    <header class="letterhead">
      <div class="brand">
        <div class="brand__mark"></div>
        <div>
          <div class="brand__name">Uplevyl</div>
          <div class="brand__sub">Confidential Compliance Record</div>
        </div>
      </div>
      <div class="record-id">
        Record ID
        <strong>${esc(record.recordId)}</strong>
      </div>
    </header>

    <h1 class="doctitle">Manager Compliance Record</h1>
    <div class="doc-generated">Generated ${esc(record.timestamp)}</div>

    <dl class="meta-grid">
      <dt>Organization</dt><dd>${esc(record.organization)}</dd>
      <dt>Industry</dt><dd>${esc(record.industry)}</dd>
      <dt>Deployment</dt><dd>${esc(record.location)}</dd>
      <dt>Employee ID</dt><dd>${esc(record.employeeId)}</dd>
      <dt>Jurisdiction</dt><dd colspan="3">${esc(record.jurisdiction)} workplace protection law</dd>
    </dl>

    ${mandatoryBadge}

    <!-- 1. INITIAL DISCLOSURE -->
    <section class="section">
      <div class="section__head">
        <div class="section__num">1</div>
        <div class="section__title">Initial Disclosure</div>
        <div class="section__time">${esc(record.submittedAtLabel || '')}</div>
      </div>
      <div class="quote-block">${nl2br(record.initialDisclosure)}</div>
    </section>

    <!-- 2. JURISDICTION & ISSUES IDENTIFIED -->
    <section class="section">
      <div class="section__head">
        <div class="section__num">2</div>
        <div class="section__title">Jurisdiction &amp; Issues Identified</div>
        <div class="section__time">${esc(record.guidanceAtLabel || '')}</div>
      </div>
      <p><strong>Jurisdiction:</strong> ${esc(record.jurisdiction)} workplace protection law</p>
      <div class="subhead">Issues Identified</div>
      ${issuesHtml}
    </section>

    <!-- 3. COMPLIANCE GUIDANCE -->
    <section class="section">
      <div class="section__head">
        <div class="section__num">3</div>
        <div class="section__title">Compliance Guidance</div>
        <div class="section__time">${esc(record.guidanceAtLabel || '')}</div>
      </div>
      <div class="guidance-body">${nl2br(record.guidance)}</div>
      ${sourcesHtml ? `<div class="subhead">Sources &amp; Authorities</div>${sourcesHtml}` : ''}
      ${citationsHtml ? `<div class="subhead">Citations</div>${citationsHtml}` : ''}
    </section>

    <!-- 4. NEXT STEPS -->
    <section class="section">
      <div class="section__head">
        <div class="section__num">4</div>
        <div class="section__title">Next Steps &amp; Completion Status</div>
      </div>
      ${stepsHtml}
    </section>

    ${hasFollowups ? `
    <!-- 5. FOLLOW-UP QUESTIONS -->
    <section class="section">
      <div class="section__head">
        <div class="section__num">5</div>
        <div class="section__title">Follow-up Questions</div>
      </div>
      ${followupsHtml}
    </section>
    ` : ''}

    <!-- 6 (or 5). FULL AUDIT TRAIL -->
    <section class="section">
      <div class="section__head">
        <div class="section__num">${hasFollowups ? '6' : '5'}</div>
        <div class="section__title">Full Audit Trail</div>
      </div>
      <ol class="timeline">
        ${timelineHtml}
      </ol>
    </section>

    <!-- Signature block -->
    <div class="signature">
      <div class="signature__field">Manager signature · Date</div>
      <div class="signature__field">HR reviewer signature · Date</div>
    </div>

    <!-- Confidentiality footer -->
    <div class="confidentiality">
      <strong>Confidentiality Notice</strong>
      This document contains confidential compliance guidance generated by the Uplevyl GBV Response API.
      Attorney-supervised. No PII collected. All interactions anonymously logged.
      <br/>Generated by Uplevyl · uplevyl.com
    </div>
  </div>
</body>
</html>`;
}

function priorityLabel(p) {
  switch (p) {
    case 'urgent': return 'Urgent';
    case 'resolved': return 'Informational';
    default: return 'Action needed';
  }
}
