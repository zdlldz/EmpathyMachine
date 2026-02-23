# [DEV-5309] - Styles audit tracker
Icon: tabler:list-check
Tags: frontend, styling, scss, tracker
Date: 2026-01-18
Summary: Task tracker for the componentized SCSS migration and cleanup.

## Goal
- Track progress for the per-component styling migration and cleanup.

## Scope
- Frontend SCSS + UI wrapper styles.
- Docs updates and testing notes.

## Changes
- Tracker created.
- Updated checklist progress after SCSS migration work.
- Recorded SCSS nesting + DRY pass progress.

## Files touched
- `docs/process/DEV-5309-styles-audit-tracker.md`

## Validation
- `pnpm -C frontend build` (pass)
- `pnpm -C frontend check` (pass)
- `pnpm -C frontend test:e2e` (pass)

## Checklist
- [x] Phase 0: Capture current CSS size per entrypoint (main/settings/window/components).
- [x] Phase 1: Add SCSS mixins + breakpoints; update tokens/presets split.
- [x] Phase 1: Update README + agents guide + style docs.
- [x] Phase 2: Co-locate app block (BEM) styles into owning components.
- [x] Phase 3: Migrate Bits UI primitives into per-component styles.
- [x] Phase 4: Remove monolithic `_components.scss` from build.
- [x] Phase 5: Audit unused globals + polish.
- [x] Phase 6: Update tests/notes for CSS wiring verification.
- [x] Post-validation: Run `pnpm -C frontend test:e2e` on a full macOS host or with non-headless-shell Chromium.

## SCSS nesting + DRY pass (complete)
Goal: adopt scoped, low-risk SCSS nesting where it improves clarity without increasing selector specificity.

Completed phases:
- [x] Define nesting conventions (1 level max, BEM-friendly, avoid deep nesting).
- [x] App blocks: convert flat BEM selectors to `&__`/`&--` nesting (e.g. titlebar, close-button, sidebar-brand).
- [x] UI component styles: keep `:where()` specificity intact via `@mixin where` + `@mixin slot`.
- [x] Update docs with the nesting convention and examples.
- [ ] Re-run `pnpm -C frontend build` + Playwright to confirm no regressions.

## Status update (2026-01-19)
- Added `@mixin where` and `@mixin slot` to keep low-specificity selectors DRY.
- Converted app blocks to nested BEM and normalized `data-slot` selectors in UI component styles.
- Documented conventions in `frontend/src/styles/README.md`; validation still pending.

## Validation update (2026-01-19)
- Build/check/E2E completed.

## Follow-up fix (2026-01-19)
- Aligned Playwright `webServer` port/baseURL with Vite (`1234`) in `frontend/playwright.config.ts`.
- Updated Playwright dashboard/styles wiring tests to seed tabs and target current UI structure.
