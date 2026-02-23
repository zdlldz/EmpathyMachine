# [DEV-5328] - Views merge fix (grid + API lab)
Icon: tabler:git-merge
Tags: frontend, merge, i18n
Date: 2026-01-28
Summary: Reconciled the view registry to include the grid view from main alongside the API lab view and synced supporting assets.

## Goal
- Resolve the `views.ts` merge conflict while preserving both grid and API lab navigation.

## Scope
- Frontend view registry + supporting grid assets.
- i18n merge for grid + API lab labels.

## Changes
- Merged view configs to include dashboard, grid, and API lab entries.
- Added grid view + supporting blocks and view-state helper from main.
- Synced settings + i18n keys for grid view controls.

## Files touched
- `frontend/src/core/views.ts`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/core/view-state.svelte.ts`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/grid-view.scss`
- `frontend/src/lib/components/blocks/drawer-stack.svelte`
- `frontend/src/lib/components/blocks/drawer-stack.scss`
- `frontend/src/lib/components/blocks/scrollable-card.svelte`
- `frontend/src/lib/components/blocks/scrollable-card.scss`
- `frontend/src/lib/components/blocks/scrollable-grid.svelte`
- `frontend/src/lib/components/blocks/scrollable-grid.scss`
- `frontend/tests/dashboard.spec.ts`
- `docs/process/DEV-5328-views-merge-fix.md`
- `docs/tasks.md`

## Validation
- `pnpm -C frontend check`

## Notes
- E2E tests should be re-run on a host with Playwright Chromium permissions if needed.
