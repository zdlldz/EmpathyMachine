# [DEV-5311] - FPS overlay toggle + hotkey
Icon: tabler:keyboard
Tags: ui, settings, perf
Date: 2026-01-26
Summary: Added a persisted settings toggle and keyboard shortcut for the FPS overlay, still gated by the feature flag.

## Goal
- Make the FPS overlay easy to enable/disable via Settings and a hotkey.

## Scope
- Add a new persisted setting and Settings UI toggle when the feature flag is enabled.
- Add a Cmd/Ctrl+Shift+F shortcut to flip the overlay state.

## Changes
- Added `fpsOverlayEnabled` to settings state + persistence mappings.
- Added i18n strings and a Preferences checkbox for the overlay.
- Wired hotkey handling and overlay visibility to the new setting.

## Files touched
- `frontend/src/App.svelte`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/settings/SettingsApp.svelte`

## Validation
- Not run (UI-only change).

## Notes
- The overlay still requires `fpsOverlay` to be enabled in `config/features.json`.
