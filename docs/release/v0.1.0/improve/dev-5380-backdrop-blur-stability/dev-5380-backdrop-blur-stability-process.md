# [DEV-5380] - Backdrop blur stability
Icon: tabler:blur
Tags: ui, settings, css
Date: 2026-02-01
Summary: Stabilized backdrop blur rendering with a dedicated backdrop layer, rem-based blur settings, and early CSS variable bootstrapping.

## Goal
- Make backdrop blur reliable without blanking the app and align the control to rem-based values.

## Scope
- CSS backdrop layering and settings slider changes.
- Documentation update for Tauri blur limitations.

## Changes
- Rendered a fixed backdrop layer for blur + background color.
- Switched blur values to rem (0–4rem, 0.25rem steps) and updated bootstrap logic.
- Normalized legacy px-based blur values to the new rem range.
- Added a local storage unit marker to avoid mis-reading legacy blur values.
- Documented WebView limitations for OS-level blur.

## Files touched
- `frontend/src/styles/_base.scss`
- `frontend/src/styles/app.scss`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/core/theme.ts`
- `frontend/index.html`
- `docs/knowledge/tauri-window-management.md`

## Validation
- Not run (UI/CSS changes).

## Notes
- True OS wallpaper blur requires native vibrancy; CSS `backdrop-filter` only affects the webview layer.
