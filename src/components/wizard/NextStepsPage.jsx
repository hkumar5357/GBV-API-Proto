import React from 'react';
import NextSteps from '../NextSteps.jsx';
import ClarificationQuestions from '../ClarificationQuestions.jsx';

export default function NextStepsPage({
  response,
  checked,
  onToggleStep,
  onClarificationPick
}) {
  const hasClarifications =
    response.clarification_questions && response.clarification_questions.length > 0;
  return (
    <div className="wizard__page" aria-labelledby="page-next-steps-title">
      <div>
        <div className="wizard__section-head">
          <h2 id="page-next-steps-title" className="wizard__section-title">Next Steps</h2>
        </div>
        <NextSteps
          steps={response.next_steps}
          checked={checked}
          onToggle={onToggleStep}
        />
      </div>

      {hasClarifications && (
        <div>
          <div className="phase-rule">Ask a follow-up</div>
          <ClarificationQuestions
            questions={response.clarification_questions}
            onPick={onClarificationPick}
            onFreeText={onClarificationPick}
          />
        </div>
      )}
    </div>
  );
}
