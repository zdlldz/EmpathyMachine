# [DEV-5377] - Tabs detach guard + sidebar labels
Icon: tabler:layout-sidebar
Tags: tabs, ux, sidebar
Date: 2026-02-01
Summary: Prevent detaching when a window only has one tab and restore sidebar item labels in the expanded state.

## Goal
- Stop rippable tabs from detaching when only one tab exists.
- Restore sidebar text labels while keeping the current layout and ordering.

## Scope
- Detach eligibility guard based on tab count.
- Add sidebar labels for primary/secondary nav items.

## Changes
- Block detaching when only a single tab is present.
- Reintroduced sidebar labels next to icons in expanded sidebars.

## Files touched
- `frontend/src/lib/components/titlebar-tabs.svelte`
- `frontend/src/App.svelte`
- `docs/process/DEV-5377-tabs-sidebar-labels.md`
- `docs/tasks.md`

## Validation
- Not run (manual QA recommended).

## Notes
- Labels remain hidden in collapsed state via existing `.sidebar-item__label` styles.
