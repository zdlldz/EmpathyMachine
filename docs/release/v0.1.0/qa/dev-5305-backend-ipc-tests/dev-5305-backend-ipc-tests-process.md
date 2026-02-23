# [DEV-5305] - Backend IPC tests (tauri::test)
Icon: tabler:clipboard-list
Tags: testing, backend, tauri
Date: 2026-01-07
Summary: Added Tauri IPC integration tests for backend commands and updated agent/testing documentation.

## Goal
- Validate backend command wiring through the Tauri IPC layer.

## Scope
- IPC integration tests for settings + export database commands.
- Documentation updates for the test suite.

## Changes
- Added IPC tests for settings commands using `tauri::test::mock_builder` + `get_ipc_response`.
- Enabled the `tauri` `test` feature via dev-dependencies for IPC testing.
- Exposed `db::init_schema` as `pub(crate)` for shared in-memory test pools.
- Documented new tests in the testing knowledge base.
- Updated root, backend, and frontend agent guides with testing coverage.

## Files touched
- `backend/Cargo.toml`
- `backend/src/commands.rs`
- `backend/src/db.rs`
- `docs/knowledge/testing.md`
- `agents.md`
- `backend/agents.md`
- `frontend/agents.md`

## Validation
- `cargo test --manifest-path backend/Cargo.toml`

## Notes
- IPC tests use a unique test identifier to isolate app data directories.
