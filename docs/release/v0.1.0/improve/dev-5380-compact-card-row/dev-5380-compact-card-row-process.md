# DEV-5380 - Compact card row layout
Icon: tabler:layout-list
Tags: frontend, ui, cards
Date: 2026-02-02
Summary: Compress small list-card layouts into a single-row presentation for zero/negative column modes, with truncated text and inline tags/actions.

## Goal
- Ensure cards in zero/negative column modes present as a single-row layout similar to the table view.

## Scope
- Add a compact mode to ScrollableCard and wire it from grid-view when columns are 0/-1/-2.
- Adjust compact card styling to keep meta, tags, and actions in one row and hide secondary text.

## Changes
- Added a compact flag to ScrollableCard and passed it from grid-view for small column modes.
- Implemented compact row styling (single-line meta/title, inline tags/actions, hidden subtitle/description).

## Files touched
- `frontend/src/lib/components/blocks/scrollable-card.svelte`
- `frontend/src/lib/components/blocks/scrollable-card.scss`
- `frontend/src/views/grid-view.svelte`
- `docs/process/DEV-5380-compact-card-row.md`
- `docs/tasks.md`

## Validation
- Not run (UI change only).

## Notes
- Compact mode triggers when list/auto layouts select media-size compact/tight/none (columns 0/-1/-2).
