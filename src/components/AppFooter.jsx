import React from 'react';

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="app-footer__inner">
        <div>⚖️ Attorney-supervised · No PII collected · All interactions anonymously logged</div>
        <div className="app-footer__powered">
          Powered by <a href="https://uplevyl.com" target="_blank" rel="noreferrer">Uplevyl</a>
        </div>
      </div>
    </footer>
  );
}
