# DEV-5301 - Basic Styles
Icon: tabler:window
Tags: tauri, ui, layout
Date: 2026-01-06
Summary: Remove the app-defined menu so windows render edge-to-edge. Keep settings access through the dashboard button.

## Goal
Remove the top menu bar in all windows for a seamless, edge-to-edge UI.

## Scope
- Remove the app menu setup from the Tauri backend.
- Keep Settings available via the UI button (no menu dependency).

## Changes
- Removed custom menu construction and menu event handling.
- Left window config untouched (no titlebar changes).

## Files touched
- `backend/src/main.rs`

## Validation
- `pnpm dev`
- Confirm no menu bar is shown in the window chrome.
- Settings still opens via the dashboard button.

## Notes
- macOS retains the OS-level menu bar; this change removes the app-defined menu.
