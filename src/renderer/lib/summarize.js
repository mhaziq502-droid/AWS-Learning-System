// Offline, built-in extractive summarizer. No external calls — works fully
// offline. It scores sentences by the frequency of their meaningful words
// (after removing stopwords), with light boosts for position and length, then
// returns the top-ranked sentences in their original order, plus the key terms.
//
// This is a classic frequency-based extractive approach (similar in spirit to
// TextRank's simpler cousins). It gives a useful, private summary without a
// language-model API.

const STOPWORDS = new Set(
  (
    'a an the and or but if then else for while of to in on at by with from as is are was were be been being ' +
    'this that these those it its it\u2019s they them their there here he she we you i me my your our his her ' +
    'not no do does did done have has had will would shall should can could may might must also such than too very ' +
    'into over under again further once more most other some any each few all both own same so only up down out off ' +
    'about against between through during before after above below who whom which what when where why how'
  ).split(/\s+/)
);

function splitSentences(text) {
  // Normalize whitespace, then split on sentence terminators followed by space.
  const clean = text.replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  // Split on ., !, ? ; also treat newlines/bullets as boundaries upstream.
  const parts = clean
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts;
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z0-9][a-z0-9'-]*/g) || []).filter(
    (w) => w.length > 2 && !STOPWORDS.has(w)
  );
}

// Build word-frequency map over the whole corpus.
function wordFrequencies(text) {
  const freq = new Map();
  for (const w of tokenize(text)) freq.set(w, (freq.get(w) || 0) + 1);
  // Normalize by max frequency.
  let max = 1;
  for (const v of freq.values()) if (v > max) max = v;
  for (const [k, v] of freq) freq.set(k, v / max);
  return freq;
}

export function topKeywords(text, n = 12) {
  const freq = wordFrequencies(text);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([w]) => w);
}

// Returns { summary: string[], keywords: string[], sentenceCount, wordCount }.
export function summarize(text, maxSentences = 6) {
  const wordCount = tokenize(text).length;
  const sentences = splitSentences(text);
  if (sentences.length === 0) {
    return { summary: [], keywords: [], sentenceCount: 0, wordCount };
  }
  if (sentences.length <= maxSentences) {
    return {
      summary: sentences,
      keywords: topKeywords(text),
      sentenceCount: sentences.length,
      wordCount,
    };
  }

  const freq = wordFrequencies(text);

  const scored = sentences.map((s, idx) => {
    const words = tokenize(s);
    if (words.length === 0) return { s, idx, score: 0 };
    let score = 0;
    for (const w of words) score += freq.get(w) || 0;
    // Average to avoid favoring only long sentences, then small boosts.
    score = score / Math.sqrt(words.length);
    // Position boost: earlier sentences often carry the thesis.
    if (idx === 0) score *= 1.25;
    else if (idx < 3) score *= 1.1;
    // Penalize very short fragments.
    if (words.length < 4) score *= 0.6;
    return { s, idx, score };
  });

  const chosen = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSentences)
    .sort((a, b) => a.idx - b.idx) // restore reading order
    .map((x) => x.s);

  return {
    summary: chosen,
    keywords: topKeywords(text),
    sentenceCount: sentences.length,
    wordCount,
  };
}

// Summarize a whole folder: a combined summary across all files plus a short
// per-file blurb. `files` is [{ name, text }].
export function summarizeFolder(files) {
  const withText = files.filter((f) => f.text && f.text.trim().length > 0);
  const combinedText = withText.map((f) => f.text).join('\n\n');

  const combined = summarize(combinedText, 7);

  const perFile = files.map((f) => {
    if (!f.text || !f.text.trim()) {
      return { name: f.name, summary: [], keywords: [], empty: true };
    }
    const s = summarize(f.text, 3);
    return { name: f.name, summary: s.summary, keywords: s.keywords.slice(0, 6), empty: false };
  });

  return {
    combined,
    perFile,
    filesWithText: withText.length,
    totalFiles: files.length,
  };
}
