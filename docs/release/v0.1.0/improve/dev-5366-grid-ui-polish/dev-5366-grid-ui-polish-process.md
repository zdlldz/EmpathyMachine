# DEV-5366 - Grid UI polish
Icon: tabler:layout-grid
Tags: ui, grid, components
Date: 2026-01-30
Summary: Refined the grid toolbar with icon-first controls, added a collapsible search-field mode, and standardized filter panel presentation. Updated core previews and component docs to reflect the new behaviors.

## Goal
- Tighten the grid toolbar UI/UX while keeping controls accessible and componentized.

## Scope
- Grid view toolbar search/sort/layout/filters adjustments.
- Core search-field enhancements and a filters panel wrapper.
- Core UI previews + components data updates.

## Plan
- Introduce a collapsible search-field mode with idle timeout + escape behavior.
- Switch grid toolbar controls to icon-first controls with refined sizing.
- Align the filters panel height and document the new patterns in core UI views.

## Changes
- Added a collapsible search-field mode with idle timeout, escape handling, and disabled-safe behavior.
- Rebuilt the grid toolbar into icon-only controls with layout toggles + sort icons.
- Standardized filters panel content via a shared wrapper and aligned drawer height.
- Ensured icon-only sort menus keep a readable width.
- Updated core UI previews and component examples for the new search-field mode.

## Tracker
- [x] Update search-field component with collapsible mode and idle timeout.
- [x] Refresh grid toolbar layout, icons, and focus handling.
- [x] Add filters panel wrapper + core UI preview.
- [x] Update components data/previews and task index.

## Files touched
- `frontend/src/lib/components/ui/search-field.svelte`
- `frontend/src/lib/components/ui/search-field.scss`
- `frontend/src/lib/components/ui/select/select.scss`
- `frontend/src/lib/components/blocks/filters-panel.svelte`
- `frontend/src/lib/components/blocks/filters-panel.scss`
- `frontend/src/lib/components/blocks/drawer-stack.scss`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/grid-view.scss`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/core-ui-view.scss`
- `frontend/src/components/components-data.ts`
- `frontend/src/components/component-preview.svelte`
- `docs/tasks.md`

## Validation
- Not run (UI polish only).

## Notes
- The collapsible search-field keeps the input visible when a query is active and auto-blurs after 8s of inactivity.
