# SketchClean - AI Background Remover

SketchClean is an iPad-first web app for AI background removal with manual mask refinement.

This repository is organized for clarity and open-source collaboration: a clean app shell, routed pages, and feature-scoped modules.

## Live App Flow

- `/`: landing page (project context + entry point)
- `/workspace`: editing workspace (existing app UI/behavior)

## Features

- AI background removal via `@imgly/background-removal`
- Manual erase/restore brush tools
- Pan + zoom canvas workflow
- Undo/redo edit history
- Fully front-end, no server upload required

## Tech Stack

- React + Vite
- React Router
- Canvas 2D API
- `@imgly/background-removal`

## Project Structure

```text
src/
  app/
    App.jsx                # routing + app shell
    global.css             # global reset/base styles
  pages/
    LandingPage.jsx        # recruiter/open-source intro page
    WorkspacePage.jsx      # workspace route entry
  features/
    background-remover/
      components/
        BackgroundRemover.jsx
      services/
        removeBackground.js
      styles/
        background-remover.css
  shared/
    styles/
      landing.css
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
