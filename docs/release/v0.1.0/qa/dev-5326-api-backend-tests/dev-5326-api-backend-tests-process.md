# [DEV-5326] - API backend auth + health tests
Icon: tabler:test-pipe
Tags: backend, testing
Date: 2026-01-28
Summary: Added unit tests covering GraphQL health/viewer queries and API auth header validation.

## Goal
- Provide baseline coverage for GraphQL read queries and auth gating.

## Scope
- Backend tests for GraphQL schema and API authorization helper.

## Changes
- Added GraphQL schema tests for `viewer` and `health` queries.
- Added auth header tests for valid and invalid tokens.

## Files touched
- `backend/src/api/mod.rs`
- `backend/src/api/schema.rs`
- `docs/process/DEV-5326-api-backend-tests.md`
- `docs/tasks.md`

## Validation
- `cargo fmt --manifest-path backend/Cargo.toml`
- `cargo test --manifest-path backend/Cargo.toml`

## Notes
- Tests use in-memory SQLite + migrations to mirror runtime behavior.
