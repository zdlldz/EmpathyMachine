# [DEV-5358] - CI build fixes (svelte-check)
Icon: tabler:checklist
Tags: frontend, ci, svelte-check
Date: 2026-01-29
Summary: Resolved svelte-check failures by adjusting data-slot typing, aria prop typing, and demo link/accordion usage.

## Goal
- Fix the failing CI build by addressing svelte-check errors and warnings.

## Scope
- Update UI wrappers with data-slot metadata to satisfy TypeScript.
- Resolve aria prop typing in FormField.
- Remove invalid demo attributes in Core UI view.

## Changes
- Added slot-aware root prop typing for combobox, date field, date picker, and link preview.
- Typed FormField aria props to match `"true"` literal expectations.
- Replaced demo `href="#"` links with valid hrefs and removed unsupported accordion prop.

## Files touched
- `frontend/src/lib/components/ui/combobox/combobox.svelte`
- `frontend/src/lib/components/ui/date-field/date-field.svelte`
- `frontend/src/lib/components/ui/date-picker/date-picker.svelte`
- `frontend/src/lib/components/ui/link-preview/link-preview.svelte`
- `frontend/src/lib/components/ui/form-field/form-field.svelte`
- `frontend/src/views/core-ui-view.svelte`

## Validation
- Not run (CI logs only).

## Notes
- Svelte-check errors were limited to type definitions and a11y warnings; runtime behavior unchanged.
