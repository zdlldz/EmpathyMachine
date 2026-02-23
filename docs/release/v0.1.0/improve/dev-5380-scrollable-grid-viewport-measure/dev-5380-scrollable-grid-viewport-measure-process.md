# [DEV-5380] - Scrollable grid viewport measure
Icon: tabler:eye
Tags: frontend, grid, perf
Date: 2026-02-01
Summary: Ensure the scrollable grid measures viewport height on mount so the initial render fills the visible area without requiring a scroll.

## Goal
- Load enough grid rows on first view by measuring viewport height immediately.

## Scope
- Update scrollable grid measurement timing and observer handling.

## Changes
- Added a mount-time viewport measurement with a follow-up animation frame.
- Use ResizeObserver content rect height as the primary measurement source.

## Files touched
- `frontend/src/lib/components/blocks/scrollable-grid.svelte`

## Validation
- Not run (not requested).

## Notes
- Measurement runs on mount; scrolling still updates the viewport state.
