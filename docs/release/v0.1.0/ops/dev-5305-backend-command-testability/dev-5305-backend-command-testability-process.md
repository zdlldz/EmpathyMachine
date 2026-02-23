# [DEV-5305] - Backend command testability
Icon: tabler:clipboard-list
Tags: testing, backend, tauri
Date: 2026-01-07
Summary: Refactored AppHandle commands to testable helpers and added filesystem-based unit tests; documented the long-term backend testing strategy.

## Goal
- Make AppHandle-dependent command logic testable without the Wry runtime.

## Scope
- Extract helper functions for avatar saving and database export.
- Add unit tests for helper functions using temp directories.
- Update testing documentation and agent guidance.

## Changes
- Added `save_avatar_impl` + `export_database_impl` helpers and tests.
- Added temp-dir helper utilities in command tests.
- Added Wry AppHandle smoke tests for avatar save + database export.
- Documented backend testing strategy for AppHandle/IPC coverage.
 - Marked Wry smoke tests ignored on macOS (EventLoop main-thread constraint).

## Files touched
- `backend/src/commands.rs`
- `docs/knowledge/testing.md`
- `agents.md`
- `backend/agents.md`
- `frontend/agents.md`

## Validation
- `cargo test --manifest-path backend/Cargo.toml`

## Notes
- Wry-runtime integration tests remain optional and can be added only when required.
