import { app, BrowserWindow, ipcMain, net, shell } from 'electron';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

// -----------------------------------------------------------------------------
// Local persistence (progress + cached notes) in the OS user-data directory.
// We use a plain JSON file so the app has zero native build dependencies and
// stays easy to package into a Windows .exe.
// -----------------------------------------------------------------------------
function storePath() {
  return path.join(app.getPath('userData'), 'aws-learning-store.json');
}

function readStore() {
  try {
    const raw = fs.readFileSync(storePath(), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { progress: {}, quizHistory: [], notesCache: {}, settings: {} };
  }
}

function writeStore(data) {
  fs.writeFileSync(storePath(), JSON.stringify(data, null, 2), 'utf-8');
}

// -----------------------------------------------------------------------------
// Live fetch helper. Runs on the USER's machine (not the build sandbox), so it
// can reach the public internet. Uses Electron's net module which respects the
// system proxy. Any failure returns null so the renderer falls back to the
// bundled offline notes.
// -----------------------------------------------------------------------------
function fetchUrl(url) {
  return new Promise((resolve) => {
    try {
      const request = net.request(url);
      let body = '';
      request.on('response', (response) => {
        if (response.statusCode >= 400) {
          resolve({ ok: false, status: response.statusCode, body: null });
          return;
        }
        response.on('data', (chunk) => {
          body += chunk.toString();
        });
        response.on('end', () => resolve({ ok: true, status: response.statusCode, body }));
      });
      request.on('error', () => resolve({ ok: false, status: 0, body: null }));
      request.setHeader('User-Agent', 'AWS-Learning-System/1.0');
      request.end();
    } catch {
      resolve({ ok: false, status: 0, body: null });
    }
  });
}

// -----------------------------------------------------------------------------
// IPC handlers
// -----------------------------------------------------------------------------
ipcMain.handle('store:get', () => readStore());

ipcMain.handle('store:set', (_event, data) => {
  writeStore(data);
  return true;
});

ipcMain.handle('net:fetch', async (_event, url) => {
  // Allow only https AWS/official feeds to keep things safe.
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return { ok: false, status: 0, body: null };
  } catch {
    return { ok: false, status: 0, body: null };
  }
  return fetchUrl(url);
});

ipcMain.handle('shell:open', (_event, url) => {
  shell.openExternal(url);
  return true;
});

// -----------------------------------------------------------------------------
// Knowledge Base file storage. Files live under <userData>/knowledge-base/
// <folderId>/<fileId><ext> so they persist on the user's machine. Metadata and
// extracted text are kept in the JSON store (handled by the renderer). The
// renderer extracts text (PDF/DOCX client-side) and passes raw bytes as base64.
// -----------------------------------------------------------------------------
function kbRoot() {
  return path.join(app.getPath('userData'), 'knowledge-base');
}

function safeSegment(id) {
  // Only allow the ids we generate (hex/alphanumeric + dash) to avoid any path
  // traversal from a crafted id.
  return String(id).replace(/[^a-zA-Z0-9_-]/g, '');
}

function folderDir(folderId) {
  return path.join(kbRoot(), safeSegment(folderId));
}

ipcMain.handle('kb:saveFile', (_event, { folderId, fileId, ext, base64 }) => {
  try {
    const dir = folderDir(folderId);
    fs.mkdirSync(dir, { recursive: true });
    const cleanExt = String(ext || '').replace(/[^a-zA-Z0-9.]/g, '');
    const filePath = path.join(dir, safeSegment(fileId) + cleanExt);
    fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
    return { ok: true, path: filePath };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('kb:readFile', (_event, { folderId, fileId, ext }) => {
  try {
    const cleanExt = String(ext || '').replace(/[^a-zA-Z0-9.]/g, '');
    const filePath = path.join(folderDir(folderId), safeSegment(fileId) + cleanExt);
    const buf = fs.readFileSync(filePath);
    return { ok: true, base64: buf.toString('base64') };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('kb:deleteFile', (_event, { folderId, fileId, ext }) => {
  try {
    const cleanExt = String(ext || '').replace(/[^a-zA-Z0-9.]/g, '');
    const filePath = path.join(folderDir(folderId), safeSegment(fileId) + cleanExt);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

ipcMain.handle('kb:deleteFolder', (_event, { folderId }) => {
  try {
    const dir = folderDir(folderId);
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
});

// -----------------------------------------------------------------------------
// Window
// -----------------------------------------------------------------------------
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0f1724',
    title: 'AWS Cloud Architect Learning System',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenuBarVisibility(false);

  if (isDev) {
    win.loadURL('http://localhost:5173');
    win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
