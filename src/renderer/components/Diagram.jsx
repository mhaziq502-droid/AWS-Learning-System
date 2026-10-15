import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Renders a Mermaid diagram definition into inline SVG. Diagrams are defined as
// code in the notes data, so they stay crisp, tiny, fully offline, and themeable.
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'strict',
  themeVariables: {
    primaryColor: '#1b2942',
    primaryTextColor: '#e6edf6',
    primaryBorderColor: '#ff9900',
    lineColor: '#7db3ff',
    secondaryColor: '#141f33',
    tertiaryColor: '#0f1724',
    fontSize: '14px',
  },
});

let seq = 0;

export default function Diagram({ code }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(false);
  const idRef = useRef(`mmd-${++seq}`);

  useEffect(() => {
    let cancelled = false;
    setError(false);
    mermaid
      .render(idRef.current, code)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [code]);

  if (error) {
    // Fall back to showing the raw definition so content is never lost.
    return (
      <pre className="diagram-fallback" aria-label="diagram source">
        {code}
      </pre>
    );
  }

  return (
    <div className="diagram" dangerouslySetInnerHTML={{ __html: svg }} />
  );
}
