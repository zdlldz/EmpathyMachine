# [DEV-5356] - Core UI consolidation
Icon: tabler:layout-grid
Tags: frontend, ui, core-ui
Date: 2026-01-29
Summary: Consolidated core UI primitives into global styles, added new core components, and introduced a Core UI view for auditing default states.

## Goal
- Provide a minimal, global Core UI layer with a dedicated view for default component rendering.

## Scope
- Add/adjust core UI components and styles listed in DEV-5356.
- Register a Core UI view and sidebar entry.
- Update docs and component registry as needed.

## Changes
- Added global Core UI stylesheet with typography defaults and centralized component SCSS imports.
- Scoped default anchor/list spacing to avoid impacting UI chrome elements.
- Introduced new core UI primitives: link, form field (required + validation), file dropzone, and loading spinner.
- Tuned core inputs (radio, toggle group, select/combobox) for segmented styles and validation states.
- Adjusted `FormField` to avoid invalid `required` attributes on non-input components while preserving aria-required.
- Added Core UI view + sidebar entry, plus i18n updates for navigation/breadcrumbs.
- Updated Components Godmode entries for button/label/toggle-group variants and new link component.

## Files touched
- `frontend/src/styles/_core-ui.scss`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/core-ui-view.scss`
- `frontend/src/core/views.ts`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/lib/components/ui/`
- `frontend/src/components/components-data.ts`

## Validation
- Not run (recommend `pnpm -C frontend check` and `pnpm -C frontend test:e2e`).

## Notes
- Highlighter confirmed via existing `CodeBlock` (Shiki) component; styles moved to global SCSS.
- File dropzone uses Tauri `plugin-dialog` when available, with drag/drop fallback for browser file metadata.

## Audit
- 2026-01-29: Reviewed core UI view, global styles, and new primitives for accessibility and wiring. No additional changes required.
