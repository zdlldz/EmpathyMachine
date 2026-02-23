# [DEV-5319] - API dev kit phase 3
Icon: tabler:broadcast
Tags: backend, api, jobs, subscriptions
Date: 2026-01-27
Summary: Wire change events and GraphQL subscriptions, plus job runtime scaffolding for durable background work.

## Goal
- Implement subscription fan-out from the changes table and lay job worker runtime foundations.

## Scope
- Add event bus for change notifications.
- Add GraphQL subscription support with replay via change cursor.
- Add job runtime skeleton for leasing + processing (if time permits).

## Changes
- Added an in-memory event bus and change broadcasting after mutations.
- Added GraphQL subscriptions with replay-from-cursor support.
- Added job runner scaffolding with leasing + retry backoff.
- Added change feed query helper for subscription replay.

## Files touched
- `backend/Cargo.toml`
- `backend/src/api/mod.rs`
- `backend/src/api/schema.rs`
- `backend/src/bin/wry_smoke.rs`
- `backend/src/commands.rs`
- `backend/src/db/changes.rs`
- `backend/src/db/jobs.rs`
- `backend/src/domain/documents.rs`
- `backend/src/events/mod.rs`
- `backend/src/jobs/mod.rs`
- `backend/src/main.rs`
- `docs/process/DEV-5319-api-dev-kit-phase-3.md`
- `docs/tasks.md`

## Validation
- Not run (in progress).

## Notes
- Jobs runtime work may continue in a follow-up phase if time runs short.
