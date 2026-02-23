# [DEV-5364] - Core grid-view layout audit
Icon: tabler:layout-grid
Tags: frontend, views, scss
Date: 2026-01-30
Summary: Standardized view layout utilities, added sizing variables, and aligned grid-view + primary views with a shared layout structure.

## Goal
- Establish a consistent view layout pattern and sizing controls.
- Reduce full-width stretching in rows and toolbars.

## Scope
- View layout utilities + sizing tokens.
- Grid-view shell alignment and toolbar sizing.
- Documentation + agent guidance updates.

## Changes
- Added shared `app-view` layout utilities and row sizing hooks.
- Introduced view sizing tokens for full-bleed content and row items.
- Updated grid-view, core UI, dashboard, API lab, and hello views to use the standard layout classes.
- Removed redundant grid-view search sizing in favor of `app-view__row-item`.
- Set the grid view default columns to `1` (still overridden by persisted settings).
- Documented the view layout template and linked it in agent guidance.

## Files touched
- `frontend/src/styles/_tokens.scss`
- `frontend/src/styles/app.scss`
- `frontend/src/views/grid-view.scss`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/dashboard-view.scss`
- `frontend/src/views/dashboard-view.svelte`
- `frontend/src/views/api-lab-view.scss`
- `frontend/src/views/api-lab-view.svelte`
- `frontend/src/views/hello-world-view.scss`
- `frontend/src/views/hello-world-view.svelte`
- `frontend/src/views/core-ui-view.scss`
- `frontend/src/views/core-ui-view.svelte`
- `docs/knowledge/view-layout.md`
- `docs/knowledge/README.md`
- `docs/tasks.md`
- `agents.md`

## Validation
- Manual review only (layout-only changes).

## Notes
- Adjust `--view-content-max-width` and `--view-row-item-max-width` per view to tune density.
