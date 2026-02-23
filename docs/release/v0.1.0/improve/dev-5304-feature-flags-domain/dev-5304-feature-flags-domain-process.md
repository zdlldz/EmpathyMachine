# [DEV-5304] - Feature flags and domain scaffolds
Icon: tabler:flag-2
Tags: config, architecture, tooling
Date: 2026-01-06
Summary: Added config-driven feature flags and baseline domain module scaffolds for frontend and backend.

## Goal
- Provide a lightweight, durable feature-flag system and clear domain boundaries.

## Scope
- Config file + sync script generation.
- Domain module directories and guidance docs.

## Changes
- Added `config/features.json` and generated flags for frontend/backend.
- Updated config sync script to emit feature-flag modules.
- Added domain scaffolds in `backend/src/domain/` and `frontend/src/core/`.

## Files touched
- `config/features.json`
- `scripts/sync-config.mjs`
- `frontend/src/lib/feature-flags.ts`
- `backend/src/feature_flags.rs`
- `backend/src/domain/mod.rs`
- `backend/src/domain/README.md`
- `frontend/src/core/README.md`

## Validation
- Not run (recommend `pnpm sync:config`).

## Notes
- Keep feature flags boolean and config-driven to avoid code sprawl.
