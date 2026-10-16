// Optional generative (LLM) summary via a user-provided API key. This is NOT
// the default — the built-in offline extractive summarizer is. This only runs
// when the user has configured a key in Settings and clicks "AI summary".
//
// The request is made from the Electron main process (respects system proxy,
// avoids browser CORS). The key is stored locally and only sent to the host the
// user selected.

const MAX_INPUT_CHARS = 24000; // keep prompts within typical model limits

export function aiConfigured(settings) {
  return !!(settings && settings.ai && settings.ai.apiKey);
}

export async function aiSummarizeFolder(files, settings) {
  const bridge = typeof window !== 'undefined' ? window.awsLearning : null;
  if (!bridge || !bridge.llmComplete) {
    return { ok: false, error: 'AI summary requires the desktop app.' };
  }
  const ai = settings.ai || {};
  if (!ai.apiKey) return { ok: false, error: 'No API key configured in Settings.' };

  const withText = files.filter((f) => f.text && f.text.trim());
  if (withText.length === 0) {
    return { ok: false, error: 'No extractable text to summarize.' };
  }

  // Build a compact corpus, labeled per file, truncated to fit.
  let corpus = '';
  for (const f of withText) {
    const header = `\n\n=== FILE: ${f.name} ===\n`;
    corpus += header + f.text;
    if (corpus.length > MAX_INPUT_CHARS) {
      corpus = corpus.slice(0, MAX_INPUT_CHARS) + '\n...[truncated]';
      break;
    }
  }

  const prompt =
    'You are helping an AWS cloud learner organize reference material. ' +
    'Summarize the following documents together. Respond in Markdown with: ' +
    '1) a short "Overview" (3-6 sentences), 2) "Key topics" as a bullet list, ' +
    '3) "Per-file notes" with one or two bullets per file. Be concise and factual.\n\n' +
    corpus;

  const res = await bridge.llmComplete({
    provider: ai.provider || 'openai',
    apiKey: ai.apiKey,
    model: ai.model || '',
    prompt,
  });
  return res;
}
