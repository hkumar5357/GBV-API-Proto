import React from 'react';
import GuidanceStream from '../GuidanceStream.jsx';
import SourcesList from '../SourcesList.jsx';

export default function GuidancePage({
  response,
  generatedAt,
  onStreamDone,
  onCopy,
  autoRestart
}) {
  return (
    <div className="wizard__page" aria-labelledby="page-guidance-title">
      <div>
        <div className="wizard__section-head">
          <h2 id="page-guidance-title" className="wizard__section-title">Guidance</h2>
        </div>
        <GuidanceStream
          text={response.guidance}
          onDone={onStreamDone}
          onCopy={onCopy}
          generatedAt={generatedAt}
          autoRestart={autoRestart}
        />
      </div>
      <SourcesList
        sources={response.sources}
        citations={response.citations}
      />
    </div>
  );
}
