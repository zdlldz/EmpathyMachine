# [DEV-5375] - Misc UI polish
Icon: tabler:sparkles
Tags: frontend, ui, polish
Date: 2026-01-31
Summary: Tighten sidebar navigation, relocate UI demos into Core UI, and polish grid controls, menus, and transitions for a cleaner, more compact experience.

## Goal
- Simplify sidebar navigation and labels while keeping essential actions accessible.
- Consolidate demo menu actions into the Core UI view.
- Polish grid toolbar controls, icon-only buttons, and transitions.

## Scope
- Sidebar nav structure + labels in the main app.
- Core UI view demo section additions.
- Grid toolbar spacing, buttons, sorting, and hover polish.
- Accordion/Collapsible transition behavior.

## Progress
- [x] Document task + index entry.
- [x] Update sidebar navigation + Core UI demo section.
- [x] Polish grid toolbar controls + icon-only button sizing.
- [x] Fix accordion/collapsible transitions.
- [x] Final review + notes.

## Changes
- Removed header/title blocks from main sidebars, trimmed labels, and rebalanced left/right nav contents.
- Moved menu/demo actions into Core UI with shared app actions context.
- Tightened grid toolbar controls, reduced search expansion, and fixed sort selection binding.
- Enforced square icon-only buttons with shared sizing tokens.
- Rebuilt accordion/collapsible content mounting with Svelte transitions and shared timing.
- Reduced Settings panel typography to match menu scale.

## Files touched
- `docs/process/DEV-5375-misc-ui-polish.md`
- `docs/tasks.md`
- `frontend/src/App.svelte`
- `frontend/src/core/app-actions.ts`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/lib/components/ui/button/button.scss`
- `frontend/src/views/grid-view.scss`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/lib/components/ui/accordion/accordion-content.svelte`
- `frontend/src/lib/components/ui/accordion/accordion.scss`
- `frontend/src/lib/components/ui/collapsible/collapsible-content.svelte`
- `frontend/src/lib/components/ui/collapsible/collapsible.scss`
- `frontend/src/lib/components/ui/transitions.ts`
- `frontend/src/settings/SettingsApp.scss`

## Validation
- Not run (not requested).

## Notes
- Bits UI accordion/collapsible transitions now use `forceMount` + `child` snippets with `slide` for reliable Svelte 5 animations.
