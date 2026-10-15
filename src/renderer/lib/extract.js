// Text extraction for uploaded Knowledge Base files. Runs entirely in the
// renderer (offline). Supports PDF, DOCX, and plain-text family (txt, md, csv,
// json, log, etc.). For unknown/binary types we store the file but keep text
// empty (so it is still searchable by name and summarizable alongside others).

import mammoth from 'mammoth/mammoth.browser.js';
import * as pdfjsLib from 'pdfjs-dist';

// Run pdf.js on the main thread (no separate worker file). This is the most
// robust option inside a packaged Electron app served over file://, where
// resolving a worker URL is fragile. Text extraction does not need the worker.
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '';
} catch {
  /* ignore if not settable */
}

const TEXT_EXTENSIONS = new Set([
  'txt', 'md', 'markdown', 'csv', 'tsv', 'json', 'log', 'yml', 'yaml',
  'xml', 'html', 'htm', 'js', 'ts', 'py', 'java', 'sql', 'sh', 'ini', 'conf',
]);

export function extOf(name) {
  const m = /\.([a-zA-Z0-9]+)$/.exec(name || '');
  return m ? m[1].toLowerCase() : '';
}

export function isTextExt(ext) {
  return TEXT_EXTENSIONS.has(ext);
}

async function extractPdf(arrayBuffer) {
  try {
    const task = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      disableWorker: true,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdf = await task.promise;
    let text = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      text += content.items.map((it) => (it.str != null ? it.str : '')).join(' ') + '\n';
    }
    return text.trim();
  } catch (err) {
    return '';
  }
}

async function extractDocx(arrayBuffer) {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return (result.value || '').trim();
  } catch {
    return '';
  }
}

function decodeText(arrayBuffer) {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(arrayBuffer).trim();
  } catch {
    return '';
  }
}

// Returns { text, note } where note explains if extraction wasn't possible.
export async function extractText(file) {
  const ext = extOf(file.name);
  const buf = await file.arrayBuffer();

  if (ext === 'pdf') {
    const text = await extractPdf(buf);
    return {
      text,
      note: text ? '' : 'No selectable text found (the PDF may be a scanned image).',
    };
  }
  if (ext === 'docx') {
    const text = await extractDocx(buf);
    return { text, note: text ? '' : 'Could not read document text.' };
  }
  if (ext === 'doc') {
    return { text: '', note: 'Legacy .doc is not supported — please convert to .docx.' };
  }
  if (isTextExt(ext) || file.type.startsWith('text/')) {
    return { text: decodeText(buf), note: '' };
  }
  // Unknown/binary: keep the file but no text.
  return { text: '', note: 'This file type is stored but its text could not be extracted.' };
}
