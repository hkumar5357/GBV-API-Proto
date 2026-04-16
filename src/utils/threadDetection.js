const PATTERNS = {
  safety: /accommodat|safety|schedul|reassign|role change|transfer|stalking|parking|showing up|following|threat/i,
  leave: /leave|court|hearing|time off|protective order|protection order|absence|paid leave/i,
  escalation: /mandatory report|escalat|notify hr|legal team|report to|law enforcement/i
};

const URGENT_SIGNALS = /imminent|immediate|right now|today|tonight|showing up|entered|assault|weapon|grabbed|injur/i;

export function detectThreads(response) {
  if (!response) return [];
  const combined = [
    response.guidance || '',
    ...(response.next_steps || [])
  ].join(' ').toLowerCase();

  const threads = [];
  const jurisdiction = response.jurisdiction && !/unknown/i.test(response.jurisdiction)
    ? response.jurisdiction
    : 'workplace law';
  const firstCitation = response.citations && response.citations[0];

  if (PATTERNS.safety.test(combined)) {
    threads.push({
      id: 'safety',
      label: 'Safety Accommodation',
      summary: extractSummary(combined, PATTERNS.safety),
      priority: URGENT_SIGNALS.test(combined) ? 'urgent' : 'open',
      confidence: `Based on ${jurisdiction} employer obligations`,
      citation: firstCitation
    });
  }
  if (PATTERNS.leave.test(combined)) {
    threads.push({
      id: 'leave',
      label: 'Leave Rights',
      summary: extractSummary(combined, PATTERNS.leave),
      priority: 'open',
      confidence: `Based on ${jurisdiction} workplace protection law`,
      citation: firstCitation
    });
  }
  if (PATTERNS.escalation.test(combined)) {
    threads.push({
      id: 'escalation',
      label: 'Escalation & Reporting',
      summary: extractSummary(combined, PATTERNS.escalation),
      priority: response.mandatory_reporting ? 'urgent' : 'open',
      confidence: `Based on ${jurisdiction} reporting requirements`,
      citation: firstCitation
    });
  }

  if (threads.length === 0) {
    threads.push({
      id: 'general',
      label: 'Manager Guidance',
      summary: 'General guidance for this situation',
      priority: 'open',
      confidence: `Based on ${jurisdiction}`,
      citation: firstCitation
    });
  }

  return threads;
}

function extractSummary(text, pattern) {
  const match = text.match(pattern);
  if (!match) return '';
  const idx = match.index || 0;
  const start = Math.max(0, idx - 20);
  const end = Math.min(text.length, idx + 60);
  let snippet = text.slice(start, end).trim();
  // Capitalize first letter, strip partial words at edges
  snippet = snippet.replace(/^\S+\s/, '').replace(/\s\S+$/, '');
  return snippet.charAt(0).toUpperCase() + snippet.slice(1);
}
