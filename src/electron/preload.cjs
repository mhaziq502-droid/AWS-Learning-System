// Preload runs in an isolated context and exposes a minimal, safe API to the
// renderer. The renderer never touches Node APIs directly.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('awsLearning', {
  getStore: () => ipcRenderer.invoke('store:get'),
  setStore: (data) => ipcRenderer.invoke('store:set', data),
  fetchUrl: (url) => ipcRenderer.invoke('net:fetch', url),
  openExternal: (url) => ipcRenderer.invoke('shell:open', url),
  // Knowledge Base file storage
  kbSaveFile: (args) => ipcRenderer.invoke('kb:saveFile', args),
  kbReadFile: (args) => ipcRenderer.invoke('kb:readFile', args),
  kbDeleteFile: (args) => ipcRenderer.invoke('kb:deleteFile', args),
  kbDeleteFolder: (args) => ipcRenderer.invoke('kb:deleteFolder', args),
  kbOpenFile: (args) => ipcRenderer.invoke('kb:openFile', args),
  // Optional AI summary (bring-your-own-key)
  llmComplete: (args) => ipcRenderer.invoke('llm:complete', args),
});
