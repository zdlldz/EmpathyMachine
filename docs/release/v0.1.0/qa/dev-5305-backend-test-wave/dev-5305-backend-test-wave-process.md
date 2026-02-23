# [DEV-5305] - Backend test wave (settings + commands)
Icon: tabler:clipboard-list
Tags: testing, backend, rust
Date: 2026-01-07
Summary: Expanded backend unit tests for settings/window state round-trips and avatar extension validation, and updated test documentation.

## Goal
- Strengthen backend coverage for settings persistence and avatar validation.

## Scope
- Add unit tests in `backend/src/db.rs` and `backend/src/commands.rs`.
- Update testing knowledge doc with the new tests.

## Changes
- Added settings empty/update and window state update cases.
- Added normalize extension validation tests for avatar uploads.
- Documented current backend tests in the testing knowledge base.

## Files touched
- `backend/src/db.rs`
- `backend/src/commands.rs`
- `docs/knowledge/testing.md`

## Validation
- `cargo test --manifest-path backend/Cargo.toml`

## Notes
- Command integration tests still require a Tauri app handle; keep them as a follow-up.
