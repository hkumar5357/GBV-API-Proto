/**
 * Renders a compliance record as a structured, printable HTML document
 * in a new window, then triggers print. Users "Save as PDF" from the
 * browser print dialog — this avoids shipping a PDF library client-side.
 */
export function openPrintableRecord(record) {
  const win = window.open('', '_blank', 'width=860,height=1100');
  if (!win) {
    // Popup blocked — fall back to same-window print
    window.print();
    return;
  }
  const html = buildRecordHtml(record);
  win.document.open();
  win.document.write(html);
  win.document.close();
  // Let fonts/styles settle before triggering print
  win.onload = () => {
    setTimeout(() => {
      win.focus();
      win.print();
    }, 300);
  };
}

function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildRecordHtml(record) {
  const actions = (record.actionsTaken || [])
    .map(a => `<li>${escapeHtml(a)}</li>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Uplevyl · Compliance Record ${escapeHtml(record.recordId)}</title>
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
    --paper: #ffffff;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #f1eee8; }
  body {
    font-family: "DM Sans", -apple-system, sans-serif;
    color: var(--ink);
    font-size: 14px;
    line-height: 1.6;
    padding: 40px 24px;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .page {
    max-width: 760px;
    margin: 0 auto;
    background: var(--paper);
    border: 1px solid var(--line);
    padding: 56px 64px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .letterhead {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--orange);
    margin-bottom: 32px;
  }
  .letterhead__brand {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .letterhead__mark {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--orange-light), var(--orange));
  }
  .letterhead__name {
    font-family: "Sora", sans-serif;
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .letterhead__sub {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
    margin-top: 2px;
  }
  .letterhead__record {
    text-align: right;
    font-size: 12px;
    color: var(--muted);
  }
  .letterhead__record strong {
    display: block;
    font-family: "DM Sans", monospace;
    font-weight: 600;
    color: var(--ink);
    font-size: 15px;
    margin-top: 2px;
  }
  h1 {
    font-family: "Sora", sans-serif;
    font-size: 22px;
    letter-spacing: -0.02em;
    margin: 0 0 24px 0;
    font-weight: 600;
  }
  .meta-grid {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 10px 24px;
    margin-bottom: 28px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--line);
  }
  .meta-grid dt {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
  }
  .meta-grid dd { margin: 0; font-weight: 500; }
  .section { margin-bottom: 28px; }
  .section h2 {
    font-family: "Sora", sans-serif;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
    margin: 0 0 10px 0;
    font-weight: 600;
  }
  .section p { margin: 0; line-height: 1.7; }
  .section ul { margin: 0; padding: 0; list-style: none; }
  .section li {
    padding: 8px 0 8px 26px;
    position: relative;
    border-bottom: 1px solid var(--line);
  }
  .section li:last-child { border-bottom: none; }
  .section li::before {
    content: "✓";
    position: absolute;
    left: 0; top: 8px;
    color: var(--orange);
    font-weight: 700;
  }
  .authority {
    background: #faf7f1;
    border-left: 3px solid var(--orange);
    padding: 14px 18px;
    font-size: 14px;
  }
  .signature {
    margin-top: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  .signature__field {
    padding-top: 24px;
    border-top: 1px solid var(--ink);
    font-size: 12px;
    color: var(--muted);
  }
  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid var(--line);
    font-size: 11px;
    color: var(--muted);
    text-align: center;
    line-height: 1.7;
  }
  .footer__powered { margin-top: 4px; }
  .print-toolbar {
    position: fixed;
    top: 16px; right: 16px;
    display: flex;
    gap: 8px;
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
  .print-toolbar button:hover { background: #000; }
  .print-toolbar button.secondary { background: transparent; color: var(--ink); border: 1px solid var(--line); background: #fff; }
  @media print {
    body { background: #fff; padding: 0; }
    .page { border: none; box-shadow: none; padding: 32px 48px; margin: 0; max-width: none; }
    .print-toolbar { display: none; }
    @page { margin: 0.5in; size: letter; }
  }
</style>
</head>
<body>
  <div class="print-toolbar">
    <button class="secondary" onclick="window.close()">Close</button>
    <button onclick="window.print()">Download PDF</button>
  </div>
  <div class="page">
    <header class="letterhead">
      <div class="letterhead__brand">
        <div class="letterhead__mark"></div>
        <div>
          <div class="letterhead__name">Uplevyl</div>
          <div class="letterhead__sub">Manager Compliance Record</div>
        </div>
      </div>
      <div class="letterhead__record">
        Record ID
        <strong>${escapeHtml(record.recordId)}</strong>
      </div>
    </header>

    <h1>Manager Compliance Record</h1>

    <dl class="meta-grid">
      <dt>Date generated</dt><dd>${escapeHtml(record.timestamp)}</dd>
      <dt>Location</dt><dd>${escapeHtml(record.location)}</dd>
      <dt>Employee ID</dt><dd>${escapeHtml(record.employeeId)}</dd>
      <dt>Jurisdiction</dt><dd>${escapeHtml(record.jurisdiction)}</dd>
    </dl>

    <section class="section">
      <h2>Situation summary</h2>
      <p>${escapeHtml(record.situationSummary)}</p>
    </section>

    <section class="section">
      <h2>Actions taken</h2>
      <ul>${actions}</ul>
    </section>

    <section class="section">
      <h2>Authority</h2>
      <div class="authority">${escapeHtml(record.authority)}</div>
    </section>

    <div class="signature">
      <div class="signature__field">Manager signature · Date</div>
      <div class="signature__field">HR reviewer signature · Date</div>
    </div>

    <footer class="footer">
      Attorney-supervised · No PII collected or stored · Confidential
      <div class="footer__powered">Generated by Uplevyl · uplevyl.com</div>
    </footer>
  </div>
</body>
</html>`;
}
