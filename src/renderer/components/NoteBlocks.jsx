import React from 'react';
import Diagram from './Diagram.jsx';

// Renders the ordered content blocks of a note section. See
// data/notes/README.md for the block format.
export default function NoteBlocks({ blocks }) {
  return (
    <div className="note-blocks">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <p key={i} className="nb-p">{b.text}</p>;
          case 'h':
            return <h5 key={i} className="nb-h">{b.text}</h5>;
          case 'list':
            return (
              <ul key={i} className="nb-list">
                {b.items.map((it, j) => <li key={j}>{it}</li>)}
              </ul>
            );
          case 'steps':
            return (
              <ol key={i} className="nb-steps">
                {b.items.map((it, j) => <li key={j}>{it}</li>)}
              </ol>
            );
          case 'table':
            return (
              <div key={i} className="nb-table-wrap">
                <table className="nb-table">
                  <thead>
                    <tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => <td key={c}>{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'diagram':
            return <Diagram key={i} code={b.code} />;
          case 'tip':
            return (
              <div key={i} className="nb-callout tip">
                <span className="nb-callout-icon">💡</span>
                <div><strong>Exam tip</strong><p>{b.text}</p></div>
              </div>
            );
          case 'warn':
            return (
              <div key={i} className="nb-callout warn">
                <span className="nb-callout-icon">⚠️</span>
                <div><strong>Watch out</strong><p>{b.text}</p></div>
              </div>
            );
          case 'note':
            return (
              <div key={i} className="nb-callout note">
                <span className="nb-callout-icon">ℹ️</span>
                <div><strong>Note</strong><p>{b.text}</p></div>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
