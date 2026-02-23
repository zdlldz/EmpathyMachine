# [DEV-5320] - API dev kit phase 4
Icon: tabler:shield-check
Tags: backend, api, admin
Date: 2026-01-27
Summary: Add admin/debug GraphQL surface for jobs and health snapshots.

## Goal
- Provide admin visibility into job queues and basic health signals.

## Scope
- Add GraphQL queries for jobs + health snapshot.
- Add admin mutations for cancel/retry job controls.

## Changes
- Added admin job listing + health snapshot queries.
- Added cancel/retry job mutations for debug control.

## Files touched
- `backend/src/api/schema.rs`
- `backend/src/db/jobs.rs`
- `docs/process/DEV-5320-api-dev-kit-phase-4.md`
- `docs/tasks.md`

## Validation
- Not run (in progress).

## Notes
- Admin access is currently local-only; role gates can be added when auth expands.
