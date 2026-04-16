import React from 'react';

export default function NextSteps({ steps, checked, onToggle }) {
  if (!steps || steps.length === 0) return null;
  return (
    <section className="phase-block">
      <h2 className="phase-rule">What to do now</h2>
      <div className="next-steps">
        {steps.map((step, i) => {
          const isChecked = checked.includes(i);
          return (
            <button
              type="button"
              key={i}
              className={`next-step ${isChecked ? 'next-step--checked' : ''}`}
              style={{ animationDelay: `${i * 200}ms` }}
              onClick={() => onToggle(i)}
            >
              <span className="next-step__box" aria-hidden="true">
                {isChecked ? '☑' : '☐'}
              </span>
              <span className="next-step__num">{i + 1}.</span>
              <span className="next-step__text">{step}</span>
              {isChecked && <span className="next-step__check">✓</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}
