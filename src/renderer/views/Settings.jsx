import React, { useState } from 'react';

// Settings — currently the optional AI-summary provider configuration. The app
// works fully offline without any of this; it only enables the optional
// generative "AI summary" button in the Knowledge Base.
export default function Settings({ app }) {
  const ai = app.store.settings?.ai || {};
  const [provider, setProvider] = useState(ai.provider || 'openai');
  const [apiKey, setApiKey] = useState(ai.apiKey || '');
  const [model, setModel] = useState(ai.model || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    app.updateSettings({ ai: { provider, apiKey: apiKey.trim(), model: model.trim() } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clear = () => {
    setApiKey('');
    setModel('');
    app.updateSettings({ ai: { provider, apiKey: '', model: '' } });
  };

  const defaultModel =
    provider === 'anthropic' ? 'claude-3-5-haiku-20241022' : 'gpt-4o-mini';

  return (
    <div className="view">
      <header className="view-header">
        <div>
          <h1>Settings</h1>
          <p className="subtitle">Optional configuration. The app is fully functional offline without any of this.</p>
        </div>
      </header>

      <section className="kb-summary" style={{ maxWidth: 680 }}>
        <h4 className="nb-h">Optional AI summary (bring your own key)</h4>
        <p className="nb-p" style={{ marginBottom: 14 }}>
          The Knowledge Base always has a built-in <strong>offline</strong> summarizer. If you
          add an API key below, an extra <strong>“AI summary”</strong> button appears that writes a
          richer, generative summary using your chosen provider. Your key is stored locally on this
          machine and is only sent to the provider you select, and only when you click AI summary.
        </p>

        <label className="nb-h">Provider</label>
        <select
          className="kb-input"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          style={{ marginBottom: 12 }}
        >
          <option value="openai">OpenAI (api.openai.com)</option>
          <option value="anthropic">Anthropic (api.anthropic.com)</option>
        </select>

        <label className="nb-h">API key</label>
        <input
          className="kb-input"
          type="password"
          placeholder="Paste your API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={{ marginBottom: 12 }}
        />

        <label className="nb-h">Model (optional)</label>
        <input
          className="kb-input"
          placeholder={defaultModel}
          value={model}
          onChange={(e) => setModel(e.target.value)}
          style={{ marginBottom: 16 }}
        />

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={save}>Save</button>
          <button className="btn btn-danger-ghost" onClick={clear}>Clear key</button>
          {saved && <span className="kb-status">Saved ✓</span>}
          {ai.apiKey && !saved && <span className="kb-file-sub">A key is currently configured.</span>}
        </div>

        <div className="nb-callout warn" style={{ marginTop: 18 }}>
          <span className="nb-callout-icon">⚠️</span>
          <div>
            <strong>Privacy</strong>
            <p>
              Using AI summary sends the extracted text of a folder’s files to your chosen provider
              over the internet. Do not enable it for confidential documents you don’t want to share
              with that provider. The offline summarizer keeps everything on your machine.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
