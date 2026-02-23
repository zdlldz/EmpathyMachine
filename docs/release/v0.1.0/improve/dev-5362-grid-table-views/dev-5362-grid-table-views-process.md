# [DEV-5362] - Grid table/list views
Icon: tabler:layout-list
Tags: ui, grid, cards
Date: 2026-01-30
Summary: Add configurable grid/card layout modes, introduce table-style and auto-list grid views, and document the new view variants.

## Goal
- Add list-style card layouts that can be toggled, forced, or auto-switched at one column.

## Scope
- Included: Grid/card layout mode plumbing, new table/auto grid views, navigation + i18n updates, and styling adjustments.
- Excluded: Real data wiring, backend schema changes, and filter logic.

## Changes
- Added ScrollableGrid layout mode control and extended ScrollableCard with an optional body slot for row layouts.
- Refactored Grid view to support toggle/auto/table variants with list layout switching logic.
- Introduced table and auto grid views plus navigation + i18n additions.
- Added table-style row styling and layout toggle UI.

## Files touched
- `docs/process/DEV-5362-grid-table-views.md`
- `docs/tasks.md`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/core/views.ts`
- `frontend/src/lib/components/blocks/scrollable-card.svelte`
- `frontend/src/lib/components/blocks/scrollable-grid.svelte`
- `frontend/src/views/grid-auto-view.svelte`
- `frontend/src/views/grid-view.scss`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/table-view.svelte`

## Validation
- `node frontend/scripts/check-i18n.mjs`

## Notes
- Tracker:
  - [x] Add layout mode support to ScrollableGrid/ScrollableCard.
  - [x] Refactor grid view into variants + add table/auto views.
  - [x] Update settings/i18n/navigation/docs.
- Learnings:
  - ScrollableGrid now owns layout-mode switching, so cards can flip to list layout at one column without per-view logic.
  - Resolved i18n parity by adding the missing `theme.preset.floating` key to EN.
