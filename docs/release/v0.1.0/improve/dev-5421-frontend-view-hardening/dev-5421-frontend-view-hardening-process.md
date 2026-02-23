# [DEV-5421] - Frontend View Hardening
Icon: tabler:shield-check
Tags: frontend, svelte, a11y, i18n, performance, refactor
Date: 2026-02-14
Summary: Completed a methodical hardening pass across API Lab, Connections, Grid, Prompts, and Core UI views. The work eliminates duplicated GraphQL contracts, improves accessibility semantics, reduces style duplication, and splits the Core UI monolith into smaller sections while preserving behavior.

## Goal
- Close the adversarial frontend audit backlog with production-safe, low-risk changes.

## Scope
- Included: DRY refactors, accessibility fixes, i18n expansion, view componentization, and frontend quality gates.
- Excluded: backend command/runtime changes and non-view design overhauls.

## Audit closure checklist
- [x] Shared GraphQL contracts/helpers extracted for API Lab + Connections.
- [x] Connections view aligned to canonical `app-view` layout utilities.
- [x] Repeated note/meta/value text styles centralized in shared app utilities.
- [x] Core UI collapsible trigger aligned to canonical `Button` usage.
- [x] Core UI hardcoded user-facing copy moved to i18n.
- [x] Grid table variant accessibility semantics corrected (single owning grid semantics, no nested role conflicts).
- [x] Date formatter allocation moved off hot row loops.
- [x] Core UI split into smaller section components.
- [x] Prompts panel status/error/success messages use live region semantics.
- [x] Layout and datatable utility patterns documented in knowledge docs.

## Changes
- Finished shared connections client extraction in `frontend/src/core/connections-client.ts` and migrated `api-lab-view` + `connections-view` to consume shared contracts/helpers.
- Added shared query helpers (`fetchConnectionTypes`, `fetchConnections`) and normalized mutation payload handling via `resolvePayload`.
- Removed duplicated `connections-view` GraphQL/type definitions and local config helper logic.
- Added ARIA table semantics for table-variant grid headers/rows/cells and row/column indexing in `grid-view`.
- Cached date formatters in `grid-view` and `connections-view` to avoid per-row formatter instantiation.
- Simplified grid layout synchronization effects by removing extra initialization guards.
- Added live region semantics to prompts panel status messages (`role=status` / `role=alert`, `aria-live`).
- Centralized repeated text styles into shared app utilities (`.app-note`, `.app-meta`, `.app-value`, `.app-value--caps`).
- Centralized datatable container surface styles via `.app-datatable-surface` and reused them across views.
- Removed duplicate `app-view__content` style override from `connections-view.scss`.
- Split `core-ui-view` into reusable section components:
  - `frontend/src/views/core-ui-sections/core-ui-static-sections.svelte`
  - `frontend/src/views/core-ui-sections/core-ui-disclosure-sections.svelte`
- Replaced collapsible custom trigger styling path with canonical `Button` usage and localized expand/collapse labels.
- Expanded Core UI i18n coverage across forms, filters, checkboxes, datatable labels, and section headings.

## Files touched
- `frontend/src/core/connections-client.ts`
- `frontend/src/views/api-lab-view.svelte`
- `frontend/src/views/api-lab-view.scss`
- `frontend/src/views/connections-view.svelte`
- `frontend/src/views/connections-view.scss`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/prompts-panel.svelte`
- `frontend/src/lib/components/blocks/scrollable-grid.svelte`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/core-ui-view.scss`
- `frontend/src/views/core-ui-sections/core-ui-static-sections.svelte`
- `frontend/src/views/core-ui-sections/core-ui-disclosure-sections.svelte`
- `frontend/src/views/dashboard-view.svelte`
- `frontend/src/views/dashboard-view.scss`
- `frontend/src/styles/app.scss`
- `frontend/src/core/i18n/messages.json`
- `docs/knowledge/view-layout.md`

## Validation
- `pnpm -C frontend check`
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend test:e2e`
- `pnpm -C frontend build`
- `cargo fmt --manifest-path backend/Cargo.toml -- --check`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `cargo test --manifest-path backend/Cargo.toml`
- `pnpm cli:docs`

## Notes
- Locale additions were applied consistently to all existing locales to keep i18n key parity intact.
- Existing unrelated CLI rename/database fixes from DEV-5420 remain in this working tree and were not reverted.

## Final sanity pass
- Reworked table-mode semantics so `grid-view` owns ARIA grid roles while `ScrollableGrid` can run in `presentation` mode for table rendering paths.
- Hardened `connections-view` datatable column refresh behavior to update all translated headers/actions when locale labels change.
- Removed leftover view-specific text utility class usage in dashboard markup in favor of shared `app-*` utilities.
- Re-ran full release gates (`fmt`, `clippy -D warnings`, backend tests, frontend check/i18n/e2e/build, and CLI docs generation) with all checks passing.
