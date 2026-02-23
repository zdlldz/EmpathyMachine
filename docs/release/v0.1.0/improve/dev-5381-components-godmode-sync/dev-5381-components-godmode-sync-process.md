# [DEV-5381] - Components Godmode sync
Icon: tabler:layers
Tags: frontend, components, audit
Date: 2026-02-04
Summary: Sync the Components Godmode catalog with core UI wrappers and refresh previews to match current component patterns. Update documentation to reflect the expanded component inventory.

## Goal
- Ensure the Components window reflects the latest core UI component work.

## Scope
- Component registry updates, preview coverage, and docs alignment.
- No runtime behavior changes outside the Components window.

## Changes
- Added missing components (code block, file dropzone, filters panel, form field, loading spinner) to the catalog.
- Expanded preview examples for buttons, badges, labels, and links to match core UI.
- Updated Components Godmode documentation counts and lists.

## Files touched
- `frontend/src/components/components-data.ts`
- `frontend/src/components/component-preview.svelte`
- `frontend/src/components/component-preview.scss`
- `frontend/src/components/README.md`

## Validation
- Not run (manual Components window review recommended).

## Notes
- Follow up with a visual QA pass in the Components window to confirm layout parity.
