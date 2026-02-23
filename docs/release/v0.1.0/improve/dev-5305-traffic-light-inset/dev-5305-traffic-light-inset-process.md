# [DEV-5305] - Traffic light inset
Icon: tabler:window-maximize
Tags: tauri, window, ux
Date: 2026-01-07
Summary: Adjusted macOS traffic light positioning for a more comfortable inset while keeping overlay titlebars intact.

## Goal
- Move the macOS traffic lights down from the window edge without changing the no-titlebar layout.

## Scope
- Update main window config and JS-created windows to share the same inset.
- Document the updated offsets for future window work.

## Changes
- Increased `trafficLightPosition` offsets for main, settings, and utility windows.
- Documented the shared inset values in the window management knowledge doc.

## Files touched
- `backend/tauri.conf.json`
- `frontend/src/App.svelte`
- `docs/knowledge/tauri-window-management.md`
- `docs/tasks.md`

## Validation
- Not run (config change only).

## Notes
- Keep `trafficLightPosition` values aligned across all windows.
