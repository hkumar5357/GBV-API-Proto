import React, { useEffect, useState } from 'react';

const STEPS = [
  { label: 'Retrieving jurisdiction-specific statutes...', doneAt: 1500 },
  { label: 'Analyzing compliance requirements...', doneAt: 3000 },
  { label: 'Generating guidance...', doneAt: null } // completes on API return
];

export default function ProcessingState({ query, apiDone }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Date.now() - start), 100);
    return () => clearInterval(id);
  }, []);

  const stateOf = (i) => {
    const s = STEPS[i];
    if (i === STEPS.length - 1) {
      if (apiDone) return 'done';
      if (elapsed > (STEPS[i - 1]?.doneAt || 0)) return 'active';
      return 'pending';
    }
    if (elapsed >= s.doneAt) return 'done';
    if (i === 0 || elapsed >= STEPS[i - 1].doneAt) return 'active';
    return 'pending';
  };

  const icon = (state) => {
    if (state === 'done') return <span className="proc-step__icon proc-step__icon--done">✓</span>;
    if (state === 'active') return <span className="proc-step__icon proc-step__icon--active">⟳</span>;
    return <span className="proc-step__icon proc-step__icon--pending">○</span>;
  };

  return (
    <div className="processing">
      <blockquote className="processing__query">{query}</blockquote>
      <div className="processing__steps">
        {STEPS.map((s, i) => {
          const state = stateOf(i);
          return (
            <div key={i} className={`proc-step proc-step--${state}`}>
              {icon(state)}
              <span className="proc-step__label">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
