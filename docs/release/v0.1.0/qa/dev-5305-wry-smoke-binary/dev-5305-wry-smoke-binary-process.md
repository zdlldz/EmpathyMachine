# [DEV-5305] - Wry smoke binary
Icon: tabler:clipboard-list
Tags: testing, backend, tauri
Date: 2026-01-07
Summary: Added a Wry smoke binary to validate AppHandle command flows on the main thread, plus documentation updates.

## Goal
- Provide a macOS-friendly Wry smoke check for AppHandle commands without over-engineering.

## Scope
- New `wry_smoke` binary that runs on the main thread and validates avatar + export flows.
- Documentation updates to point to the manual smoke command.

## Changes
- Added `backend/src/bin/wry_smoke.rs` for manual AppHandle smoke checks.
- Disabled test harness for the smoke binary to avoid duplicate test runs.
- Set `default-run = "starter"` in `backend/Cargo.toml` to keep `tauri dev` working with multiple bins.
- Documented the smoke command and rationale in testing docs and agent guides.
- Added README entry for the smoke command.

## Files touched
- `backend/Cargo.toml`
- `backend/src/bin/wry_smoke.rs`
- `docs/knowledge/testing.md`
- `agents.md`
- `backend/agents.md`
- `frontend/agents.md`
- `README.md`

## Validation
- `cargo run --manifest-path backend/Cargo.toml --bin wry_smoke`

## Notes
- Uses a unique identifier per run to avoid touching real app data directories.
