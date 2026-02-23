# [DEV-5305] - Sidebar + inset polish
Icon: tabler:layout-sidebar
Tags: frontend, polish, ui
Date: 2026-01-07
Summary: Adjusted inset spacing and sidebar padding, centered collapsed icons, and removed a sidebar context misuse that caused runtime errors.

## Goal
- Polish the sidebar layout and eliminate runtime warnings while keeping shadcn styles.

## Scope
- Inset spacing + sidebar header padding adjustments.
- Collapsed icon alignment.
- Remove invalid sidebar context usage in the main app.

## Changes
- Increased inset margin to 1rem and matched min-height calc.
- Added extra top padding for sidebar headers to offset window chrome.
- Centered icons in collapsed sidebar menu buttons.
- Removed `useSidebar()` usage from `App.svelte` and defaulted dropdown side to avoid runtime errors.

## Files touched
- `frontend/src/App.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-header.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-inset.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-menu-button.svelte`

## Validation
- Manual smoke: open sidebar, collapse/expand, click Dialog/Window/Settings.

## Notes
- Console error about `sidebar.isMobile` should be resolved by removing the invalid context usage.
