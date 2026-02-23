# [DEV-5305] - Theme bootstrap
Icon: tabler:palette
Tags: frontend, theme, ux
Date: 2026-01-07
Summary: Preload theme preference before Svelte mounts to avoid a flash of light mode on startup.

## Goal
- Prevent the white flash before the stored theme preference applies.

## Scope
- Inline theme bootstrap only (no changes to persisted settings).

## Changes
- Added small inline scripts to apply theme + preset before hydration in `index.html`, `settings.html`, and `window.html`.
- Documented the preload hook in theme knowledge notes.

## Files touched
- `frontend/index.html`
- `frontend/settings.html`
- `frontend/window.html`
- `docs/knowledge/theme-presets.md`
- `docs/tasks.md`

## Validation
- Not run (UX polish).
