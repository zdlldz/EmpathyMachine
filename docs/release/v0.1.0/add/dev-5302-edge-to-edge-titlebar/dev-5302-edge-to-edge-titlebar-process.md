# [DEV-5302] - Edge-to-edge titlebar
Icon: tabler:window-maximize
Tags: ui, tauri, window
Date: 2026-01-06
Summary: Enabled overlay titlebars on macOS and added drag regions so windows feel seamless while preserving traffic lights.

## Goal
- Remove the standard titlebar and keep a native draggable surface.

## Scope
- Tauri window config and settings window creation.
- Drag/no-drag CSS helpers for interactive elements.

## Changes
- Enabled overlay titlebars for the main and settings windows.
- Added `app-drag`/`app-no-drag` helpers and applied them to headers and controls.
- Added `data-tauri-drag-region` and window drag permission for seamless dragging.

## Files touched
- `backend/tauri.conf.json`
- `backend/capabilities/default.json`
- `frontend/src/App.svelte`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/styles/app.scss`
- `frontend/src/lib/components/ui/button.svelte`
- `frontend/src/lib/components/ui/input.svelte`

## Validation
- Not run (recommend `pnpm dev`).

## Notes
- Keep interactive elements inside drag regions marked with `app-no-drag`.
