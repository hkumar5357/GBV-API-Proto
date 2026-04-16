import React from 'react';

export default function ScenarioCards({ scenarios, label, onPick }) {
  return (
    <section className="scenario-section" aria-label={label}>
      <h3 className="scenario-section__label">{label}</h3>
      <div className="scenario-grid">
        {scenarios.map((s, i) => (
          <button
            key={i}
            type="button"
            className="scenario-card"
            onClick={() => onPick(s)}
          >
            <div className="scenario-card__text">{s.text}</div>
            <div className="scenario-card__tag">{s.tag}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
