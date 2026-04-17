import { findMockResponse } from '../data/mockResponses.js';

const API_URL = import.meta.env.VITE_API_URL || '';
const TIMEOUT_MS = 15000;

export function composeQuery({ userInput, industry, state, orgName, locationId, employeeId, followUp = false }) {
  const followUpTail = followUp ? ' This is a follow-up to the previous situation.' : '';
  return `${userInput}\n\nContext: This is a ${industry} workplace in ${state}. Organization: ${orgName} ${locationId || ''}. Employee ID: ${employeeId || 'Not provided'}.${followUpTail}`;
}

async function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(v => { clearTimeout(t); resolve(v); })
           .catch(e => { clearTimeout(t); reject(e); });
  });
}

/**
 * askApi accepts the raw user input plus structured deployment context and
 * sends BOTH a composed query string (for models that consume prose) and
 * the structured fields (for backends that read them directly). This is
 * critical for jurisdiction resolution when the user types free text that
 * doesn't mention the state.
 */
export async function askApi({
  userInput,
  composedQuery,
  persona = 'Manager Guidance',
  context = {}
}) {
  const stateHint = context.state || '';
  if (!API_URL) {
    return {
      data: applyStateFallback(findMockResponse(userInput), stateHint),
      mock: true
    };
  }
  try {
    const res = await withTimeout(
      fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: composedQuery,
          situation: userInput,
          persona,
          // Structured context — the API should use these directly for
          // jurisdiction resolution rather than relying on parsing the query.
          org: context.orgName || null,
          industry: context.industry || null,
          state: context.state || null,
          location: context.locationId || null,
          employeeId: context.employeeId || null
        })
      }),
      TIMEOUT_MS
    );
    if (!res.ok) throw new Error(`http_${res.status}`);
    const data = await res.json();
    return { data: applyStateFallback(data, stateHint), mock: false };
  } catch (err) {
    return {
      data: applyStateFallback(findMockResponse(userInput), stateHint),
      mock: true
    };
  }
}

/**
 * If the response came back with an unknown / generic jurisdiction but we
 * know the state from the deployment context, use the deployment state.
 * This prevents the "General Guidance" fallback for free-text queries
 * on a provisioned manager view.
 */
function applyStateFallback(response, stateHint) {
  if (!response) return response;
  if (!stateHint) return response;
  const current = response.jurisdiction || '';
  const isUnknown = !current || /unknown|general guidance/i.test(current);
  if (isUnknown) {
    return { ...response, jurisdiction: stateHint };
  }
  return response;
}
