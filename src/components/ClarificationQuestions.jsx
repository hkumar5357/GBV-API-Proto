import React, { useState } from 'react';

/**
 * Clarification questions appear on the "Next Steps" page. Picking one
 * creates a follow-up interaction (handled by the parent) — it does NOT
 * re-execute the full wizard.
 */
export default function ClarificationQuestions({ questions, onPick, onFreeText }) {
  const [text, setText] = useState('');
  if (!questions || questions.length === 0) return null;

  return (
    <div>
      <div className="clarifications">
        {questions.map((q, i) => (
          <button
            key={i}
            type="button"
            className="clarification"
            style={{ animationDelay: `${i * 80}ms` }}
            onClick={() => onPick(q)}
          >
            <span className="clarification__arrow" aria-hidden="true">→</span>
            <span>{q}</span>
          </button>
        ))}
      </div>
      <form
        className="clarification-freetext"
        onSubmit={e => {
          e.preventDefault();
          if (text.trim()) {
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
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="btn btn--primary"
        >
          Ask →
        </button>
      </form>
    </div>
  );
}
