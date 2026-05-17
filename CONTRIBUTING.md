# Contributing

## Setup

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build before PR: `npm run build`

## Project Conventions

- Keep route-level files in `src/pages`.
- Keep feature logic inside `src/features/<feature-name>`.
- Keep service wrappers in each feature's `services` folder.
- Preserve dual-engine behavior:
  - Transformers engine is the default path.
  - IMG.LY engine remains available as fallback.
- Prefer small, focused PRs with clear commit messages.

## Pull Request Checklist

- [ ] No unrelated formatting changes
- [ ] Imports and paths remain clean
- [ ] `npm run build` passes locally
- [ ] README/docs updated if structure changed
