# [DEV-5305] - Sidebar collapse polish
Icon: tabler:layout-sidebar
Tags: frontend, sidebar, ui
Date: 2026-01-07
Summary: Tightened the collapsed sidebar layout, hid labels in icon-only mode, and aligned header spacing with the new titlebar inset.

## Goal
- Ensure the collapsed sidebar is icon-only, centered, and appropriately padded.
- Lower the sidebar header to clear the macOS traffic lights while matching the spacing below the app title.

## Scope
- Sidebar UI adjustments only (no behavioral changes).

## Changes
- Reduced the icon-only sidebar width and removed the extra collapsed width offset.
- Centered icon buttons and visually hid label text in collapsed mode.
- Lowered the sidebar header with matching top/bottom padding.
- Hid the account menu overflow icon when collapsed.

## Files touched
- `frontend/src/App.svelte`
- `frontend/src/lib/components/ui/sidebar/constants.ts`
- `frontend/src/lib/components/ui/sidebar/sidebar.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-header.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-menu-button.svelte`
- `docs/tasks.md`

## Validation
- Not run (UI polish).
