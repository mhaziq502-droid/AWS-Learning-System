// Copies Tesseract.js offline assets (worker, WASM core, English training data)
// into the renderer's public/ocr directory so they are bundled into the app and
// loaded from local file:// paths at runtime — no CDN, fully offline OCR.
//
// If the expected files are not found (e.g. a tesseract.js version with a
// different layout), the script logs a warning and exits 0 so the build does
// not fail; OCR will then simply be unavailable and the app degrades gracefully.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'src/renderer/public/ocr');

fs.mkdirSync(outDir, { recursive: true });

function tryResolve(spec) {
  try {
    return require.resolve(spec);
  } catch {
    return null;
  }
}

function copyIfExists(src, destName) {
  if (src && fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(outDir, destName));
    console.log(`[ocr] copied ${destName}`);
    return true;
  }
  return false;
}

function findInDir(dir, matcher) {
  if (!dir || !fs.existsSync(dir)) return null;
  const hit = fs.readdirSync(dir).find(matcher);
  return hit ? path.join(dir, hit) : null;
}

let ok = true;

// 1) worker script
const workerMain = tryResolve('tesseract.js');
const tessDist = workerMain ? path.dirname(workerMain) : null;
ok = copyIfExists(findInDir(tessDist, (f) => f === 'worker.min.js'), 'worker.min.js') && ok;

// 2) core WASM (from tesseract.js-core)
const coreMain = tryResolve('tesseract.js-core/package.json');
const coreDir = coreMain ? path.dirname(coreMain) : null;
// Prefer the LSTM-only SIMD core if present; else any core wasm/js.
copyIfExists(findInDir(coreDir, (f) => /tesseract-core.*simd.*\.wasm\.js$/.test(f)), 'tesseract-core-simd.wasm.js');
copyIfExists(findInDir(coreDir, (f) => /tesseract-core.*simd.*\.wasm$/.test(f)), 'tesseract-core-simd.wasm');
copyIfExists(findInDir(coreDir, (f) => /^tesseract-core\.wasm\.js$/.test(f)), 'tesseract-core.wasm.js');
copyIfExists(findInDir(coreDir, (f) => /^tesseract-core\.wasm$/.test(f)), 'tesseract-core.wasm');

// 3) English training data. tesseract.js does NOT bundle this (it normally
// downloads from a CDN at runtime). To keep END-USER OCR fully offline, we
// fetch it once here at BUILD time (the build machine has internet) and bundle
// the file into the app. If the download fails, OCR is simply unavailable and
// the build still succeeds.
const langLocal = findInDir(coreDir, (f) => /^eng\.traineddata/.test(f));
if (langLocal) {
  copyIfExists(langLocal, path.basename(langLocal));
} else {
  const dest = path.join(outDir, 'eng.traineddata.gz');
  const url =
    'https://raw.githubusercontent.com/naptha/tessdata/gh-pages/4.0.0_fast/eng.traineddata.gz';
  try {
    console.log('[ocr] downloading eng.traineddata.gz for offline bundling…');
    const res = await fetch(url);
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`[ocr] downloaded eng.traineddata.gz (${buf.length} bytes)`);
    } else {
      console.warn(`[ocr] download failed: HTTP ${res.status}; OCR will be unavailable.`);
      ok = false;
    }
  } catch (err) {
    console.warn(`[ocr] download error: ${err}; OCR will be unavailable.`);
    ok = false;
  }
}

if (!ok) {
  console.warn('[ocr] Some OCR assets were missing. OCR may be unavailable; build continues.');
}
console.log('[ocr] asset copy complete ->', outDir);
