// Thin storage layer. In the packaged Electron app it talks to the main
// process (JSON file in userData). In a plain browser (dev preview without
// Electron) it falls back to localStorage so the UI still works.

const BROWSER_KEY = 'aws-learning-store';
const EMPTY = {
  progress: {},
  quizHistory: [],
  examHistory: [],
  kbFolders: [],
  notesCache: {},
  settings: {},
};

function hasBridge() {
  return typeof window !== 'undefined' && !!window.awsLearning;
}

export async function loadStore() {
  if (hasBridge()) {
    try {
      const data = await window.awsLearning.getStore();
      return { ...EMPTY, ...data };
    } catch {
      return { ...EMPTY };
    }
  }
  try {
    const raw = localStorage.getItem(BROWSER_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

export async function saveStore(data) {
  if (hasBridge()) {
    try {
      await window.awsLearning.setStore(data);
      return;
    } catch {
      /* fall through to browser */
    }
  }
  try {
    localStorage.setItem(BROWSER_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export async function fetchUrl(url) {
  if (hasBridge()) {
    try {
      return await window.awsLearning.fetchUrl(url);
    } catch {
      return { ok: false, status: 0, body: null };
    }
  }
  // Plain browser: attempt fetch (may be blocked by CORS; that's fine, we fall back).
  try {
    const res = await fetch(url);
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch {
    return { ok: false, status: 0, body: null };
  }
}

export function openExternal(url) {
  if (hasBridge()) {
    window.awsLearning.openExternal(url);
  } else {
    window.open(url, '_blank', 'noopener');
  }
}

// ---- Knowledge Base file bytes (disk via IPC) -------------------------------
// In the packaged app, file bytes are written to the user-data directory. In a
// plain browser (dev preview) there is no disk bridge, so byte save/read is a
// no-op and the app relies on the extracted text kept in the store.

export async function kbSaveFileBytes({ folderId, fileId, ext, arrayBuffer }) {
  if (!hasBridge() || !window.awsLearning.kbSaveFile) return { ok: false, browser: true };
  const base64 = arrayBufferToBase64(arrayBuffer);
  return window.awsLearning.kbSaveFile({ folderId, fileId, ext, base64 });
}

export async function kbReadFileBytes({ folderId, fileId, ext }) {
  if (!hasBridge() || !window.awsLearning.kbReadFile) return { ok: false, browser: true };
  const res = await window.awsLearning.kbReadFile({ folderId, fileId, ext });
  if (res.ok && res.base64) {
    return { ok: true, blob: base64ToBlob(res.base64) };
  }
  return res;
}

export async function kbOpenFile({ folderId, fileId, ext }) {
  if (!hasBridge() || !window.awsLearning.kbOpenFile) return { ok: false, browser: true };
  return window.awsLearning.kbOpenFile({ folderId, fileId, ext });
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function base64ToBlob(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes]);
}
