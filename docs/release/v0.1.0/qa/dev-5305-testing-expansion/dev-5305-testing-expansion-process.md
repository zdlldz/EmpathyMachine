# [DEV-5305] - Testing expansion (frontend + backend)
Icon: tabler:clipboard-list
Tags: testing, playwright, rust
Date: 2026-01-07
Summary: Expanded E2E coverage for the dashboard and settings UX, added backend SQLite round-trip tests, and updated testing guidance across agents and docs.

## Goal
- Expand the test suite with durable coverage for sidebar and theme controls, plus baseline backend storage round-trips.

## Scope
- Frontend Playwright tests for sidebar toggle and settings theme controls.
- Backend unit tests for settings + window state persistence using an in-memory SQLite pool.
- Documentation updates to keep test guidance discoverable.

## Changes
- Added Playwright coverage for sidebar collapse and theme preset/mode updates.
- Added backend tests for settings and window state round-trips.
- Updated testing knowledge doc and agent guides with the test index.

## Files touched
- `frontend/tests/dashboard.spec.ts`
- `backend/src/db.rs`
- `docs/knowledge/testing.md`
- `agents.md`
- `backend/agents.md`

## Validation
- `pnpm -C frontend test:e2e` (after Playwright install)
- `cargo test --manifest-path backend/Cargo.toml`

## Notes
- Playwright requires `pnpm -C frontend exec playwright install` on new machines.
