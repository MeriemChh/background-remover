# SketchClean - AI Background Remover

SketchClean is an iPad-first web app for AI background removal with manual mask refinement.

This repository is organized for clarity and open-source collaboration: a clean app shell, routed pages, and feature-scoped modules.

## Live App Flow

- `/`: landing page (project context + entry point)
- `/workspace`: editing workspace

## Features

- Two fully local AI background removal engines:
  - `Transformers Engine (Default)` powered by `@huggingface/transformers` with `Xenova/modnet`
  - `IMG.LY Engine (Fallback)` powered by `@imgly/background-removal`
- Engine selector in UI before processing
- Stable progress loader (0-100, no backwards regression)
- Manual erase/restore brush tools
- Pan + zoom canvas workflow
- Undo/redo edit history
- Frontend-only processing, no app backend uploads required

## Why Two Engines?

Different browsers and devices can behave very differently with in-browser ML runtimes.

- We use **Transformers.js as the primary engine** because it gives strong local performance for many users and aligns with a modern open-source browser AI stack.
- We keep **IMG.LY as a fallback engine** because compatibility matters, and a second independent implementation improves reliability when one engine fails on a specific device.

If one engine fails, the app shows a friendly message suggesting a switch to the other local engine.

## Tech Stack

- React + Vite
- React Router
- Canvas 2D API
- `@huggingface/transformers`
- `@imgly/background-removal`

## Project Structure

```text
src/
  app/
    App.jsx
    global.css
  pages/
    LandingPage.jsx
    NotFoundPage.jsx
    WorkspacePage.jsx
  features/
    background-remover/
      components/
        BackgroundRemover.jsx
      services/
        engineOptions.js
        imglyEngine.js
        transformersEngine.js
      styles/
        background-remover.css
  shared/
    styles/
      landing.css
      not-found.css
  main.jsx
```

See [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) for separation-of-concerns details.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Contribution

Read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a PR.
