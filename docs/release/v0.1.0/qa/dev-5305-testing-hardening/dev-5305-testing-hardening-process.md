# [DEV-5305] - Testing hardening + Playwright popup fix
Icon: tabler:tests
Tags: testing, playwright, qa
Date: 2026-01-07
Summary: Stabilize the settings popup test, add testing docs, and harden test tooling.

## Goal
- Make the E2E suite reliable and document the test structure.

## Scope
- Fix the settings popup test.
- Add a testing index and recommendations.
- Keep test tooling stable.

## Changes
- Added a stable `data-testid` for the Settings popup trigger.
- Updated the popup test to wait for the window and use accessible selectors.
- Excluded `src/references/**` from Tailwind scanning to avoid CSS noise.
- Documented current tests + recommended coverage.

## Files touched
- `frontend/src/App.svelte`
- `frontend/tests/dashboard.spec.ts`
- `frontend/tailwind.config.cjs`
- `docs/knowledge/testing.md`
- `docs/knowledge/README.md`
- `frontend/agents.md`

## Validation
- `pnpm -C frontend test:e2e`
- `pnpm -C frontend check`
- `pnpm -C frontend build`

## Notes
- Playwright requires a browser install (`pnpm -C frontend exec playwright install`) if missing.
- If a different DEV ID is preferred, rename this doc and update `docs/tasks.md`.
