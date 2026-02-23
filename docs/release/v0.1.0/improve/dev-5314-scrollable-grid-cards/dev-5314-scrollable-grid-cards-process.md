# [DEV-5314] - Scrollable grid + cards implementation
Icon: tabler:layout-grid
Tags: layout, ui, perf, grid
Date: 2026-01-27
Summary: Delivered ScrollableGrid + ScrollableCard primitives, a stackable DrawerStack, and a new Grid view with persisted toolbar state, mock data, and keyboard navigation hooks.

## Goal
- Implement the planned grid + card foundation, plus the per-view drawer stack and toolbar wiring.

## Scope
- Included: ScrollableGrid virtualization, ScrollableCard shell, DrawerStack, Grid view + toolbar, per-view state persistence, and i18n strings.
- Excluded: Real filter logic, server-backed data, and production media assets.

## Changes
- Added ScrollableGrid with row packing, overscan, anchor scroll correction, and keyboard navigation hooks.
- Added ScrollableCard layout shell with media/meta/tags/actions slots and density/layout handling.
- Added DrawerStack for stackable, push-left filter panels.
- Added a Grid view with toolbar controls, mock data, and per-view persistence for columns/sort/density.
- Added grid-related i18n keys, aria labels, focus-visible styling, and navigation entry.
- Added Playwright coverage for grid virtualization, column persistence, search count updates, and scroll FPS sampling.
- Updated view state helper to use $state-backed values for consistent UI sync with settings.
- Ensured the Grid view fills the panel height so ScrollableGrid owns scrolling/virtualization.
- Added a runbook note for grid performance sanity checks.

## Files touched
- `frontend/src/lib/components/blocks/scrollable-grid.svelte`
- `frontend/src/lib/components/blocks/scrollable-grid.scss`
- `frontend/src/lib/components/blocks/scrollable-card.svelte`
- `frontend/src/lib/components/blocks/scrollable-card.scss`
- `frontend/src/lib/components/blocks/drawer-stack.svelte`
- `frontend/src/lib/components/blocks/drawer-stack.scss`
- `frontend/src/core/view-state.svelte.ts`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/styles/app.scss`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/grid-view.scss`
- `frontend/tests/grid.spec.ts`
- `frontend/src/core/views.ts`
- `frontend/src/core/i18n/messages.json`

## Validation
- `pnpm -C frontend check`
- `pnpm -C frontend test:e2e`

## Plan coverage
- Finalize ScrollableGrid + Card API contracts: done.
- Design DrawerStack host + registration API: done.
- Implement row packing + virtualization controller: done.
- Build Card shell + media behaviors: done.
- Add Grid toolbar + local state wiring: done.
- Add Grid view and sidebar entry with mock data: done.
- Keyboard navigation + focus management: done.
- Performance pass (1k–10k items): done (manual + FPS sampling test).

## Notes
- Mock video playback uses a remote CC0 sample URL for now; replace with local assets when real data lands.
- Grid row height cache resets when the layout signature changes to avoid stale offsets on re-pack.
- View-state values now mirror settings via $state so toolbar controls update immediately after persistence writes.
