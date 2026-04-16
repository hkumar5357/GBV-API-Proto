import React, { useEffect, useRef, useState } from 'react';

const WORDS_PER_SECOND = 30;
const TICK_MS = Math.round(1000 / WORDS_PER_SECOND);

export default function GuidanceStream({ text, onDone }) {
  const [idx, setIdx] = useState(0);
  const words = (text || '').split(/(\s+)/); // keep whitespace tokens to preserve paragraphs
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

  return (
    <section className="phase-block">
      <h2 className="phase-rule">Guidance</h2>
      <div className="guidance" ref={containerRef}>
        {shown.split('\n').map((line, i, arr) => (
          <React.Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ))}
        {streaming && <span className="guidance__cursor" aria-hidden="true">█</span>}
      </div>
    </section>
  );
}
