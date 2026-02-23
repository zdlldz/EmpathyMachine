# [DEV-5330] - Restore API lab view registration
Icon: tabler:activity-heartbeat
Tags: ci, frontend, navigation
Date: 2026-01-28
Summary: Re-add the API lab view to the view registry so seeded tabs can render the UI and Playwright e2e passes.

## Goal
- Fix the failing Playwright test by ensuring the API lab view is available in the app's view registry.

## Scope
- Re-register the API lab view in `frontend/src/core/views.ts`.
- No changes to API lab behavior or tests.

## Changes
- Add the API lab view to `VIEW_CONFIGS` with nav label, icon, and breadcrumbs.

## Files touched
- `frontend/src/core/views.ts`

## Validation
- Not run (CI failure targeted).

## Notes
- The Playwright test seeds the active tab to `api-lab`, which requires the view to be present in the registry.
