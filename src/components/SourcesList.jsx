import React from 'react';

function domainOf(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * SourcesList — surfaces the source URLs that come back in the API response
 * metadata. Falls back to showing citation statutes as a secondary list.
 */
export default function SourcesList({ sources = [], citations = [] }) {
  const hasSources = sources && sources.length > 0;
  const hasCitations = citations && citations.length > 0;

  if (!hasSources && !hasCitations) return null;

  return (
    <section className="sources" aria-label="Sources and authorities">
      <div className="sources__title">Sources & authorities</div>

      {hasSources && (
        <div className="sources__list">
          {sources.map((s, i) => {
            const url = s.source_url || s.url || '';
            const title = s.title || url || `Source ${i + 1}`;
            if (!url) {
              return (
                <div key={i} className="sources__item">
                  <span className="sources__icon" aria-hidden="true">§</span>
                  <span className="sources__item-title">{title}</span>
                </div>
              );
            }
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="sources__item"
              >
                <span className="sources__icon" aria-hidden="true">§</span>
                <span className="sources__item-title">{title}</span>
                <span className="sources__item-url">{domainOf(url)}</span>
                <span className="sources__external" aria-hidden="true">↗</span>
              </a>
            );
          })}
        </div>
      )}

      {!hasSources && hasCitations && (
        <div className="sources__list">
          {citations.map((c, i) => (
            <div key={i} className="sources__item">
              <span className="sources__icon" aria-hidden="true">§</span>
              <span className="sources__item-title">
                <strong style={{ fontWeight: 600 }}>{c.statute}</strong>
                {c.description ? ` — ${c.description}` : ''}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
