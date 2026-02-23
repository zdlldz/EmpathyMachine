# [DEV-5374] - Window background toggle
Icon: tabler:window
Tags: settings, theme, tauri
Date: 2026-01-31
Summary: Add a preference to toggle the window background and allow transparency without requiring a restart.

## Goal
- Provide a setting to show/hide the window background and support transparent windows.

## Scope
- Add a new persisted setting and UI toggle.
- Apply transparency via CSS without requiring app reloads.
- Enable Tauri window transparency so the CSS toggle is effective.

## Changes
- Added `showWindowBackgrounds` setting and dataset wiring for CSS.
- Added preference toggle under component backgrounds.
- Enabled transparent Tauri windows (main + aux windows).
- Bootstrapped window background dataset in all HTML entrypoints.

## Files touched
- `backend/tauri.conf.json`
- `docs/process/DEV-5374-window-background-toggle.md`
- `frontend/components.html`
- `frontend/index.html`
- `frontend/settings.html`
- `frontend/window.html`
- `frontend/src/App.svelte`
- `frontend/src/components/ComponentsApp.svelte`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/core/theme.ts`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/styles/_base.scss`

## Validation
- Not run yet.

## Notes
- Tauri window transparency is configured at window creation time.
