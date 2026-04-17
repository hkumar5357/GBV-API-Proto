import React, { useEffect, useRef, useState } from 'react';
import LocationBadge from './LocationBadge.jsx';
import EmployeeIdInput from './EmployeeIdInput.jsx';
import ScenarioCards from './ScenarioCards.jsx';
import ProcessingState from './ProcessingState.jsx';
import ResponseFlow from './ResponseFlow.jsx';
import AuditTrail from './AuditTrail.jsx';
import SessionComplete from './SessionComplete.jsx';
import Toast from './Toast.jsx';
import { VERTICALS } from '../data/verticals.js';
import { askApi, composeQuery } from '../utils/api.js';
import { detectThreads } from '../utils/threadDetection.js';
import { randomId } from '../utils/documentGenerator.js';

const MAX_INPUT = 1000;

export default function SessionView({ provisioning, onChangeProvisioning }) {
  const vertical = VERTICALS[provisioning.industry];
  const [employeeId, setEmployeeId] = useState('');
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [session, setSession] = useState(() => ({
    id: randomId('SES', 6),
    startTime: new Date().toISOString(),
    interactions: []
  }));
  const [sessionComplete, setSessionComplete] = useState(false);
  const latestRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (latestRef.current) {
      latestRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [session.interactions.length]);

  const showToast = (message, variant = 'success', ms = 2200) => {
    setToast({ message, variant });
    setTimeout(() => setToast(null), ms);
  };

  const submitQuery = async (userInput, { followUp = false } = {}) => {
    if (!userInput.trim()) return;
    setSessionComplete(false);
    setSubmitting(true);

    const composed = composeQuery({
      userInput,
      industry: vertical.name,
      state: provisioning.state,
      orgName: provisioning.orgName,
      locationId: provisioning.locationId,
      employeeId,
      followUp
    });

    const interactionId = randomId('INT', 5);
    const pending = {
      id: interactionId,
      query: composed,
      displayQuery: userInput,
      timestamp: new Date().toISOString(),
      response: null,
      threads: [],
      phase: 'processing',
      mock: false
    };
    setSession(s => ({ ...s, interactions: [...s.interactions, pending] }));

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
      interactions: s.interactions.map(it =>
        it.id === interactionId
          ? { ...it, response: data, threads, phase: 'jurisdiction', mock }
          : it
      )
    }));
    setSubmitting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitQuery(input);
    setInput('');
  };

  const handleScenario = (scenario) => {
    setInput(scenario.text);
    submitQuery(scenario.text);
    setInput('');
  };

  const handleClarificationPick = (question) => {
    submitQuery(question, { followUp: true });
  };

  const handleFollowUp = (text) => {
    submitQuery(text, { followUp: true });
  };

  const handleNewSituation = () => {
    setSession({
      id: randomId('SES', 6),
      startTime: new Date().toISOString(),
      interactions: []
    });
    setSessionComplete(false);
    setInput('');
    setTimeout(() => textareaRef.current?.focus(), 50);
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

  const handlePhaseChange = (phase) => {
    if (phase === 'complete') setSessionComplete(true);
  };

  const anyMock = session.interactions.some(it => it.mock);
  const hasInteractions = session.interactions.length > 0;
  const employeeIdVariant = provisioning.industry === 'corporate' ? 'prominent' : 'compact';
  const inputLen = input.length;
  const canSubmit = input.trim().length > 0 && !submitting;

  return (
    <main className="session" aria-live="polite">
      <div className="session__topbar">
        <LocationBadge
          provisioning={provisioning}
          onChange={onChangeProvisioning}
        />
        <div className="session__topbar-actions">
          {hasInteractions && (
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleNewSituation}
              aria-label="Start a new situation"
            >
              ← New Situation
            </button>
          )}
          {anyMock && (
            <div className="mock-indicator" role="status">⚡ Demo mode — using sample data</div>
          )}
        </div>
      </div>

      {/* Entry / initial view */}
      {!hasInteractions && (
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
              placeholder="Describe the situation — what happened, who is involved, what state you're in"
              value={input}
              onChange={e => setInput(e.target.value)}
              aria-describedby="situation-hint"
            />
            <div id="situation-hint" className="entry__hint">
              <span>Include details like: what happened, who is involved, any safety concerns.</span>
              <span className="entry__counter">{inputLen} / {MAX_INPUT}</span>
            </div>
            <button
              type="submit"
              className={`btn btn--primary btn--large ${submitting ? 'btn--loading' : ''}`}
              disabled={!canSubmit}
              title={!input.trim() ? 'Describe a situation to get guidance.' : undefined}
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

      {/* Interactions */}
      {hasInteractions && (
        <section className="interactions" aria-live="polite">
          {session.interactions.map((it, idx) => {
            const isLast = idx === session.interactions.length - 1;
            const ref = isLast ? latestRef : null;
            return (
              <article key={it.id} ref={ref} className="interaction">
                <div className="interaction__label">
                  {idx === 0 ? 'Initial disclosure' : `Follow-up ${idx}`}
                </div>
                {!it.response && (
                  <ProcessingState query={it.displayQuery} apiDone={false} />
                )}
                {it.response && (
                  <>
                    <ProcessingState query={it.displayQuery} apiDone={true} />
                    <ResponseFlow
                      interaction={it}
                      provisioning={provisioning}
                      employeeId={employeeId}
                      onClarificationPick={handleClarificationPick}
                      onEscalateHr={handleEscalateHr}
                      onCopyGuidance={handleCopyGuidance}
                      isLast={isLast}
                      onPhaseChange={handlePhaseChange}
                    />
                  </>
                )}
              </article>
            );
          })}

          {sessionComplete && (
            <>
              <SessionComplete
                onFollowUp={handleFollowUp}
                onNewSession={handleNewSituation}
              />
              <AuditTrail session={session} provisioning={provisioning} />
            </>
          )}

          <div style={{ marginTop: 32, textAlign: 'center' }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={handleNewSituation}
            >
              Ask about another situation
            </button>
          </div>
        </section>
      )}

      <footer className="disclaimer">
        <div>⚖️ Attorney-supervised · No PII collected · All interactions anonymously logged</div>
        <div className="disclaimer__powered">
          Powered by <a href="https://uplevyl.com" target="_blank" rel="noreferrer">Uplevyl</a>
        </div>
      </footer>

      {toast && <Toast message={toast.message} variant={toast.variant} />}
    </main>
  );
}
