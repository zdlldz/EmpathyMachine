# [DEV-5316] - API dev kit phase 0
Icon: tabler:database
Tags: backend, api, migrations
Date: 2026-01-27
Summary: Establish the initial database schema, migrations, and shared types for the API dev kit backend.

## Goal
- Land the phase 0 foundation: migrations, core tables, and shared utilities.

## Scope
- Add SQLx migrations for core tables.
- Replace ad-hoc schema init with the migrator.
- Add shared types for IDs/time/error.

## Changes
- Created migrations for core app + API tables.
- Wired sqlx migrator into DB setup and tests.
- Added shared type scaffolding for UUIDv7/time/errors.
- Updated storage ADR to note embedded migrations.
- Added byte-slice conversion helpers for shared IDs.

## Files touched
- `backend/migrations/0001_init.sql`
- `backend/src/db.rs`
- `backend/src/shared/mod.rs`
- `backend/src/shared/ids.rs`
- `backend/src/shared/time.rs`
- `backend/src/shared/error.rs`
- `backend/Cargo.toml`
- `docs/decisions/ADR-0001-storage-sqlx.md`
- `docs/process/DEV-5316-api-dev-kit-phase-0.md`
- `docs/tasks.md`

## Validation
- Not run (setup change only).

## Notes
- Migrations are embedded via `sqlx::migrate!` for Tauri packaging safety.
- Change log helper shipped in Phase 1 to keep Phase 0 limited to schema + types.
