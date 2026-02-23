# [DEV-5379] - Grid negative columns media sizing
Icon: tabler:layout-grid
Tags: frontend, grid, ui
Date: 2026-02-01
Summary: Extend grid column controls to support 0/-1/-2 media sizing steps, including a text-only mode. Align list-card media sizing with new rem-based tokens and apply the same sizing concept to table view defaults.

## Goal
- Support negative column counts for list-card media sizing and text-only mode.

## Scope
- Update grid view column handling, media sizing behavior, and table defaults.
- Add rem-based media size tokens and list-card sizing hooks.

## Changes
- Allow grid column settings to clamp to -2..16.
- Add media sizing modes to grid view and wire show/hide logic for card media.
- Introduce rem-based media size tokens and hook list-card media width to them.

## Files touched
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/grid-view.scss`
- `frontend/src/lib/components/blocks/scrollable-card.svelte`
- `frontend/src/lib/components/blocks/scrollable-card.scss`
- `frontend/src/styles/_tokens.scss`

## Validation
- Not run (not requested).

## Notes
- Negative column modes affect list-style cards (auto view or list layout).
