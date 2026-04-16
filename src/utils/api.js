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

export async function askApi({ userInput, composedQuery, persona = 'Manager Guidance' }) {
  if (!API_URL) {
    return { data: findMockResponse(userInput), mock: true };
  }
  try {
    const res = await withTimeout(
      fetch(`${API_URL}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: composedQuery, persona })
      }),
      TIMEOUT_MS
    );
    if (!res.ok) throw new Error(`http_${res.status}`);
    const data = await res.json();
    return { data, mock: false };
  } catch (err) {
    return { data: findMockResponse(userInput), mock: true };
  }
}
