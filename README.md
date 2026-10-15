# AWS Cloud Architect Learning System

A cross-platform **desktop learning application** for anyone studying to become a
**Junior AWS Cloud Solution Architect**. Built with **Electron + React + Vite**,
it packages into a native Windows `.exe` installer (and macOS/Linux builds too).

![status](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue)
![stack](https://img.shields.io/badge/stack-Electron%20%2B%20React%20%2B%20Vite-success)

---

## ✨ Features

### 📚 Study Notes — organized by certification
Covers all the major AWS certification tracks, each with curated **core-concept
notes that work fully offline**:

| Code | Certification | Level |
|------|---------------|-------|
| CLF-C02 | Cloud Practitioner | Foundational |
| AIF-C01 | AI Practitioner | Foundational |
| SAA-C03 | Solutions Architect – Associate | Associate |
| DVA-C02 | Developer – Associate | Associate |
| SOA-C02 | SysOps Administrator – Associate | Associate |
| MLA-C01 | Machine Learning Engineer – Associate | Associate |
| SAP-C02 | Solutions Architect – Professional | Professional |
| DOP-C02 | DevOps Engineer – Professional | Professional |
| ANS-C01 | Advanced Networking – Specialty | Specialty |
| SCS-C02 | Security – Specialty | Specialty |

Each module also **fetches the latest AWS announcements live from the internet**
(AWS "What's New" feed) when the app runs on your machine, with a graceful
offline fallback. A link to the official AWS exam guide opens in your browser.

Each topic is a rich, illustrated study section containing **detailed original
explanations, Mermaid architecture diagrams, comparison tables, and
exam-tip / gotcha callouts** — not just bullet summaries. Sections are
collapsible and each can be marked complete for progress tracking.

> All notes and diagrams are **original content written for this project**. The
> excellent community study guides out there were an inspiration for topic
> coverage only — nothing is copied.

### 📝 Quizzes — randomized, per certification
- A dedicated question bank per certification module.
- **Every attempt randomizes the order of questions _and_ the order of answer
  options** (the correct-answer index is remapped so scoring stays correct).
- Immediate feedback with an explanation after each question.
- Best score per module is tracked.

### 🎯 Mock Exam — full-length & timed, per certification
- A **timed, full-length practice exam** per certification in the real exam
  **format**: scenario questions, single- **and** multiple-response items,
  a countdown timer, a question palette, flag-for-review, and auto-submit when
  time expires.
- Scored against the **real pass mark** (e.g. 72% for SAA) with a
  **per-domain breakdown** so you see where to focus.
- Questions and options are **randomized every attempt**.
- **Important — these are original, exam-realistic questions authored for this
  project. They are NOT real or "leaked" AWS exam questions.** Using actual
  exam content / "braindumps" violates the AWS Certification Program Agreement
  and can get your certification revoked. The in-app "AWS official practice"
  link points you to AWS's own legitimate practice material.

### 💬 Interview Q&A for Cloud Solution Architects
The questions clients and interviewers most often ask a Cloud Solution
Architect — architecture, security, networking, cost, migration and behavioral —
each with a concise **model answer**. Full-text searchable.

### 📁 Knowledge Base — your document library
A space for **information gathering and access**, separate from the study
material:
- Create **folders** with a **title and description**; the dashboard shows each
  folder as a card with its file count.
- **Search bar** that matches folder titles, descriptions, **file names, and the
  extracted text content** of your files.
- **Upload files into a folder** — PDF, Word (`.docx`), text, markdown, CSV and
  other text formats. Files are stored **locally** on your machine (in the app's
  user-data directory).
- **"Summarize folder"** — a **built-in, fully offline** summarizer reads all of
  the folder's files and produces a combined overview, key topics, and per-file
  highlights. No internet, no API key, nothing leaves your machine. (It uses an
  extractive technique — it surfaces the most important sentences — rather than
  a cloud language model.)

> Text extraction works on text-based PDFs and `.docx`; scanned/image-only PDFs
> have no selectable text (OCR is not included). Files of any type are still
> stored and searchable by name.

### 📊 Progress Tracker
- Per-module completion = **50% topics studied + 50% best quiz score**.
- Overall progress across all certifications.
- Full quiz history with pass/fail pills.
- Reset per-module or all progress. Everything is stored **locally** on your
  machine (JSON in the app's user-data directory), so your progress is private.

---

## 🖥️ How content is fetched "from the internet"

Live fetching runs **on the end-user's machine**, not at build time. The Electron
main process uses the `net` module (which respects the system proxy) to pull the
public AWS "What's New" feed and parse it in the renderer. If the network is
unavailable, the app seamlessly shows the bundled curated notes instead — so it
is useful **both online and offline**.

> Only `https://` requests to AWS feeds are allowed by the main process for safety.

---

## ⬇️ Download the Windows installer (.exe)

You don't need to build anything yourself — the `.exe` is built automatically by
GitHub Actions and published as a downloadable release:

1. Go to the **[Releases](../../releases)** page of this repo.
2. Under the **latest** release → **Assets**, download
   `AWS-Learning-System-Setup-<version>.exe`.
3. Run the installer and follow the prompts (you can choose the install folder;
   a desktop + Start-menu shortcut is created).

> The installer is unsigned, so Windows SmartScreen may show a
> "Windows protected your PC" prompt — click **More info → Run anyway**.

**How the download gets produced:** the workflow in
`.github/workflows/build.yml` runs on a Windows runner on every push to `main`
(publishing a rolling **latest** prerelease) and on every `v*` tag (publishing a
versioned release). You can also trigger it manually from the **Actions** tab, or
download the `.exe` directly from a workflow run's **Artifacts**.

To cut a versioned release yourself:

```bash
git tag v1.0.0 && git push origin v1.0.0
```

---

## 🚀 Getting started (development)

Requirements: **Node.js 18+**.

```bash
npm install        # install dependencies
npm run dev        # launch Vite + Electron in dev mode (hot reload)
```

The renderer also runs in a plain browser (`npm run build:renderer` then preview),
falling back to `localStorage` for persistence when Electron isn't present.

---

## 📦 Building the Windows `.exe`

```bash
npm run dist:win   # produces release/AWS-Learning-System-Setup-<version>.exe
```

Other targets:

```bash
npm run dist       # build for the current platform
npm run dist -- --mac    # macOS .dmg
npm run dist -- --linux  # Linux AppImage + .deb
```

> **Note:** A Windows `.exe` must be produced on a Windows machine (or a CI runner
> with Windows / Wine). `electron-builder` handles the packaging; this repo is
> pre-configured with an NSIS installer target under `build.win` in `package.json`.

A ready-to-use GitHub Actions workflow (`.github/workflows/build.yml`) builds the
Windows installer on every tag and uploads it as an artifact.

---

## 🗂️ Project structure

```
aws-learning-system/
├─ src/
│  ├─ electron/
│  │  ├─ main.js          # Electron main process (window, IPC, local storage, net fetch)
│  │  └─ preload.cjs      # safe bridge exposed to the renderer
│  └─ renderer/           # React app (Vite root)
│     ├─ main.jsx
│     ├─ App.jsx
│     ├─ styles.css
│     ├─ components/      # Sidebar, ModuleCard, ProgressRing, ModulePicker,
│     │                   #   Diagram (Mermaid), NoteBlocks
│     ├─ views/           # Dashboard, Notes, Quiz, MockExam, Interview, Progress
│     ├─ lib/             # storage, feed parser, app-state hook
│     └─ data/            # modules, quizzes, interview, exams
│        └─ notes/        # detailed per-module notes (clf, saa, sap, ...) + index
├─ scripts/build-electron.js
├─ vite.config.js
└─ package.json
```

---

## 📝 Extending the content

- **Add quiz questions:** edit `src/renderer/data/quizzes.js` — add objects with
  `q`, `options`, `answer` (correct index) and `explain`.
- **Add mock-exam questions:** edit `src/renderer/data/exams.js`. Each question
  has `q`, `options`, `answer` (an **array** of correct indices — use multiple
  for multiple-response), `domain` and `explain`. Tune length/time/pass-mark in
  `EXAM_CONFIG`.
- **Add / expand notes:** edit the per-module file in
  `src/renderer/data/notes/` (see `notes/README.md` for the block format:
  `p`, `h`, `list`, `steps`, `table`, `diagram`, `tip`, `warn`, `note`).
  Diagrams are [Mermaid](https://mermaid.js.org/) definitions.
- **Add interview Q&A:** edit `src/renderer/data/interview.js`.
- **Add a module:** add an entry to `src/renderer/data/modules.js` and a notes
  file + exam bank (the UI, progress tracking, quizzes and exams wire up
  automatically).

---

## License

MIT © mhaziq502-droid
