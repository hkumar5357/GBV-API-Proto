import React, { useEffect, useMemo, useState } from 'react';
import ContextPage from './ContextPage.jsx';
import GuidancePage from './GuidancePage.jsx';
import NextStepsPage from './NextStepsPage.jsx';
import DocumentPage from './DocumentPage.jsx';
import { buildComplianceRecord, randomId } from '../../utils/documentGenerator.js';

const STEPS = [
  { num: 1, key: 'context', title: 'Context' },
  { num: 2, key: 'guidance', title: 'Guidance' },
  { num: 3, key: 'nextSteps', title: 'Next Steps' },
  { num: 4, key: 'document', title: 'Document' }
];

export default function Wizard({
  interaction,
  provisioning,
  employeeId,
  events = [],
  session,
  followups = [],
  onClarificationPick,
  onEscalateHr,
  onCopyGuidance,
  onCopyRecord,
  onDownloadRecord,
  onSendToHr,
  onNewSituation,
  onStepCompleted,
  onDocumentGenerated
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [maxReached, setMaxReached] = useState(1);
  const [guidanceStreamed, setGuidanceStreamed] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState([]);
  const [stepCompletedAt, setStepCompletedAt] = useState({}); // index -> ISO timestamp
  const [recordId] = useState(() => randomId('REC', 6));

  const response = interaction.response;

  const complianceRecord = useMemo(
    () => buildComplianceRecord({
      interaction,
      provisioning,
      employeeId,
      recordId,
      events,
      followups,
      checkedSteps,
      stepCompletedAt,
      session
    }),
    [interaction, provisioning, employeeId, recordId, events, followups, checkedSteps, stepCompletedAt, session]
  );

  // Emit DOCUMENT_GENERATED the first time we land on page 4
  useEffect(() => {
    if (currentStep === 4 && onDocumentGenerated) {
      onDocumentGenerated(complianceRecord);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  if (!response) return null;

  const canAdvanceFromStep = (step) => {
    if (step === 2) return guidanceStreamed;
    return true;
  };

  const scrollToTop = () => {
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 10);
  };

  const advance = () => {
    const next = Math.min(currentStep + 1, STEPS.length);
    setCurrentStep(next);
    setMaxReached(m => Math.max(m, next));
    scrollToTop();
  };

  const goBack = () => {
    const prev = Math.max(currentStep - 1, 1);
    setCurrentStep(prev);
    scrollToTop();
  };

  const jumpTo = (step) => {
    if (step <= maxReached) {
      setCurrentStep(step);
      scrollToTop();
    }
  };

  const toggleStep = (i) => {
    setCheckedSteps(c => {
      const isNowChecked = !c.includes(i);
      if (isNowChecked) {
        const now = new Date().toISOString();
        setStepCompletedAt(m => ({ ...m, [i]: now }));
        if (onStepCompleted && response.next_steps && response.next_steps[i]) {
          onStepCompleted(i, response.next_steps[i]);
        }
        return [...c, i];
      }
      // Uncheck: also clear the completed-at stamp
      setStepCompletedAt(m => {
        const next = { ...m };
        delete next[i];
        return next;
      });
      return c.filter(x => x !== i);
    });
  };

  const handleStreamDone = () => setGuidanceStreamed(true);

  const renderPage = () => {
    switch (currentStep) {
      case 1:
        return (
          <ContextPage
            displayQuery={interaction.displayQuery}
            response={response}
            threads={interaction.threads}
            onEscalateHr={onEscalateHr}
          />
        );
      case 2:
        return (
          <GuidancePage
            response={response}
            generatedAt={interaction.timestamp}
            onStreamDone={handleStreamDone}
            onCopy={onCopyGuidance}
            autoRestart={!guidanceStreamed}
          />
        );
      case 3:
        return (
          <NextStepsPage
            response={response}
            checked={checkedSteps}
            onToggleStep={toggleStep}
            onClarificationPick={onClarificationPick}
          />
        );
      case 4:
        return (
          <DocumentPage
            record={complianceRecord}
            onDownload={() => onDownloadRecord(complianceRecord)}
            onCopy={() => onCopyRecord(complianceRecord)}
            onSendToHr={() => onSendToHr(complianceRecord)}
            onNewSituation={onNewSituation}
          />
        );
      default:
        return null;
    }
  };

  const nextLabels = {
    1: 'Read Guidance →',
    2: 'Review Next Steps →',
    3: 'Generate Document →'
  };

  const footerHints = {
    1: 'Review the jurisdiction and issues identified before reading guidance.',
    2: guidanceStreamed ? 'Guidance is ready.' : 'Guidance is streaming — you can continue when it finishes.',
    3: 'Mark the steps you\'ve completed, or ask a follow-up.',
    4: ''
  };

  const stepState = (step) => {
    if (step.num === currentStep) return 'active';
    if (step.num <= maxReached) return 'done';
    return 'pending';
  };

  return (
    <div className="wizard">
      <nav className="wizard__progress" aria-label="Progress">
        {STEPS.map(step => {
          const state = stepState(step);
          const clickable = step.num <= maxReached;
          return (
            <button
              key={step.num}
              type="button"
              className={`wizard-step wizard-step--${state}`}
              onClick={() => clickable && jumpTo(step.num)}
              disabled={!clickable}
              aria-current={state === 'active' ? 'step' : undefined}
            >
              <div className="wizard-step__num">
                Step {step.num} / {STEPS.length}
                {state === 'done' && <span className="wizard-step__check" aria-label="Completed">✓</span>}
              </div>
              <div className="wizard-step__title">{step.title}</div>
            </button>
          );
        })}
      </nav>

      {renderPage()}

      {currentStep < STEPS.length && (
        <div className="wizard__footer">
          <div className="wizard__footer-hint">{footerHints[currentStep]}</div>
          <div className="wizard__footer-actions">
            {currentStep > 1 && (
              <button type="button" className="btn btn--ghost" onClick={goBack}>
                ← Back
              </button>
            )}
            <button
              type="button"
              className="btn btn--primary"
              onClick={advance}
              disabled={!canAdvanceFromStep(currentStep)}
            >
              {nextLabels[currentStep]}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
