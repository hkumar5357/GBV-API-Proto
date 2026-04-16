import React, { useState } from 'react';

export default function ClarificationQuestions({ questions, onPick, onFreeText, picked }) {
  const [text, setText] = useState('');
  if (!questions || questions.length === 0) return null;
  return (
    <section className="phase-block">
      <h2 className="phase-rule">Help me guide you further</h2>
      <div className="clarifications">
        {questions.map((q, i) => {
          const isPicked = picked === q;
          const isDisabled = picked && !isPicked;
          return (
            <button
              key={i}
              type="button"
              className={`clarification ${isPicked ? 'clarification--picked' : ''} ${isDisabled ? 'clarification--dim' : ''}`}
              style={{ animationDelay: `${i * 150}ms` }}
              disabled={!!picked}
              onClick={() => onPick(q)}
            >
              <span className="clarification__arrow">{isPicked ? '✓' : '→'}</span>
              <span className="clarification__text">{q}</span>
            </button>
          );
        })}
      </div>
      <form
        className="clarification-freetext"
        onSubmit={e => {
          e.preventDefault();
          if (text.trim() && !picked) {
            onFreeText(text.trim());
            setText('');
          }
        }}
      >
        <input
          type="text"
          placeholder="Or type a follow-up question"
          value={text}
          onChange={e => setText(e.target.value)}
          disabled={!!picked}
        />
        <button type="submit" disabled={!text.trim() || !!picked} className="btn btn--primary">
          Ask →
        </button>
      </form>
    </section>
  );
}
