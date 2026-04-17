import React, { useEffect, useRef, useState } from 'react';

const WORDS_PER_SECOND = 60;
const TICK_MS = Math.round(1000 / WORDS_PER_SECOND);

function formatGeneratedAt(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    const time = d.toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short'
    });
    return `Generated on ${date} at ${time}`;
  } catch {
    return '';
  }
}

export default function GuidanceStream({ text, onDone, onCopy, generatedAt }) {
  const [idx, setIdx] = useState(0);
  const words = (text || '').split(/(\s+)/); // keep whitespace tokens
  const containerRef = useRef(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!words.length) {
      if (!doneRef.current && onDone) { doneRef.current = true; onDone(); }
      return;
    }
    const id = setInterval(() => {
      setIdx(i => {
        if (i >= words.length) {
          clearInterval(id);
          if (!doneRef.current && onDone) { doneRef.current = true; onDone(); }
          return i;
        }
        return i + 1;
      });
    }, TICK_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [idx]);

  const shown = words.slice(0, idx).join('');
  const streaming = idx < words.length;

  const handleCopy = () => {
    if (onCopy) onCopy(text || '');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="phase-block">
      <h2 className="phase-rule">Guidance</h2>
      <div
        className="guidance"
        ref={containerRef}
        aria-live="polite"
        aria-atomic="false"
      >
        {shown.split('\n').map((line, i, arr) => (
          <React.Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
        {streaming && <span className="guidance__cursor" aria-hidden="true">█</span>}
      </div>
      {!streaming && (
        <div className="guidance__meta">
          <span>{formatGeneratedAt(generatedAt)}</span>
          <span className="guidance__meta-actions">
            <button type="button" className="btn btn--ghost" onClick={handleCopy} aria-label="Copy guidance to clipboard">
              📋 Copy
            </button>
            <button type="button" className="btn btn--ghost" onClick={handlePrint} aria-label="Print or export guidance">
              🖨 Print / Export
            </button>
          </span>
        </div>
      )}
    </section>
  );
}
