# [DEV-5325] - API lab view
Icon: tabler:activity
Tags: frontend, api, ux
Date: 2026-01-28
Summary: Added an API lab view that runs GraphQL sanity checks and surfaces connection state from the local Tauri backend.

## Goal
- Provide a durable, extendable frontend surface for validating API endpoints.

## Scope
- New API lab view and sidebar navigation entry.
- Minimal client-side GraphQL runner using existing Tauri commands.

## Changes
- Added the API lab view with a reusable check runner and status UI.
- Wired new Tauri helpers for API endpoint/token retrieval.
- Expanded i18n keys to cover the new view and statuses.
- Added an e2e smoke test to validate API lab rendering in non-Tauri mode.

## Files touched
- `frontend/src/core/i18n/messages.json`
- `frontend/src/core/views.ts`
- `frontend/src/lib/tauri.ts`
- `frontend/src/views/api-lab-view.svelte`
- `frontend/src/views/api-lab-view.scss`
- `frontend/tests/dashboard.spec.ts`
- `docs/process/DEV-5325-api-lab-view.md`
- `docs/tasks.md`

## Validation
- `pnpm -C frontend check`
- `pnpm -C frontend test:e2e` (fails on this host: Chromium MachPortRendezvousServer permission denied)

## Notes
- User reported a successful e2e run; rerun on a host with proper Chromium permissions to confirm.
