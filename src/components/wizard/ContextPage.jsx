import React from 'react';
import JurisdictionBadge from '../JurisdictionBadge.jsx';
import ThreadCards from '../ThreadCards.jsx';
import MandatoryAlert from '../MandatoryAlert.jsx';

export default function ContextPage({
  displayQuery,
  response,
  threads,
  onEscalateHr
}) {
  return (
    <div className="wizard__page" aria-labelledby="page-context-title">
      <div>
        <div className="wizard__section-head">
          <h2 id="page-context-title" className="wizard__section-title">Situation & legal context</h2>
        </div>
        <blockquote className="wizard__query-quote">{displayQuery}</blockquote>
      </div>

      <div>
        <div className="phase-rule">Jurisdiction</div>
        <JurisdictionBadge jurisdiction={response.jurisdiction} />
      </div>

      {threads && threads.length > 0 && (
        <div>
          <div className="phase-rule">Issues identified</div>
          <ThreadCards threads={threads} />
        </div>
      )}

      {response.mandatory_reporting && (
        <MandatoryAlert citations={response.citations} onEscalateHr={onEscalateHr} />
      )}
    </div>
  );
}
