# [DEV-5379] - Window background sliders
Icon: tabler:adjustments
Tags: ui, settings, theming
Date: 2026-02-01
Summary: Added settings sliders for window background opacity and backdrop blur, wired to persisted settings and CSS variables across windows.

## Goal
- Give users fine-grained control over window background opacity and backdrop blur.

## Scope
- Settings UI sliders, persisted settings, and CSS variable updates.
- Excludes native window opacity APIs.

## Changes
- Added window background opacity/blur settings and live preview support.
- Applied CSS variables for background alpha and backdrop blur.
- Added i18n strings for the new controls.

## Files touched
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/core/theme.ts`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/settings/SettingsApp.scss`
- `frontend/src/styles/_base.scss`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/App.svelte`
- `frontend/src/components/ComponentsApp.svelte`

## Validation
- Not run (UI-only changes).

## Notes
- Backdrop blur only shows when the window background is transparent.
