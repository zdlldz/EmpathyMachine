# DEV-5357 - UI/UX: Audit all components
Icon: tabler:layout-grid
Tags: components, ui, audit
Date: 2026-01-28
Summary: Audited Components Godmode for cleaner layout, added missing Bits UI wrappers, and improved calendar/progress previews. Introduced new component examples and a progress circle variant while updating docs to reflect the current registry.

## Goal
- Ensure Components Godmode defaults match Bits UI expectations with minimal, clear layout and options.

## Scope
- Components window layout and preview styling adjustments.
- New Bits UI wrappers and godmode entries for combobox, date field/picker, meter, rating group, toolbar, and link preview.
- Progress circle variant and calendar/range-calendar layout fixes.
- Components documentation updates.

## Changes
- Replaced card-heavy layout with a shared section template and simplified callouts.
- Added new UI wrappers (combobox, date field, date picker, link preview, meter, rating group, toolbar) plus progress circle.
- Expanded godmode examples with configuration variants and updated calendar/range-calendar previews.
- Updated Components Godmode docs and component counts.
- Added accessibility labels for progress/meter previews and vertical toolbar styling support.
- Refined combobox preview state handling, guarded progress circle labels for indeterminate values, and aligned new index exports with repo tab styling.
- Adjusted new Bits UI wrappers to match current prop typings (children/ref binding) and typed preview snippets to resolve svelte-check failures.

## Files touched
- `frontend/src/components/ComponentsApp.svelte`
- `frontend/src/components/ComponentsApp.scss`
- `frontend/src/components/component-section.svelte`
- `frontend/src/components/component-preview.svelte`
- `frontend/src/components/component-preview.scss`
- `frontend/src/components/components-data.ts`
- `frontend/src/components/README.md`
- `frontend/src/lib/components/ui/combobox/*`
- `frontend/src/lib/components/ui/date-field/*`
- `frontend/src/lib/components/ui/date-picker/*`
- `frontend/src/lib/components/ui/link-preview/*`
- `frontend/src/lib/components/ui/meter/*`
- `frontend/src/lib/components/ui/progress/*`
- `frontend/src/lib/components/ui/rating-group/*`
- `frontend/src/lib/components/ui/toolbar/*`

## Validation
- Not run (manual audit only; UI review recommended in Components Godmode).

## Notes
- Consider running frontend checks after visual validation.
