import React, { useMemo, useRef, useState } from 'react';
import { extractText, extOf } from '../lib/extract.js';
import { summarizeFolder } from '../lib/summarize.js';
import { kbSaveFileBytes } from '../lib/storage.js';

function fmtBytes(n) {
  if (n == null) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(ext) {
  if (ext === 'pdf') return '📕';
  if (ext === 'docx' || ext === 'doc') return '📘';
  if (ext === 'csv' || ext === 'tsv') return '📊';
  if (['txt', 'md', 'markdown', 'log'].includes(ext)) return '📄';
  return '🗂️';
}

// ------------------------- Folder dashboard --------------------------------
function Dashboard({ app, onOpen }) {
  const folders = app.store.kbFolders || [];
  const [query, setQuery] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return folders;
    return folders.filter((f) => {
      if (f.title.toLowerCase().includes(q)) return true;
      if ((f.description || '').toLowerCase().includes(q)) return true;
      // Search file names AND extracted file text content.
      return (f.files || []).some(
        (file) =>
          file.name.toLowerCase().includes(q) ||
          (file.text || '').toLowerCase().includes(q)
      );
    });
  }, [folders, query]);

  const create = () => {
    if (!title.trim()) return;
    const id = app.createFolder(title, desc);
    setTitle('');
    setDesc('');
    setShowNew(false);
    onOpen(id);
  };

  return (
    <div className="view">
      <header className="view-header">
        <div>
          <h1>Knowledge Base</h1>
          <p className="subtitle">
            Organize PDFs and documents into folders for information gathering &amp; access.
            Each folder can summarize all of its files — fully offline.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNew((s) => !s)}>
          {showNew ? 'Cancel' : '+ New folder'}
        </button>
      </header>

      {showNew && (
        <section className="kb-newfolder">
          <input
            className="kb-input"
            placeholder="Folder title (e.g. SAA Whitepapers)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className="kb-input"
            placeholder="Description (what is this folder for?)"
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <button className="btn btn-primary" onClick={create} disabled={!title.trim()}>
            Create folder
          </button>
        </section>
      )}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search folders, descriptions, file names and file content…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {folders.length === 0 && (
        <div className="feed-placeholder">
          No folders yet. Create your first folder to start gathering information.
        </div>
      )}

      {folders.length > 0 && filtered.length === 0 && (
        <div className="feed-placeholder">No folders match “{query}”.</div>
      )}

      <div className="kb-grid">
        {filtered.map((f) => {
          const fileCount = (f.files || []).length;
          return (
            <article key={f.id} className="kb-card" onClick={() => onOpen(f.id)}>
              <div className="kb-card-icon">📁</div>
              <h3>{f.title}</h3>
              {f.description && <p className="kb-card-desc">{f.description}</p>}
              <div className="kb-card-meta">
                <span>{fileCount} file{fileCount === 1 ? '' : 's'}</span>
                {f.summary && <span className="kb-badge">summarized</span>}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

// ------------------------- Folder detail -----------------------------------
function FolderDetail({ app, folderId, onBack }) {
  const folder = (app.store.kbFolders || []).find((f) => f.id === folderId);
  const fileInput = useRef(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(folder?.title || '');
  const [desc, setDesc] = useState(folder?.description || '');

  if (!folder) {
    return (
      <div className="view">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <div className="feed-placeholder">Folder not found.</div>
      </div>
    );
  }

  const onPickFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setBusy(true);
    try {
      for (const file of files) {
        setStatus(`Processing ${file.name}…`);
        const ext = extOf(file.name);
        const fileId = 'f-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        // Persist raw bytes to disk (packaged app) so the file is retained.
        const buf = await file.arrayBuffer();
        await kbSaveFileBytes({ folderId, fileId, ext: ext ? '.' + ext : '', arrayBuffer: buf });
        // Extract text for search + summarization.
        const { text, note } = await extractText(file);
        app.addFileToFolder(folderId, {
          id: fileId,
          name: file.name,
          ext,
          size: file.size,
          text,
          note,
        });
      }
      setStatus('');
    } catch (err) {
      setStatus('Something went wrong while importing a file.');
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const runSummary = () => {
    setBusy(true);
    setStatus('Summarizing all files in this folder…');
    // Defer so the UI can paint the busy state before the (sync) work.
    setTimeout(() => {
      const result = summarizeFolder(
        (folder.files || []).map((f) => ({ name: f.name, text: f.text || '' }))
      );
      app.saveFolderSummary(folderId, result);
      setBusy(false);
      setStatus('');
    }, 30);
  };

  const saveEdits = () => {
    app.updateFolder(folderId, { title: title.trim() || folder.title, description: desc.trim() });
    setEditing(false);
  };

  const files = folder.files || [];
  const summary = folder.summary;

  return (
    <div className="view">
      <header className="view-header">
        <div>
          <button className="btn btn-ghost sm" onClick={onBack}>← All folders</button>
          {!editing ? (
            <>
              <h1 style={{ marginTop: 10 }}>📁 {folder.title}</h1>
              {folder.description && <p className="subtitle">{folder.description}</p>}
            </>
          ) : (
            <div className="kb-newfolder" style={{ marginTop: 10 }}>
              <input className="kb-input" value={title} onChange={(e) => setTitle(e.target.value)} />
              <textarea className="kb-input" rows={2} value={desc} onChange={(e) => setDesc(e.target.value)} />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary sm" onClick={saveEdits}>Save</button>
                <button className="btn btn-ghost sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
        {!editing && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-ghost sm" onClick={() => setEditing(true)}>Edit</button>
            <button
              className="btn btn-danger-ghost sm"
              onClick={() => {
                if (confirm(`Delete folder "${folder.title}" and all its files?`)) {
                  app.deleteFolder(folderId);
                  onBack();
                }
              }}
            >
              Delete
            </button>
          </div>
        )}
      </header>

      <section className="kb-actions">
        <input
          ref={fileInput}
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={onPickFiles}
        />
        <button className="btn btn-primary" onClick={() => fileInput.current?.click()} disabled={busy}>
          ⬆ Upload files
        </button>
        <button className="btn btn-ghost" onClick={runSummary} disabled={busy || files.length === 0}>
          ✨ Summarize folder
        </button>
        {status && <span className="kb-status">{status}</span>}
      </section>

      <section>
        <h3 className="section-title">Files <span className="live-badge">{files.length}</span></h3>
        {files.length === 0 ? (
          <div className="feed-placeholder">
            No files yet. Upload PDFs, Word docs, text, markdown or CSV files.
          </div>
        ) : (
          <ul className="kb-file-list">
            {files.map((f) => (
              <li key={f.id} className="kb-file">
                <span className="kb-file-icon">{fileIcon(f.ext)}</span>
                <div className="kb-file-main">
                  <span className="kb-file-name">{f.name}</span>
                  <span className="kb-file-sub">
                    {fmtBytes(f.size)}
                    {f.text ? ` · ${f.text.split(/\s+/).filter(Boolean).length} words` : ''}
                    {f.note ? ` · ${f.note}` : ''}
                  </span>
                </div>
                <button
                  className="btn btn-danger-ghost sm"
                  onClick={() => app.removeFileFromFolder(folderId, f.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {summary && (
        <section>
          <h3 className="section-title">
            Folder summary
            <span className="live-badge">
              offline · {summary.filesWithText}/{summary.totalFiles} files with text
            </span>
          </h3>

          {summary.combined.summary.length === 0 ? (
            <div className="feed-placeholder">
              No extractable text was found in these files to summarize (e.g. scanned PDFs).
            </div>
          ) : (
            <div className="kb-summary">
              <h4 className="nb-h">Overview</h4>
              <ul className="nb-list">
                {summary.combined.summary.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
              {summary.combined.keywords.length > 0 && (
                <div className="kb-keywords">
                  {summary.combined.keywords.map((k) => (
                    <span key={k} className="kb-chip">{k}</span>
                  ))}
                </div>
              )}

              <h4 className="nb-h" style={{ marginTop: 16 }}>Per-file highlights</h4>
              {summary.perFile.map((pf, i) => (
                <div key={i} className="kb-perfile">
                  <strong>{pf.name}</strong>
                  {pf.empty ? (
                    <p className="kb-file-sub">No extractable text.</p>
                  ) : (
                    <ul className="nb-list">
                      {pf.summary.map((s, j) => <li key={j}>{s}</li>)}
                    </ul>
                  )}
                </div>
              ))}
              <p className="kb-file-sub" style={{ marginTop: 10 }}>
                Generated {new Date(summary.generatedAt).toLocaleString()} · built-in offline summarizer
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ------------------------- Container ---------------------------------------
export default function KnowledgeBase({ app }) {
  const [openId, setOpenId] = useState(null);
  if (openId) {
    return <FolderDetail app={app} folderId={openId} onBack={() => setOpenId(null)} />;
  }
  return <Dashboard app={app} onOpen={setOpenId} />;
}
