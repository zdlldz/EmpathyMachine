# [DEV-5378] - macOS transparent window enablement
Icon: tabler:window
Tags: tauri, macos, window
Date: 2026-02-01
Summary: Enable the macOS private API flag so transparent windows can render translucence when app backgrounds are disabled.

## Goal
- Allow transparent windows to work on macOS so the UI background toggle reveals translucence.

## Scope
- Enable `macOSPrivateApi` in Tauri config.
- Update window management documentation.

## Changes
- Set `app.macOSPrivateApi = true` in `backend/tauri.conf.json`.
- Documented the macOS private API requirement for transparency.

## Files touched
- `backend/tauri.conf.json`
- `docs/knowledge/tauri-window-management.md`
- `docs/process/DEV-5378-macos-transparent-window.md`
- `docs/tasks.md`

## Validation
- Not run (manual QA required on macOS).

## Notes
- Using private APIs means the app cannot be accepted to the Mac App Store.
