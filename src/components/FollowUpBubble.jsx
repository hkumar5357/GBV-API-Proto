import React from 'react';
import SourcesList from './SourcesList.jsx';

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  } catch {
    return '';
  }
}

/**
 * FollowUpBubble — single conversational exchange shown beneath the primary
 * wizard. Does NOT re-execute the full workflow (no jurisdiction badge, no
 * issues cards, no compliance record). Just the question and the answer.
 */
export default function FollowUpBubble({ interaction }) {
  const response = interaction.response;
  const pending = !response;

  return (
    <div className="followup-exchange">
      <div className="bubble bubble--user">
        <div className="bubble__avatar" aria-hidden="true">M</div>
        <div className="bubble__body">
          <div>{interaction.displayQuery}</div>
          <div className="bubble__meta">
            <span>Manager</span>
            <span>·</span>
            <span>{formatTime(interaction.timestamp)}</span>
          </div>
        </div>
      </div>

      <div className="bubble bubble--assistant">
        <div className="bubble__avatar" aria-hidden="true">U</div>
        <div className="bubble__body">
          {pending ? (
            <div className="bubble__loading" aria-live="polite" aria-label="Loading answer">
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : (
            <>
              <div style={{ whiteSpace: 'pre-wrap' }}>{response.guidance}</div>
              {response.sources && response.sources.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <SourcesList sources={response.sources} citations={[]} />
                </div>
              )}
              <div className="bubble__meta">
                <span>Uplevyl</span>
                <span>·</span>
                <span>
                  {response.jurisdiction && !/unknown/i.test(response.jurisdiction)
                    ? response.jurisdiction
                    : 'General'}
                </span>
                <span>·</span>
                <span>{formatTime(interaction.timestamp)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
