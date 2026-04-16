import React, { useState } from 'react';

export default function SessionComplete({ onFollowUp, onNewSession }) {
  const [text, setText] = useState('');
  const [toast, setToast] = useState('');

  const sendToHr = () => {
    setToast('Sent to HR');
    setTimeout(() => setToast(''), 2000);
  };

  return (
    <section className="phase-block">
      <h2 className="phase-rule">Session Complete</h2>
      <div className="session-complete">
        <div className="session-complete__done">✅ All issues addressed.</div>
        <div className="session-complete__docs">
          <div className="session-complete__label">Documents generated:</div>
          <div>📄 Manager Compliance Record</div>
        </div>
        <div className="session-complete__actions">
          <button className="btn btn--primary" onClick={() => window.print()}>📥 Download All</button>
          <button className="btn btn--ghost" onClick={sendToHr}>📧 Send to HR</button>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>

      <div className="session-followup">
        <div className="session-followup__label">Anything else?</div>
        <form
          className="session-followup__form"
          onSubmit={e => {
            e.preventDefault();
            if (text.trim()) {
              onFollowUp(text.trim());
              setText('');
            }
          }}
        >
          <textarea
            rows={2}
            placeholder="Type a follow-up..."
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button type="submit" className="btn btn--primary" disabled={!text.trim()}>
            Get Guidance →
          </button>
        </form>
      </div>

      <button className="btn btn--ghost btn--new-session" onClick={onNewSession}>
        ← Start New Session
      </button>
    </section>
  );
}
