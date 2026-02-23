# [DEV-5306] - Sidebar inset + icon collapse
Icon: tabler:layout-sidebar
Tags: frontend, ui, shadcn, sidebar
Date: 2026-01-07
Summary: Updated main and settings sidebars to use the inset variant with icon-collapse behavior aligned to shadcn-svelte sidebar examples.

## Goal
- Align main + settings sidebars to the shadcn inset pattern and add icon-collapse behavior.

## Scope
- Sidebar markup and layout adjustments in main and settings views.
- Update shared header styling to match the sidebar example layout.
- No functional changes to Tauri wiring or settings persistence.

## Changes
- Switched `Sidebar.Root` to `variant="inset"` and `collapsible="icon"` in main and settings.
- Removed custom sidebar wrapper classes and aligned header/menu structure to sidebar-08 patterns.
- Added sidebar rail for icon-collapse and standardized sidebar triggers.
- Updated `AppHeader` to mirror the sidebar example header layout.

## Files touched
- `frontend/src/App.svelte`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/lib/components/app-header.svelte`

## Validation
- `pnpm -C frontend check` (not run)

## Notes
- Sidebar menus preserve existing navigation/actions while using example classes only.
