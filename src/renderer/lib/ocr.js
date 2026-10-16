// Offline OCR for scanned (image-only) PDFs. Uses tesseract.js configured to
// load its worker, WASM core and language data from local bundled paths under
// /ocr (copied at build time by scripts/copy-ocr-assets.js) — so nothing is
// fetched from a CDN and OCR works fully offline.
//
// OCR is heavy: it is only invoked on demand (the user clicks "Run OCR") and
// only for pages where pdf.js found no selectable text. We render each PDF page
// to a canvas via pdf.js, then recognize text from the canvas image.

import * as pdfjsLib from 'pdfjs-dist';

let tesseractModPromise = null;
function loadTesseract() {
  if (!tesseractModPromise) {
    tesseractModPromise = import('tesseract.js');
  }
  return tesseractModPromise;
}

// Base URL for the bundled OCR assets. In the packaged app the renderer is
// served from file://.../dist/index.html, so a relative ./ocr/ path resolves to
// dist/ocr/. import.meta.env.BASE_URL is './' per our Vite base.
function assetUrl(file) {
  const base = (import.meta.env && import.meta.env.BASE_URL) || './';
  return `${base}ocr/${file}`.replace(/\/\//g, '/');
}

// Probe whether the OCR language data was bundled. If not, OCR is unavailable
// and we avoid any network fallback.
export async function ocrAvailable() {
  try {
    const res = await fetch(assetUrl('eng.traineddata.gz'), { method: 'HEAD' });
    return res.ok;
  } catch {
    try {
      const res2 = await fetch(assetUrl('eng.traineddata'), { method: 'HEAD' });
      return res2.ok;
    } catch {
      return false;
    }
  }
}

async function renderPageToCanvas(page, scale = 2) {
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  const ctx = canvas.getContext('2d');
  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

// Runs OCR over a PDF's pages. onProgress({page, total, phase}) is optional.
// Returns the recognized text (string). maxPages caps work for very large docs.
export async function ocrPdf(arrayBuffer, { onProgress, maxPages = 30 } = {}) {
  const available = await ocrAvailable();
  if (!available) {
    throw new Error('OCR assets are not available in this build.');
  }

  const Tesseract = await loadTesseract();

  const task = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    disableWorker: true,
    isEvalSupported: false,
    useSystemFonts: true,
  });
  const pdf = await task.promise;
  const total = Math.min(pdf.numPages, maxPages);

  const worker = await Tesseract.createWorker('eng', 1, {
    workerPath: assetUrl('worker.min.js'),
    corePath: assetUrl(''), // directory; tesseract picks the right core file
    langPath: assetUrl(''), // directory containing eng.traineddata(.gz)
    // No cachePath / no remote: everything is local.
  });

  let out = '';
  try {
    for (let p = 1; p <= total; p++) {
      onProgress && onProgress({ page: p, total, phase: 'render' });
      const page = await pdf.getPage(p);
      const canvas = await renderPageToCanvas(page, 2);
      onProgress && onProgress({ page: p, total, phase: 'recognize' });
      const { data } = await worker.recognize(canvas);
      out += (data.text || '') + '\n';
      // Free the canvas.
      canvas.width = 0;
      canvas.height = 0;
    }
  } finally {
    await worker.terminate();
  }
  return out.trim();
}
