# [DEV-5364] - Datatable polish
Icon: tabler:table
Tags: ui, datatable, polish, ux
Date: 2026-01-30
Summary: Polish datatable editing, selection, filtering, and clipboard UX to feel more inline, keyboard-friendly, and production-ready. Add row/column affordances and pending paste controls while keeping the component dependency-free.

## Goal
- Make inline editing, filtering, and multi-select feel seamless and accessible.

## Scope
- Datatable interaction polish (editing, selection, filters, clipboard).
- Styling updates to align header/action layout and checkbox visuals.

## Changes
- Added inline edit shell with save button + spinner and restored focus after commit/cancel.
- Reworked header actions layout, filter icon-to-input transition, and active filter column highlighting.
- Enabled drag selection and keyboard multi-select, plus copy/paste for cell ranges with staged apply/discard.
- Updated checkbox rendering to match core UI checkmark behavior and sizing.
- Added subtle active-row highlight and paste/filtered visual states.
- Final audit: prioritize paste commit/clear on Enter/Escape, ensure pointer selection focuses the active cell, and clear filter timers on teardown.

## Tracker
- [x] Review datatable UX + docs to align polish goals.
- [x] Implement editing/selection/filter/clipboard behavior updates.
- [x] Refine datatable styling and visual states for polish.
- [x] Learning: staged paste previews are easier to manage with a separate pending map (not edit status).

## Files touched
- `frontend/src/lib/components/blocks/datatable.svelte`
- `frontend/src/lib/components/blocks/datatable.scss`

## Validation
- Not run (UI-only changes).

## Questions
- Should the staged paste UX commit on blur, or only via Enter + apply button?
- Do we want a shared clipboard utility/button component so code-block + datatable use the same UX?
- Is it acceptable to limit copy/paste to data columns only (excluding index/selection columns)?

## Notes
- Clipboard parsing is TSV-first with basic quote handling; revisit if we expect richer CSV edge cases.
