# [DEV-5318] - API dev kit phase 2
Icon: tabler:api
Tags: backend, api, graphql
Date: 2026-01-27
Summary: Add the initial GraphQL server, schema/resolvers, auth token handoff, and API bootstrap wiring.

## Goal
- Deliver the Phase 2 GraphQL API foundation with auth gating and request context.

## Scope
- Add async-graphql + axum server wiring.
- Add GraphQL schema for viewer/tenant/documents + document mutations.
- Add auth token + endpoint commands and permissions.
- Bootstrap a default tenant/user for local-first usage.

## Changes
- Added GraphQL server + schema scaffolding with viewer, tenant, documents, and document mutations.
- Added auth token state + IPC commands for endpoint/token handoff.
- Added local bootstrap to ensure a default tenant/user/membership.
- Added shared hashing utility and ID string conversions.
- Added permissions for the new IPC commands.

## Files touched
- `backend/Cargo.toml`
- `backend/permissions/app.toml`
- `backend/src/api/context.rs`
- `backend/src/api/mod.rs`
- `backend/src/api/schema.rs`
- `backend/src/auth/mod.rs`
- `backend/src/bin/wry_smoke.rs`
- `backend/src/commands.rs`
- `backend/src/domain/bootstrap.rs`
- `backend/src/domain/mod.rs`
- `backend/src/db/memberships.rs`
- `backend/src/db/tenants.rs`
- `backend/src/db/users.rs`
- `backend/src/main.rs`
- `backend/src/shared/hash.rs`
- `backend/src/shared/ids.rs`
- `backend/src/shared/mod.rs`
- `docs/process/DEV-5318-api-dev-kit-phase-2.md`
- `docs/tasks.md`

## Validation
- Not run (in progress).

## Notes
- Subscriptions and job progress streaming are deferred to Phase 3.
