# [DEV-5372] - Core/API: Connections
Icon: tabler:plug
Tags: backend, api, frontend, connections
Date: 2026-01-30
Summary: Define a durable connections model, plugin registry, and GraphQL surface, plus a minimal connections UI scaffold for creating and listing connection records.

## Goal
- Establish a core connections API with plugin metadata and durable storage, ready for future sync/process work.

## Scope
- Backend: connection data model, DB tables, domain logic, plugin registry, GraphQL queries/mutations, change events.
- Frontend: connections view with dynamic form driven by plugin metadata and a datatable listing.
- Excludes: real third-party integrations, sync execution, and full ops orchestration.

## Plan
- Review existing API/dev kit patterns and data model expectations.
- Add connection storage + domain logic with change log integration.
- Expose connection types + CRUD/validate via GraphQL.
- Build minimal connections view (form + table) wired to GraphQL.
- Document open questions and learnings.

## Tracker
- [x] Complete discovery on backend + frontend patterns.
- [x] Implement backend connections model + migrations.
- [x] Add GraphQL schema + domain wiring.
- [x] Build connections view scaffold + form.
- [x] Update docs/tasks + record learnings.

## Changes
- Added connection storage, domain logic, and plugin registry with validation + change log events.
- Extended GraphQL schema with connection types, CRUD, validation, and subscriptions.
- Added connections UI with dynamic form + datatable list, action buttons, plus shared GraphQL client helper.
- Updated navigation + i18n labels for the new Connections view.
- Added API lab checks for connection types and lifecycle (create/validate/archive).
- Added local connection types (file system, SQLite) and queued secret storage for roadmap.

## Files touched
- `backend/migrations/0002_connections.sql`
- `backend/src/api/schema.rs`
- `backend/src/db.rs`
- `backend/src/db/connections.rs`
- `backend/src/domain/connections.rs`
- `backend/src/domain/mod.rs`
- `backend/src/domain/models.rs`
- `docs/process/DEV-5372-core-api-connections.md`
- `docs/tasks.md`
- `frontend/src/core/api-client.ts`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/core/views.ts`
- `frontend/src/views/api-lab-view.svelte`
- `frontend/src/views/connections-actions.svelte`
- `frontend/src/views/connections-view.scss`
- `frontend/src/views/connections-view.svelte`
- `docs/knowledge/testing.md`
- `docs/roadmap.md`

## Validation
- `cargo test --manifest-path backend/Cargo.toml`
- `pnpm -C frontend check` (failed: `svelte-check` missing; install deps before rerun).

## Notes
- Resolved: connections include local file and local database sources (added local plugins).
- Open questions: confirm whether connection types should be user-extendable at runtime (vs static registry).
- Learnings: current plugin registry pattern is static; plan for runtime-loaded plugin sources if needed later.
- Roadmap: move connection secrets to OS keychain and store references in SQLite.
