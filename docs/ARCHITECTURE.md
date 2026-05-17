# Architecture Notes

## Goals

- Keep UI behavior stable while improving maintainability.
- Separate routing, page composition, feature logic, and shared styling.
- Make the repo easy to scan for recruiters and contributors.

## Layering

- `app/`: top-level routing and app bootstrapping concerns.
- `pages/`: route-level composition (screen entry points).
- `features/background-remover/`: domain logic, UI, and feature-local styles.
- `shared/`: reusable styles/assets not tied to one feature.

## Separation of Concerns

- `BackgroundRemover.jsx`: interaction + canvas/editor state.
- `services/removeBackground.js`: integration wrapper around external AI library.
- `app/App.jsx`: route declarations only.
- `pages/LandingPage.jsx`: project context and navigation into the workspace.

## Why this organization

- Improves discoverability for first-time contributors.
- Reduces accidental coupling across unrelated code.
- Makes future refactors (e.g., additional tools/features) straightforward.
