# [DEV-5356] - Core UI grid + godmode alignment
Icon: tabler:layout-dashboard
Tags: frontend, ui, core-ui
Date: 2026-01-29
Summary: Aligned grid view and Components Godmode with core UI patterns, added a core search field, and surfaced base card usage in the core UI view.

## Plan
- Audit grid view controls against core UI primitives.
- Build missing core UI patterns and apply them to grid view and Godmode.
- Expand Core UI view + Godmode examples and tidy styles.

## Tracker
- [x] Add core search field component and styles.
- [x] Apply core search field to grid view + Godmode.
- [x] Expose base card usage in Core UI view.
- [x] Refresh Godmode previews/examples and spacing polish.

## Goal
- Ensure grid view controls and Components Godmode use core UI primitives wherever possible.

## Scope
- Add missing core UI patterns used by grid view.
- Update grid view and Godmode to use core UI components.
- Keep styles consistent with global core UI tokens.

## Changes
- Added core SearchField component and wired it into grid view and Components Godmode.
- Added base Card to the Core UI view and included card styles in the global core UI stylesheet.
- Updated Godmode examples and preview styles to align with core UI patterns.
- Reused core Badge styling inside grid card status pills.
- Ensured SearchField icon sizing is consistent and hidden from screen readers.
- Mapped grid status tones to Badge variants for clearer state emphasis.

## Files touched
- `frontend/src/lib/components/ui/search-field.svelte`
- `frontend/src/lib/components/ui/search-field.scss`
- `frontend/src/lib/components/ui/card.svelte`
- `frontend/src/styles/_core-ui.scss`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/grid-view.scss`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/components/ComponentsApp.svelte`
- `frontend/src/components/ComponentsApp.scss`
- `frontend/src/components/components-data.ts`
- `frontend/src/components/component-preview.svelte`
- `frontend/src/components/component-preview.scss`
- `frontend/src/lib/components/blocks/scrollable-card.scss`

## Validation
- Not run (recommend `pnpm -C frontend check`).

## Notes
- SearchField styles are centralized in core UI; usage uses a named icon snippet for flexibility.
