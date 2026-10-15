import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MODULES, getModule } from '../data/modules.js';
import { getExam, getExamConfig } from '../data/exams.js';
import { openExternal } from '../lib/storage.js';
import ModulePicker from '../components/ModulePicker.jsx';

// Fisher–Yates shuffle (new array).
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build an exam run: shuffle question order and each question's options,
// remapping the correct-answer indices. Caps at the available bank size (or the
// cert's configured length, whichever is smaller) and tells the user when the
// authored bank is smaller than a full-length exam.
function buildExam(bank, config) {
  const n = Math.min(config.numQuestions, bank.length);
  const picked = shuffle(bank).slice(0, n);
  return picked.map((item) => {
    const indexed = item.options.map((text, idx) => ({ text, idx }));
    const shuffled = shuffle(indexed);
    const answerSet = new Set(item.answer);
    const newAnswer = shuffled
      .map((o, i) => (answerSet.has(o.idx) ? i : -1))
      .filter((i) => i >= 0);
    return {
      q: item.q,
      options: shuffled.map((o) => o.text),
      answer: newAnswer, // array of correct indices
      multi: newAnswer.length > 1,
      domain: item.domain,
      explain: item.explain,
    };
  });
}

function fmtTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  const sb = [...b].sort();
  return [...a].sort().every((v, i) => v === sb[i]);
}

