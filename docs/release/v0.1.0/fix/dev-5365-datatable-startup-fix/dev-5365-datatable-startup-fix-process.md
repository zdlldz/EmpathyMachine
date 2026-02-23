# [DEV-5365] - Datatable startup fix
Icon: tabler:table
Tags: frontend, svelte, a11y
Date: 2026-01-30
Summary: Fix the datatable startup error from invalid const placement and modernize event handling for Svelte 5. Improve keyboard focus behavior for headers and edit inputs.

## Goal
- Restore dev startup by removing the invalid Svelte const placement error.
- Align datatable event handling with Svelte 5 conventions.

## Scope
- Datatable render + header interactions.
- Editing focus behavior for inline cell editing.

## Changes
- Replace top-level {@const} usage with a derived value in the render helper.
- Switch event bindings to Svelte 5 event attributes and add keyboard activation for header sorting.
- Focus edit inputs via $effect instead of autofocus.

## Files touched
- `frontend/src/lib/components/blocks/datatable-render.svelte`
- `frontend/src/lib/components/blocks/datatable.svelte`

## Validation
- Not run (manual verification pending).

## Notes
- Follow-up: run frontend check suite when convenient.
