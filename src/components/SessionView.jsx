import React, { useCallback, useEffect, useRef, useState } from 'react';
import LocationBadge from './LocationBadge.jsx';
import EmployeeIdInput from './EmployeeIdInput.jsx';
import ScenarioCards from './ScenarioCards.jsx';
import ProcessingState from './ProcessingState.jsx';
import AuditTimeline from './AuditTimeline.jsx';
import Toast from './Toast.jsx';
import BackRow from './BackRow.jsx';
import EmailToHrModal from './EmailToHrModal.jsx';
import Wizard from './wizard/Wizard.jsx';
import FollowUpBubble from './FollowUpBubble.jsx';
import { VERTICALS } from '../data/verticals.js';
import { askApi, composeQuery } from '../utils/api.js';
import { detectThreads } from '../utils/threadDetection.js';
import { randomId, formatComplianceRecordText } from '../utils/documentGenerator.js';
import { openPrintableRecord } from '../utils/printRecord.js';
import { EVENT_TYPES, createEvent } from '../utils/auditEvents.js';

const MAX_INPUT = 1000;

const emptySession = () => ({
  id: randomId('SES', 6),
  startTime: new Date().toISOString(),
  primary: null,
  followups: [],
  events: []
});

export default function SessionView({ provisioning, onChangeProvisioning }) {
  const vertical = VERTICALS[provisioning.industry];
  const [employeeId, setEmployeeId] = useState('');
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [session, setSession] = useState(emptySession);
  const [composeText, setComposeText] = useState('');
  const [emailModalRecord, setEmailModalRecord] = useState(null);
  const textareaRef = useRef(null);
  const followupsEndRef = useRef(null);

  const showToast = (message, variant = 'success', ms = 2200) => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), ms);
  };

  // Append an event to the session's audit timeline.
  const addEvent = useCallback((type, description, metadata = {}) => {
    setSession(s => ({
      ...s,
      events: [...s.events, createEvent(type, description, metadata)]
    }));
  }, []);

  // Seed session_started + context_set events on mount.
  useEffect(() => {
    const contextLabel = `${vertical.name} · ${provisioning.state}${provisioning.locationId ? ' · ' + provisioning.locationId : ''}`;
    setSession(s => {
      if (s.events.length > 0) return s;
      return {
        ...s,
        events: [
          createEvent(EVENT_TYPES.SESSION_STARTED, 'Manager opened Uplevyl response tool.'),
          createEvent(EVENT_TYPES.CONTEXT_SET, `Deployment context set: ${provisioning.orgName} · ${contextLabel}.`, {
            org: provisioning.orgName,
            industry: vertical.name,
            state: provisioning.state,
            location: provisioning.locationId || null
          })
        ]
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Submit an initial (primary) disclosure — drives the 4-page wizard.
  const submitPrimary = async (userInput, { scenarioTag = null } = {}) => {
    if (!userInput.trim()) return;
    setSubmitting(true);

    addEvent(
      EVENT_TYPES.SCENARIO_SUBMITTED,
      scenarioTag
        ? `Scenario submitted (${scenarioTag}): "${truncate(userInput, 180)}"`
        : `Scenario submitted: "${truncate(userInput, 180)}"`,
      { text: userInput, scenarioTag }
    );

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
      primary: { ...s.primary, response: data, threads, mock }
    }));

    // Emit events from the response
    addEvent(
      EVENT_TYPES.GUIDANCE_GENERATED,
      `Guidance generated · jurisdiction: ${data.jurisdiction || 'General'}.`,
      { jurisdiction: data.jurisdiction }
    );
    if (threads && threads.length > 0) {
      addEvent(
        EVENT_TYPES.ISSUES_IDENTIFIED,
        `${threads.length} issue${threads.length === 1 ? '' : 's'} identified: ${threads.map(t => `${t.label} (${t.priority})`).join(', ')}.`,
        { threads: threads.map(t => ({ label: t.label, priority: t.priority })) }
      );
    }
    if (data.mandatory_reporting) {
      addEvent(
        EVENT_TYPES.MANDATORY_TRIGGERED,
        'Mandatory reporting flagged — HR/legal escalation recommended.',
        {}
      );
    }
    setSubmitting(false);
  };

  // Submit a follow-up — renders as a conversational bubble, not a new wizard.
  const submitFollowUp = async (userInput) => {
    if (!userInput.trim()) return;

    addEvent(
      EVENT_TYPES.FOLLOWUP_ASKED,
      `Follow-up asked: "${truncate(userInput, 180)}"`,
      { text: userInput }
    );

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
    submitPrimary(scenario.text, { scenarioTag: scenario.tag });
    setInput('');
  };

  const handleClarificationPick = (question) => submitFollowUp(question);
  const handleFollowupCompose = (text) => submitFollowUp(text);

  const handleNewSituation = () => {
    const fresh = emptySession();
    fresh.events = [
      createEvent(EVENT_TYPES.SESSION_STARTED, 'Manager started a new situation.'),
      createEvent(EVENT_TYPES.CONTEXT_SET, `Deployment context reused: ${provisioning.orgName}.`)
    ];
    setSession(fresh);
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
    addEvent(
      EVENT_TYPES.DOCUMENT_EXPORTED,
      `Compliance record exported as PDF · ${record.recordId}.`,
      { recordId: record.recordId }
    );
  };

  const handleOpenEmailModal = (record) => {
    setEmailModalRecord(record);
  };

  const handleConfirmEmail = (record) => {
    addEvent(
      EVENT_TYPES.DOCUMENT_EMAILED,
      `Compliance record emailed to HR (demo mode) · ${record.recordId}.`,
      { recordId: record.recordId }
    );
    setEmailModalRecord(null);
    showToast('Record sent to HR (demo mode)', 'info');
  };

  const handleDocumentGenerated = useCallback((record) => {
    // Emit only the first time page 4 is reached for a given record.
    setSession(s => {
      if (s.events.some(e => e.type === EVENT_TYPES.DOCUMENT_GENERATED && e.metadata?.recordId === record.recordId)) {
        return s;
      }
      return {
        ...s,
        events: [
          ...s.events,
          createEvent(
            EVENT_TYPES.DOCUMENT_GENERATED,
            `Compliance record generated · ${record.recordId}.`,
            { recordId: record.recordId }
          )
        ]
      };
    });
  }, []);

  const handleStepCompleted = useCallback((index, description) => {
    addEvent(
      EVENT_TYPES.STEP_COMPLETED,
      `Next step ${index + 1} marked complete: "${truncate(description, 140)}"`,
      { index, description }
    );
  }, [addEvent]);

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
            events={session.events}
            session={session}
            followups={session.followups}
            onClarificationPick={handleClarificationPick}
            onEscalateHr={handleEscalateHr}
            onCopyGuidance={handleCopyGuidance}
            onCopyRecord={handleCopyRecord}
            onDownloadRecord={handleDownloadRecord}
            onSendToHr={handleOpenEmailModal}
            onNewSituation={handleNewSituation}
            onStepCompleted={handleStepCompleted}
            onDocumentGenerated={handleDocumentGenerated}
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
            <AuditTimeline
              events={session.events}
              session={session}
              provisioning={provisioning}
              employeeId={employeeId}
              collapsible={true}
            />
          </div>
        )}
      </main>

      {toast && <Toast message={toast.message} variant={toast.variant} />}

      {emailModalRecord && (
        <EmailToHrModal
          record={emailModalRecord}
          provisioning={provisioning}
          onCancel={() => setEmailModalRecord(null)}
          onConfirm={() => handleConfirmEmail(emailModalRecord)}
        />
      )}
    </>
  );
}

function truncate(s, n) {
  if (!s) return '';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}