export default function MockExam({ app, activeModule, setActiveModule }) {
  const moduleId = activeModule || MODULES[0].id;
  const module = getModule(moduleId);
  const bank = getExam(moduleId);
  const config = getExamConfig(moduleId);

  const [run, setRun] = useState(null);
  const [current, setCurrent] = useState(0);
  const [responses, setResponses] = useState({}); // qIndex -> [selected indices]
  const [flagged, setFlagged] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [result, setResult] = useState(null);
  const startRef = useRef(0);
  const timerRef = useRef(null);

  const effectiveMinutes = run
    ? Math.max(5, Math.round((config.minutes * run.length) / config.numQuestions))
    : config.minutes;

  // Timer
  useEffect(() => {
    if (!run || result) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current);
          finish(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, result]);

  const start = () => {
    const built = buildExam(bank, config);
    const minutes = Math.max(5, Math.round((config.minutes * built.length) / config.numQuestions));
    setRun(built);
    setCurrent(0);
    setResponses({});
    setFlagged({});
    setResult(null);
    setSecondsLeft(minutes * 60);
    startRef.current = Date.now();
  };

  const toggleChoice = (qIdx, optIdx, multi) => {
    setResponses((prev) => {
      const cur = prev[qIdx] || [];
      if (multi) {
        const has = cur.includes(optIdx);
        return { ...prev, [qIdx]: has ? cur.filter((x) => x !== optIdx) : [...cur, optIdx] };
      }
      return { ...prev, [qIdx]: [optIdx] };
    });
  };

  const finish = (auto = false) => {
    clearInterval(timerRef.current);
    setRun((currentRun) => {
      if (!currentRun) return currentRun;
      let correct = 0;
      const domainTotals = {};
      const domainCorrect = {};
      currentRun.forEach((q, i) => {
        domainTotals[q.domain] = (domainTotals[q.domain] || 0) + 1;
        const resp = responses[i] || [];
        if (arraysEqual(resp, q.answer)) {
          correct += 1;
          domainCorrect[q.domain] = (domainCorrect[q.domain] || 0) + 1;
        }
      });
      const total = currentRun.length;
      const pct = total ? Math.round((correct / total) * 100) : 0;
      const passed = pct >= config.passPct;
      const domains = Object.keys(domainTotals).map((d) => ({
        name: d,
        correct: domainCorrect[d] || 0,
        total: domainTotals[d],
        pct: Math.round(((domainCorrect[d] || 0) / domainTotals[d]) * 100),
      }));
      const durationSec = Math.round((Date.now() - startRef.current) / 1000);
      const res = { score: correct, total, pct, passed, passPct: config.passPct, domains, durationSec, auto };
      setResult(res);
      app.recordExam(moduleId, res);
      return currentRun;
    });
  };

  const switchModule = (id) => {
    clearInterval(timerRef.current);
    setActiveModule(id);
    setRun(null);
    setResult(null);
  };

  const answeredCount = Object.values(responses).filter((r) => r && r.length).length;
  const isFullLength = bank.length >= config.numQuestions;

  // ---------- Intro ----------
  if (!run) {
    return (
      <div className="view">
        <header className="view-header">
          <div>
            <h1>Mock Exam</h1>
            <p className="subtitle">
              Full-length, timed practice in the real exam format. Original questions — not real exam content.
            </p>
          </div>
        </header>
        <ModulePicker modules={MODULES} activeId={moduleId} onPick={switchModule} />

        <section className="exam-intro" style={{ '--accent': module.color }}>
          <span className="module-code">{module.code}</span>
          <h2>{module.name} — Practice Exam</h2>
          <div className="exam-meta">
            <div className="stat-card">
              <span className="stat-value">{Math.min(config.numQuestions, bank.length)}</span>
              <span className="stat-label">Questions{isFullLength ? '' : ' (bank size)'}</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{effectiveMinutes}</span>
              <span className="stat-label">Minutes (scaled)</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{config.passPct}%</span>
              <span className="stat-label">Pass mark</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{app.store.progress[moduleId]?.bestExamPct || 0}%</span>
              <span className="stat-label">Your best</span>
            </div>
          </div>

          {!isFullLength && (
            <div className="nb-callout note" style={{ marginBottom: 16 }}>
              <span className="nb-callout-icon">ℹ️</span>
              <div>
                <strong>About this bank</strong>
                <p>
                  The real {module.code} exam has {config.numQuestions} questions in {config.minutes} minutes.
                  This practice set has {bank.length} authored questions, and the timer is scaled to match.
                  More questions can be added in <code>data/exams.js</code>.
                </p>
              </div>
            </div>
          )}

          {bank.length === 0 ? (
            <p className="feed-placeholder">No practice questions for this module yet.</p>
          ) : (
            <>
              <ul className="nb-list" style={{ marginBottom: 18 }}>
                <li>Questions and answer options are randomized each attempt.</li>
                <li>Some questions are multiple-response (choose more than one) — these are labeled.</li>
                <li>Flag questions to revisit; a question palette lets you jump around.</li>
                <li>The exam auto-submits when the timer runs out.</li>
              </ul>
              <button className="btn btn-primary btn-lg" onClick={start}>
                Start timed exam
              </button>
              <button
                className="btn btn-ghost"
                style={{ marginLeft: 10 }}
                onClick={() => openExternal(module.examGuideUrl)}
              >
                AWS official practice ↗
              </button>
            </>
          )}
        </section>
      </div>
    );
  }

  // ---------- Results ----------
  if (result) {
    return (
      <div className="view">
        <header className="view-header">
          <div>
            <h1>Exam Results</h1>
            <p className="subtitle">{module.name}</p>
          </div>
        </header>
        <section className="quiz-results" style={{ '--accent': module.color }}>
          <div className={`verdict ${result.passed ? 'pass' : 'fail'}`}>
            {result.passed ? '✅ PASS' : '❌ Did not pass'}
          </div>
          <div className="result-score">{result.score} / {result.total}</div>
          <div className="result-pct">
            {result.pct}% &nbsp;·&nbsp; pass mark {result.passPct}%
          </div>
          {result.auto && <p>⏱️ Time expired — exam was auto-submitted.</p>}
          <p>Time used: {fmtTime(result.durationSec)}</p>

          <div className="result-domains">
            <h4 className="section-title">Score by domain</h4>
            {result.domains.map((d) => (
              <div key={d.name}>
                <div className="domain-row">
                  <span>{d.name}</span>
                  <strong>{d.pct}%</strong>
                </div>
                <div className="domain-bar">
                  <span style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-controls center" style={{ marginTop: 24 }}>
            <button className="btn btn-primary" onClick={start}>Retake (new random set)</button>
            <button className="btn btn-ghost" onClick={() => { setRun(null); setResult(null); }}>
              Back to overview
            </button>
          </div>
        </section>
      </div>
    );
  }

  // ---------- Running exam ----------
  const q = run[current];
  const resp = responses[current] || [];
  const lowTime = secondsLeft <= 60;

  return (
    <div className="view">
      <div className="exam-topbar">
        <div>
          <span className="module-code">{module.code}</span>
          <strong style={{ marginLeft: 10 }}>
            Question {current + 1} / {run.length}
          </strong>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className={`exam-timer ${lowTime ? 'danger' : ''}`}>⏱ {fmtTime(secondsLeft)}</span>
          <span className="quiz-live-score">{answeredCount} answered</span>
          <button className="btn btn-primary sm" onClick={() => finish(false)}>Submit exam</button>
        </div>
      </div>

      <div className="quiz-progress">
        <div className="quiz-progress-bar">
          <span style={{ width: `${((current + 1) / run.length) * 100}%` }} />
        </div>
      </div>

      <section className="quiz-run">
        <div className="quiz-question">
          {q.multi && (
            <div className="exam-multi-hint">
              Multiple response — select {q.answer.length} answers.
            </div>
          )}
          <h3>{q.q}</h3>
          <div className="quiz-options">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                className={`quiz-option ${resp.includes(idx) ? 'selected' : ''}`}
                onClick={() => toggleChoice(current, idx, q.multi)}
              >
                <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                {opt}
              </button>
            ))}
          </div>

          <div className="quiz-controls">
            <button
              className="btn btn-ghost"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              ← Previous
            </button>
            <button
              className={`btn ${flagged[current] ? 'btn-danger-ghost' : 'btn-ghost'}`}
              onClick={() => setFlagged((f) => ({ ...f, [current]: !f[current] }))}
            >
              {flagged[current] ? '🚩 Flagged' : 'Flag for review'}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => setCurrent((c) => Math.min(run.length - 1, c + 1))}
              disabled={current === run.length - 1}
            >
              Next →
            </button>
          </div>

          <div className="exam-palette">
            {run.map((_, i) => (
              <button
                key={i}
                className={`${responses[i]?.length ? 'answered' : ''} ${
                  flagged[i] ? 'flagged' : ''
                } ${i === current ? 'current' : ''}`}
                onClick={() => setCurrent(i)}
                title={`Question ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
