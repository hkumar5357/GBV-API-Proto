import React from 'react';

export default function NextSteps({ steps, checked, onToggle }) {
  if (!steps || steps.length === 0) return null;
  return (
    <div className="next-steps">
      {steps.map((step, i) => {
        const isChecked = checked.includes(i);
        return (
          <button
            type="button"
            key={i}
            className={`next-step ${isChecked ? 'next-step--checked' : ''}`}
            style={{ animationDelay: `${i * 60}ms` }}
            onClick={() => onToggle(i)}
            aria-pressed={isChecked}
          >
            <span className="next-step__box" aria-hidden="true">
              {isChecked ? '☑' : '☐'}
            </span>
            <span className="next-step__num">{i + 1}.</span>
            <span className="next-step__text">{step}</span>
          </button>
        );
      })}
    </div>
  );
}
