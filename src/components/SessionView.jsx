import React, { useEffect, useRef, useState } from 'react';
import LocationBadge from './LocationBadge.jsx';
import EmployeeIdInput from './EmployeeIdInput.jsx';
import ScenarioCards from './ScenarioCards.jsx';
import ProcessingState from './ProcessingState.jsx';
import AuditTrail from './AuditTrail.jsx';
import Toast from './Toast.jsx';
import BackRow from './BackRow.jsx';
import Wizard from './wizard/Wizard.jsx';
import FollowUpBubble from './FollowUpBubble.jsx';
import { VERTICALS } from '../data/verticals.js';
import { askApi, composeQuery } from '../utils/api.js';
import { detectThreads } from '../utils/threadDetection.js';
import { randomId, formatComplianceRecordText } from '../utils/documentGenerator.js';
import { openPrintableRecord } from '../utils/printRecord.js';

const MAX_INPUT = 1000;

const emptySession = () => ({
  id: randomId('SES', 6),
  startTime: new Date().toISOString(),
  primary: null,        // { id, query, displayQuery, timestamp, response, threads, mock, kind: 'primary' }
  followups: []         // Array of { id, query, displayQuery, timestamp, response, threads, mock, kind: 'follow-up' }
});

export default function SessionView({ provisioning, onChangeProvisioning }) {
  const vertical = VERTICALS[provisioning.industry];
  const [employeeId, setEmployeeId] = useState('');
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [session, setSession] = useState(emptySession);
  const [composeText, setComposeText] = useState('');
  const textareaRef = useRef(null);
  const followupsEndRef = useRef(null);

  const showToast = (message, variant = 'success', ms = 2200) => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), ms);
  };

  // Submit an initial (primary) disclosure — drives the 4-page wizard.
  const submitPrimary = async (userInput) => {
    if (!userInput.trim()) return;
    setSubmitting(true);

    const composed = composeQuery({
      userInput,
      industry: vertical.name,
      state: provisioning.state,
      orgName: provisioning.orgName,
      locationId: provisioning.locationId,
      employeeId,
      followUp: false
    });
    const interactionId = randomId('INT', 5);
    const pending = {
      id: interactionId,
      query: composed,
      displayQuery: userInput,
      timestamp: new Date().toISOString(),
      response: null,
      threads: [],
      mock: false,
      kind: 'primary'
    };
    setSession(s => ({ ...s, primary: pending, followups: [] }));

    const { data, mock } = await askApi({
      userInput,
      composedQuery: composed,
      persona: 'Manager Guidance',
      context: {
        industry: vertical.id,
        state: provisioning.state,
        orgName: provisioning.orgName,
        locationId: provisioning.locationId,
        employeeId
      }
    });
    const threads = detectThreads(data);
    setSession(s => ({
      ...s,
      primary: {
        ...s.primary,
        response: data,
        threads,
        mock
      }
    }));
    setSubmitting(false);
  };

  // Submit a follow-up — renders as a conversational bubble, not a new wizard.
  const submitFollowUp = async (userInput) => {
    if (!userInput.trim()) return;
    const composed = composeQuery({
      userInput,
      industry: vertical.name,
      state: provisioning.state,
      orgName: provisioning.orgName,
      locationId: provisioning.locationId,
      employeeId,
      followUp: true
    });
    const interactionId = randomId('INT', 5);
    const pending = {
      id: interactionId,
      query: composed,
      displayQuery: userInput,
      timestamp: new Date().toISOString(),
      response: null,
      threads: [],
      mock: false,
      kind: 'follow-up'
    };
    setSession(s => ({ ...s, followups: [...s.followups, pending] }));

    const { data, mock } = await askApi({
      userInput,
      composedQuery: composed,
      persona: 'Manager Guidance',
      context: {
        industry: vertical.id,
        state: provisioning.state,
        orgName: provisioning.orgName,
        locationId: provisioning.locationId,
        employeeId
      }
    });
    setSession(s => ({
      ...s,
      followups: s.followups.map(f =>
        f.id === interactionId ? { ...f, response: data, mock } : f
      )
    }));
  };

  // Auto-scroll to newest follow-up
  useEffect(() => {
    if (session.followups.length > 0) {
      setTimeout(() => {
        followupsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [session.followups.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitPrimary(input);
    setInput('');
  };

  const handleScenario = (scenario) => {
    submitPrimary(scenario.text);
    setInput('');
  };

  const handleClarificationPick = (question) => {
    submitFollowUp(question);
  };

  const handleFollowupCompose = (text) => {
    submitFollowUp(text);
  };

  const handleNewSituation = () => {
    setSession(emptySession());
    setInput('');
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      textareaRef.current?.focus();
    }, 50);
  };

  const handleEscalateHr = () => {
    showToast('HR escalation logged (demo mode)', 'info');
  };

  const handleCopyGuidance = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Guidance copied to clipboard', 'success');
    } catch {
      showToast('Unable to copy — use browser copy instead', 'warning');
    }
  };

  const handleCopyRecord = async (record) => {
    try {
      await navigator.clipboard.writeText(formatComplianceRecordText(record));
      showToast('Record copied to clipboard', 'success');
    } catch {
      showToast('Unable to copy — use browser copy instead', 'warning');
    }
  };

  const handleDownloadRecord = (record) => {
    openPrintableRecord(record);
  };

  const handleSendToHr = () => {
    showToast('Record sent to HR (demo mode)', 'info');
  };

  const hasPrimary = !!session.primary;
  const primaryReady = hasPrimary && !!session.primary.response;
  const anyMock = (session.primary?.mock) || session.followups.some(f => f.mock);
  const employeeIdVariant = provisioning.industry === 'corporate' ? 'prominent' : 'compact';

  return (
    <>
      <BackRow
        label={hasPrimary ? '← New Situation' : '← Back to Setup'}
        onClick={hasPrimary ? handleNewSituation : onChangeProvisioning}
        ariaLabel={hasPrimary ? 'Start a new situation' : 'Back to setup'}
      />
      <main className="shell__content session">
        <div className="session__topbar">
          <LocationBadge
            provisioning={provisioning}
            onChange={onChangeProvisioning}
          />
          <div className="session__topbar-actions">
            {anyMock && (
              <div className="mock-indicator" role="status">⚡ Demo mode — using sample data</div>
            )}
          </div>
        </div>

        {/* Entry */}
        {!hasPrimary && (
          <section className="entry">
            <EmployeeIdInput
              value={employeeId}
              onChange={setEmployeeId}
              variant={employeeIdVariant}
            />
            <h1 className="entry__prompt">Tell me what&apos;s happening.</h1>
            <form className="entry__form" onSubmit={handleSubmit}>
              <label htmlFor="situation-input" className="visually-hidden">
                Describe the situation
              </label>
              <textarea
                id="situation-input"
                ref={textareaRef}
                rows={5}
                maxLength={MAX_INPUT}
                placeholder="Describe the situation — what happened, who is involved, any details you know."
                value={input}
                onChange={e => setInput(e.target.value)}
                aria-describedby="situation-hint"
              />
              <div id="situation-hint" className="entry__hint">
                <span>Include details like: what happened, who is involved, any safety concerns.</span>
                <span className="entry__counter">{input.length} / {MAX_INPUT}</span>
              </div>
              <button
                type="submit"
                className={`btn btn--primary btn--large ${submitting ? 'btn--loading' : ''}`}
                disabled={!input.trim() || submitting}
                aria-label="Get guidance"
              >
                Get Guidance →
              </button>
            </form>
            <ScenarioCards
              scenarios={vertical.scenarios}
              label={vertical.scenarioLabel}
              onPick={handleScenario}
            />
          </section>
        )}

        {/* Primary interaction — wizard or processing */}
        {hasPrimary && !primaryReady && (
          <ProcessingState query={session.primary.displayQuery} apiDone={false} />
        )}

        {hasPrimary && primaryReady && (
          <Wizard
            interaction={session.primary}
            provisioning={provisioning}
            employeeId={employeeId}
            onClarificationPick={handleClarificationPick}
            onEscalateHr={handleEscalateHr}
            onCopyGuidance={handleCopyGuidance}
            onCopyRecord={handleCopyRecord}
            onDownloadRecord={handleDownloadRecord}
            onSendToHr={handleSendToHr}
            onNewSituation={handleNewSituation}
          />
        )}

        {/* Follow-ups — conversational bubbles beneath the wizard */}
        {primaryReady && session.followups.length > 0 && (
          <section className="followups" aria-label="Follow-up questions">
            <div className="followups__label">Follow-ups</div>
            {session.followups.map(f => (
              <FollowUpBubble key={f.id} interaction={f} />
            ))}
            <div ref={followupsEndRef}></div>
          </section>
        )}

        {/* Persistent follow-up composer once the primary is ready */}
        {primaryReady && (
          <form
            className="followup-composer"
            onSubmit={e => {
              e.preventDefault();
              if (composeText.trim()) {
                handleFollowupCompose(composeText.trim());
                setComposeText('');
              }
            }}
          >
            <textarea
              rows={1}
              placeholder="Ask a follow-up..."
              value={composeText}
              onChange={e => setComposeText(e.target.value)}
              aria-label="Ask a follow-up question"
            />
            <button
              type="submit"
              className="btn btn--primary"
              disabled={!composeText.trim()}
            >
              Ask →
            </button>
          </form>
        )}

        {/* Audit drawer */}
        {primaryReady && (
          <div className="audit-drawer">
            <AuditTrail session={sessionToAuditShape(session)} provisioning={provisioning} />
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </>
  );
}

/**
 * Flatten session.primary + followups into the shape AuditTrail expects
 * (a simple `interactions[]` array).
 */
function sessionToAuditShape(session) {
  const interactions = [];
  if (session.primary && session.primary.response) interactions.push(session.primary);
  for (const f of session.followups) {
    if (f.response) interactions.push(f);
  }
  return {
    id: session.id,
    startTime: session.startTime,
    interactions,
    employeeId: session.employeeId
  };
}
