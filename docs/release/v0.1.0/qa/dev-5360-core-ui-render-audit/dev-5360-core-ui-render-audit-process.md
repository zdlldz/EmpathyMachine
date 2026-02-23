# DEV-5360 - Core UI render audit
Icon: tabler:layout-dashboard
Tags: ui, svelte, runes, audit
Date: 2026-01-30
Summary: Audited core UI rendering issues after the component merge, updated runes-compliant dynamic rendering, and aligned Bits UI wrappers with Svelte 5 bind rules to prevent runtime freezes.

## Goal
- Restore Core UI navigation by fixing Svelte 5 runes warnings and runtime binding errors.

## Scope
- Core UI view rendering and Bits UI wrapper defaults.
- No layout redesigns or new component additions.

## Plan
- Inspect the core UI view for runes deprecations and runtime errors.
- Align component wrappers with Svelte 5 bind requirements.
- Validate the view renders without freezing.

## Tracker
- [x] Locate deprecated dynamic component usage in Core UI view.
- [x] Fix bindable defaults for Bits UI wrappers with `open` fallback.
- [x] Validate Svelte checks pass after audit adjustments.

## Changes
- Replaced deprecated `<svelte:component>` usage with runes-friendly dynamic component tags.
- Set `open` bindables to a concrete default where Bits UI supplies a fallback value.
- Added missing theme preset label typing to satisfy Svelte check after theme preset expansion.

## Files touched
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/dashboard-view.svelte`
- `frontend/src/lib/components/ui/combobox/combobox.svelte`
- `frontend/src/lib/components/ui/date-picker/date-picker.svelte`
- `frontend/src/lib/components/ui/link-preview/link-preview.svelte`
- `docs/process/DEV-5360-core-ui-render-audit.md`
- `docs/tasks.md`

## Validation
- `pnpm -C frontend check`

## Notes
- Takeaway: Svelte 5 disallows `bind:open` when the bound value is `undefined` and the child prop has a fallback; set a concrete default in wrappers.
