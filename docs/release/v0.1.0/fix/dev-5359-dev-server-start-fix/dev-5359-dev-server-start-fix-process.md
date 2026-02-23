# [DEV-5359] - Dev server first-start fixes
Icon: tabler:bug
Tags: frontend, devserver, fix
Date: 2026-01-30
Summary: Fixed first-start dev server errors by restoring SCSS mixin usage and replacing an invalid Svelte component class directive.

## Goal
- Clear the initial frontend build errors seen on `pnpm dev`.

## Scope
- Frontend SCSS mixin import and Svelte component class binding.
- No backend or config changes.

## Changes
- Added the missing `mixins` import for the search field styles.
- Replaced a `class:` directive on a component with a computed class string.

## Files touched
- `frontend/src/lib/components/ui/search-field.scss`
- `frontend/src/lib/components/ui/checkbox/checkbox.svelte`
- `docs/process/DEV-5359-dev-server-start-fix.md`
- `docs/tasks.md`

## Validation
- Not run (dev server not started).

## Notes
- `svelte-autofixer` was not available in this environment.
