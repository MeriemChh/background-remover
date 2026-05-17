# Architecture Notes

## Goals

- Keep existing editing behavior stable while improving maintainability.
- Separate routing, page composition, feature logic, and shared styling.
- Support multiple local AI engines behind one shared upload/edit workflow.

## Layering

- `app/`: top-level routing and app bootstrapping concerns.
- `pages/`: route-level composition (screen entry points).
- `features/background-remover/`: domain logic, UI, and feature-local styles.
- `shared/`: reusable styles/assets not tied to one feature.

## Background Removal Engine Design

- `services/transformersEngine.js`: **primary** Transformers.js background-removal implementation (`Xenova/modnet`).
- `services/imglyEngine.js`: **fallback** IMG.LY implementation for compatibility.
- `services/engineOptions.js`: engine labels, priority messaging, and UI metadata.
- `components/BackgroundRemover.jsx`: shared upload flow, dynamic engine selection, and unified loader UX.

## Why Primary + Fallback

- Browser ML behavior varies by hardware, browser version, and runtime backend.
- Keeping two independent local engines increases resilience for real users.
- Defaulting to Transformers keeps the project aligned with browser-native open-source AI.
- Keeping IMG.LY as fallback preserves reliability when the primary engine fails on a specific environment.

## Separation of Concerns

- Shared UI state, history, canvas tools, and download remain in one component.
- Engine-specific inference logic stays in dedicated service modules.
- Selected engine determines which service is invoked at process time.
- Error handling is user-friendly and suggests switching to the other local engine.

## Why this organization

- Makes adding future engines straightforward.
- Prevents engine-specific complexity from leaking into canvas/editor logic.
- Keeps contributor onboarding clear and modular.
