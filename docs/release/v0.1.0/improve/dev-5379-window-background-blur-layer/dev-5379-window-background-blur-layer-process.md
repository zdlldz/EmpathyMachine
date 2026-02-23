# DEV-5379 - Window background blur layer
Icon: tabler:blur
Tags: frontend, css, settings
Date: 2026-02-02
Summary: Move window background blur onto a dedicated background layer so UI content stays sharp while theme-driven opacity and blur still apply.

## Goal
- Ensure window background blur never affects foreground UI content.

## Scope
- Add a dedicated background layer element and move blur styles to it.
- Preserve existing theme variables for background opacity and blur.

## Changes
- Added a fixed background layer element in the app shell.
- Swapped the body pseudo-element blur styles to target the new background layer.

## Files touched
- `frontend/index.html`
- `frontend/src/styles/_base.scss`
- `docs/process/DEV-5379-window-background-blur-layer.md`
- `docs/tasks.md`

## Validation
- Not run (UI change only).

## Notes
- If blur still appears on UI in a specific platform build, inspect compositor/z-index behavior for the WebView host.
