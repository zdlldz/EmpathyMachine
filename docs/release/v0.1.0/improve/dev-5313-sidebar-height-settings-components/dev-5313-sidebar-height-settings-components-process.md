# [DEV-5313] - Sidebar height clamp in aux windows
Icon: tabler:layout-sidebar
Tags: layout, ui
Date: 2026-01-26
Summary: Clamp the window shell to the viewport height so sidebar columns stop stretching to content height in Settings/Components windows.

## Goal
- Keep sidebars constrained to the window height (minus shell gap) even when main content is tall.

## Scope
- Layout CSS only; no component structure changes.

## Changes
- Fixed the window shell height to 100svh to ensure content scrolls instead of stretching the shell.

## Files touched
- `frontend/src/styles/app.scss`

## Validation
- Not run (CSS-only change).

## Notes
- This aligns Settings/Components window behavior with the main window’s constrained shell height.
