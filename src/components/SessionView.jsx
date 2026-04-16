import React, { useEffect, useRef, useState } from 'react';
import LocationBadge from './LocationBadge.jsx';
import EmployeeIdInput from './EmployeeIdInput.jsx';
import ScenarioCards from './ScenarioCards.jsx';
import ProcessingState from './ProcessingState.jsx';
import ResponseFlow from './ResponseFlow.jsx';
import AuditTrail from './AuditTrail.jsx';
import SessionComplete from './SessionComplete.jsx';
import { VERTICALS } from '../data/verticals.js';
import { askApi, composeQuery } from '../utils/api.js';
import { detectThreads } from '../utils/threadDetection.js';
import { randomId } from '../utils/documentGenerator.js';

export default function SessionView({ provisioning, onChangeProvisioning }) {
  const vertical = VERTICALS[provisioning.industry];
  const [employeeId, setEmployeeId] = useState('');
  const [input, setInput] = useState('');
  const [session, setSession] = useState(() => ({
    id: randomId('SES', 6),
    startTime: new Date().toISOString(),
    interactions: [] // { id, query, displayQuery, timestamp, response, threads, phase, mock }
  }));
  const [sessionComplete, setSessionComplete] = useState(false);
  const latestRef = useRef(null);

  useEffect(() => {
    // Scroll to latest interaction when added
    if (latestRef.current) {
      latestRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [session.interactions.length]);

  const submitQuery = async (userInput, { followUp = false } = {}) => {
    if (!userInput.trim()) return;
    setSessionComplete(false);
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
      persona: 'Manager Guidance'
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

  const handleNewSession = () => {
    setSession({
      id: randomId('SES', 6),
      startTime: new Date().toISOString(),
      interactions: []
    });
    setSessionComplete(false);
    setInput('');
  };

  const handlePhaseChange = (phase, interactionId) => {
    if (phase === 'complete') {
      setSessionComplete(true);
    }
  };

  const anyMock = session.interactions.some(it => it.mock);
  const hasInteractions = session.interactions.length > 0;
  const employeeIdVariant = provisioning.industry === 'corporate' ? 'prominent' : 'compact';

  return (
    <main className="session">
      <div className="session__topbar">
        <LocationBadge
          provisioning={provisioning}
          onChange={onChangeProvisioning}
        />
        {anyMock && (
          <div className="mock-indicator">⚡ Demo mode — using sample data</div>
        )}
      </div>

      {/* Entry / initial view */}
      {!hasInteractions && (
        <section className="entry">
          {employeeIdVariant === 'prominent' && (
            <EmployeeIdInput value={employeeId} onChange={setEmployeeId} variant="prominent" />
          )}
          <h1 className="entry__prompt">Tell me what's happening.</h1>
          <form className="entry__form" onSubmit={handleSubmit}>
            <textarea
              rows={4}
              placeholder="Describe the situation — include what happened and any details you know"
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn--primary btn--large"
              disabled={!input.trim()}
            >
              Get Guidance →
            </button>
          </form>
          {employeeIdVariant === 'compact' && (
            <EmployeeIdInput value={employeeId} onChange={setEmployeeId} variant="compact" />
          )}
          <ScenarioCards
            scenarios={vertical.scenarios}
            label={vertical.scenarioLabel}
            onPick={handleScenario}
          />
        </section>
      )}

      {/* Interactions */}
      {hasInteractions && (
        <section className="interactions">
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
                      isLast={isLast}
                      onPhaseChange={(phase) => handlePhaseChange(phase, it.id)}
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
                onNewSession={handleNewSession}
              />
              <AuditTrail session={session} provisioning={provisioning} />
            </>
          )}
        </section>
      )}

      <footer className="disclaimer">
        ⚖️ Attorney-supervised · No PII collected · All interactions anonymously logged
      </footer>
    </main>
  );
}
