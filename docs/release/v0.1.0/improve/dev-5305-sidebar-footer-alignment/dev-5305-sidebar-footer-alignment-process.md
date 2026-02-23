# [DEV-5305] - Sidebar footer alignment
Icon: tabler:layout-sidebar
Tags: frontend, sidebar, ui
Date: 2026-01-07
Summary: Aligned the sidebar footer with the main nav items and documented the app identity config flow.

## Goal
- Align footer content with sidebar nav items and clarify where to update app identity.

## Scope
- Sidebar footer padding and README documentation only.

## Changes
- Removed horizontal padding from the sidebar footer container.
- Added README guidance for updating app name/bundle id via `config/app.json` + `pnpm sync:config`.

## Files touched
- `frontend/src/lib/components/ui/sidebar/sidebar-footer.svelte`
- `README.md`
- `docs/tasks.md`

## Validation
- Not run (UI/doc polish).
