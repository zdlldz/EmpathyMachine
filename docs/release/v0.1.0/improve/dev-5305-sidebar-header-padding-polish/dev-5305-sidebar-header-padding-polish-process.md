# [DEV-5305] - Sidebar header padding polish
Icon: tabler:layout-sidebar
Tags: frontend, sidebar, ui
Date: 2026-01-07
Summary: Refined sidebar header/group padding, tightened the collapsed width, and added a no-sidebar header offset for utility windows.

## Goal
- Align sidebar header spacing with the new traffic light inset and remove extra group padding.
- Ensure no-sidebar windows push the header below the traffic lights.

## Scope
- Sidebar layout and AppHeader spacing tweaks only.

## Changes
- Adjusted sidebar header padding to `32px 0 16px 0`.
- Removed padding from sidebar groups and tightened icon-only width.
- Added `offsetTop` to `AppHeader` and applied it to the utility window.
- Removed the header height change tied to sidebar collapse.

## Files touched
- `frontend/src/lib/components/app-header.svelte`
- `frontend/src/lib/components/ui/sidebar/constants.ts`
- `frontend/src/lib/components/ui/sidebar/sidebar-group.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-header.svelte`
- `frontend/src/window/WindowApp.svelte`
- `docs/tasks.md`

## Validation
- Not run (UI polish).
