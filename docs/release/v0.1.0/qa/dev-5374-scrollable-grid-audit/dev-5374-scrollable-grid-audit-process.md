# [DEV-5374] - Scrollable grid audit
Icon: tabler:table
Tags: frontend, datatable, virtualization, ux
Date: 2026-01-31
Summary: Audit the datatable scroll rendering path and stabilize virtualization measurements for more reliable initial paint and scroll behavior.

## Goal
- Ensure the scrollable grid renders consistently on load and during long scrolls.
- Improve virtualization math for sticky headers and layout changes.

## Scope
- Datatable scroll/viewport math and observer sync.
- No new dependencies or API changes.

## Plan
- Review virtualization + scroll math for sticky header offsets.
- Ensure initial viewport metrics are synced without requiring scroll.
- Validate scroll-to-row behavior with sticky header enabled.

## Tracker
- [x] Audit scroll math + header offsets.
- [x] Add scroll metric sync on mount/resize.
- [x] Align scroll-to-row offsets with sticky header behavior.
- [x] Run frontend checks when convenient (failed: missing node_modules).

## Changes
- Sync scroll metrics via rAF to keep viewport + scroll state in lockstep.
- Correct sticky header scroll math for visible range and scroll-to-row alignment.

## Files touched
- `frontend/src/lib/components/blocks/datatable.svelte`
- `docs/process/DEV-5374-scrollable-grid-audit.md`

## Validation
- `pnpm -C frontend check` (fails: `svelte-check` missing; install deps).

## Notes
- Sticky headers should use raw scrollTop for visible-range math to avoid delayed row updates.
