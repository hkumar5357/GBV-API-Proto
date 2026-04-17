import React, { useEffect, useState } from 'react';
import JurisdictionBadge from './JurisdictionBadge.jsx';
import ThreadCards from './ThreadCards.jsx';
import MandatoryAlert from './MandatoryAlert.jsx';
import GuidanceStream from './GuidanceStream.jsx';
import ClarificationQuestions from './ClarificationQuestions.jsx';
import NextSteps from './NextSteps.jsx';
import ComplianceDocument from './ComplianceDocument.jsx';
import { buildComplianceRecord, randomId } from '../utils/documentGenerator.js';

const PHASES = ['jurisdiction', 'threads', 'guidance', 'clarification', 'next-steps', 'document', 'complete'];

export default function ResponseFlow({
  interaction,
  provisioning,
  employeeId,
  onClarificationPick,
  onEscalateHr,
  onCopyGuidance,
  isLast,
  onPhaseChange
}) {
  const [phase, setPhase] = useState('jurisdiction');
  const [checked, setChecked] = useState([]);
  const [picked, setPicked] = useState(null);
  const [recordId] = useState(() => randomId('REC', 6));

  const advance = (next, delay) => {
    setTimeout(() => {
      setPhase(next);
      onPhaseChange && onPhaseChange(next);
    }, delay);
  };

  useEffect(() => {
    // jurisdiction -> threads after 500ms
    if (phase === 'jurisdiction') advance('threads', 500);
  }, [phase]);

  useEffect(() => {
    // threads -> guidance after 500ms + per-card stagger baked into CSS
    if (phase === 'threads') {
      const threadCount = interaction.threads?.length || 1;
      const delay = 500 + threadCount * 200 + (interaction.response?.mandatory_reporting ? 300 : 0);
      advance('guidance', delay);
    }
  }, [phase, interaction.threads, interaction.response]);

  // guidance -> clarification happens via onDone from GuidanceStream
  const handleGuidanceDone = () => {
    setTimeout(() => {
      setPhase('clarification');
      onPhaseChange && onPhaseChange('clarification');
    }, 300);
  };

  useEffect(() => {
    if (phase === 'clarification') advance('next-steps', 200);
  }, [phase]);

  useEffect(() => {
    if (phase === 'next-steps') {
      const stepCount = interaction.response?.next_steps?.length || 0;
      advance('document', stepCount * 200 + 500);
    }
  }, [phase, interaction.response]);

  useEffect(() => {
    if (phase === 'document') advance('complete', 500);
  }, [phase]);

  const toggleStep = (i) => {
    setChecked(c => c.includes(i) ? c.filter(x => x !== i) : [...c, i]);
  };

  const handlePick = (q) => {
    if (picked) return;
    setPicked(q);
    onClarificationPick(q);
  };

  const response = interaction.response;
  if (!response) return null;

  const phaseReached = (p) => PHASES.indexOf(phase) >= PHASES.indexOf(p);

  const complianceRecord = phaseReached('document')
    ? buildComplianceRecord({ interaction, provisioning, employeeId, recordId })
    : null;

  return (
    <div className="response-flow">
      {phaseReached('jurisdiction') && (
        <JurisdictionBadge jurisdiction={response.jurisdiction} />
      )}
      {phaseReached('threads') && (
        <ThreadCards threads={interaction.threads} />
      )}
      {phaseReached('threads') && response.mandatory_reporting && (
        <MandatoryAlert citations={response.citations} onEscalateHr={onEscalateHr} />
      )}
      {phaseReached('guidance') && (
        <GuidanceStream
          text={response.guidance}
          onDone={handleGuidanceDone}
          onCopy={onCopyGuidance}
          generatedAt={interaction.timestamp}
        />
      )}
      {phaseReached('clarification') && isLast && (
        <ClarificationQuestions
          questions={response.clarification_questions}
          picked={picked}
          onPick={handlePick}
          onFreeText={handlePick}
        />
      )}
      {phaseReached('next-steps') && (
        <NextSteps steps={response.next_steps} checked={checked} onToggle={toggleStep} />
      )}
      {phaseReached('document') && (
        <ComplianceDocument record={complianceRecord} />
      )}
    </div>
  );
}
