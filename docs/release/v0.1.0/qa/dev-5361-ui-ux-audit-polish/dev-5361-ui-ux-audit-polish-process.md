# [DEV-5361] - UI/UX audit polish
Icon: tabler:sparkles
Tags: frontend, ui, ux, polish, bits-ui
Date: 2026-01-30
Summary: Audit and refine key UI components with smoother transitions, cleaner patterns, and updated examples in Core UI and Components Godmode.

## Goal
- Improve component transitions, polish UX patterns, and align demo usage with Bits UI recommendations.

## Scope
- Update Tabs, Collapsible, Accordion, Combobox, Checkbox, and Command components (styles + demos).
- Add smoother transitions for common interactive surfaces (dialogs, accordions, collapsibles, hoverable controls).
- Sync component examples between Core UI and Components Godmode.

## Changes
- [x] Added dialog + list item transitions for smoother open/close and hover states.
- [x] Refined Tabs, Collapsible, Accordion, Combobox, Checkbox, Command demos and styles.
- [x] Added a Command launcher in the sidebar secondary navigation.
- [x] Synced Components Godmode examples with Core UI updates.
- [x] Accessibility pass on command palette input labeling and trigger semantics.

## Tracker
- [x] Core UI: tabs/collapsible/accordion/combobox/checkbox demos.
- [x] Components Godmode: preview + code examples refreshed.
- [x] Transitions: dialog + menu/list surfaces.
- [x] Command palette launcher + dialog flow.

## Files touched
- `docs/process/DEV-5361-ui-ux-audit-polish.md`
- `docs/tasks.md`
- `frontend/src/App.svelte`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/core-ui-view.scss`
- `frontend/src/components/component-preview.svelte`
- `frontend/src/components/component-preview.scss`
- `frontend/src/components/components-data.ts`
- `frontend/src/lib/components/ui/dialog/dialog.scss`
- `frontend/src/lib/components/ui/collapsible/collapsible.scss`
- `frontend/src/lib/components/ui/accordion/accordion.scss`
- `frontend/src/lib/components/ui/combobox/combobox.scss`
- `frontend/src/lib/components/ui/checkbox/checkbox.scss`
- `frontend/src/lib/components/ui/command/command.scss`
- `frontend/src/lib/components/ui/tabs/tabs.scss`

## Validation
- Not run (UI-only changes).

## Notes
- Learning: Bits UI trigger child snippets pass `data-slot`, so trigger styling should align with the intended button look.
- Final audit: kept trigger elements native to avoid data-slot collisions with shared Button styles.
