# [DEV-5317] - API dev kit phase 1
Icon: tabler:layers-subtract
Tags: backend, api, domain
Date: 2026-01-27
Summary: Build domain and repository scaffolding with tenant-scoped access, document concurrency guards, job leasing helpers, and rate-limit primitives.

## Goal
- Implement Phase 1 core: tenant-scoped repos, document domain services, job leasing helpers, and rate-limit primitives.

## Scope
- Add repository helpers for tenants/users/memberships/documents/changes/jobs.
- Add domain services and error types for documents.
- Add rate-limit primitives for per-tenant enforcement.

## Changes
- Added tenant-scoped repositories for core entities, documents, changes, and jobs.
- Added document domain services with optimistic concurrency + change log writes.
- Added per-tenant rate-limit primitives with token bucket defaults.
- Added domain error + model types for shared use.
- Documented phase 0 note on change helper timing.

## Files touched
- `backend/src/db.rs`
- `backend/src/db/changes.rs`
- `backend/src/db/documents.rs`
- `backend/src/db/jobs.rs`
- `backend/src/db/memberships.rs`
- `backend/src/db/tenants.rs`
- `backend/src/db/users.rs`
- `backend/src/domain/documents.rs`
- `backend/src/domain/error.rs`
- `backend/src/domain/mod.rs`
- `backend/src/domain/models.rs`
- `backend/src/domain/rate_limit.rs`
- `docs/process/DEV-5316-api-dev-kit-phase-0.md`
- `docs/process/DEV-5317-api-dev-kit-phase-1.md`
- `docs/tasks.md`

## Validation
- Not run (in progress).

## Notes
- Will update as work lands.
