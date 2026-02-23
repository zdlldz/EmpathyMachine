# [DEV-5303] - Window presets and persistence
Icon: tabler:resize
Tags: tauri, window, sqlite
Date: 2026-01-06
Summary: Added window sizing presets with keyboard shortcuts and persisted main-window state in SQLite.

## Goal
- Provide repeatable window layouts and remember the last size/position.

## Scope
- Frontend presets and shortcuts.
- Backend persistence for the main window only.

## Changes
- Added window preset helpers and shortcut registration.
- Added a Settings tab to apply presets to the main window.
- Persisted window size/position in SQLite with throttled updates.
- Granted window sizing permissions in Tauri capabilities.

## Files touched
- `frontend/src/lib/window-presets.ts`
- `frontend/src/App.svelte`
- `frontend/src/settings/SettingsApp.svelte`
- `backend/src/db.rs`
- `backend/src/main.rs`
- `backend/capabilities/default.json`

## Validation
- Not run (recommend `pnpm dev`).

## Notes
- Update `should_track_window` in `backend/src/main.rs` to persist other window labels.
