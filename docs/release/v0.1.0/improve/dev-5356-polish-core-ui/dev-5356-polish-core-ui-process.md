# [DEV-5356] - Polish core UI
Icon: tabler:brush
Tags: frontend, ui, core-ui
Date: 2026-01-29
Summary: Polished core UI primitives and the core UI view to improve spacing, hover states, and component variants while tightening accessibility and visual consistency.

## Plan
- Audit core UI styles and the core UI view against the polish checklist.
- Update shared tokens/components for spacing, states, and motion.
- Expand core UI view examples for variants and icon usage.

## Tracker
- [x] Update typography, links, lists, and code defaults.
- [x] Refine button, badge, and label sizing/hover states.
- [x] Tune form control visuals and interaction states.
- [x] Expand core UI view demos and update task tracking.

## Goal
- Refine core UI defaults and preview variants for clarity, consistency, and accessibility.

## Scope
- Update core UI typography, buttons, links, lists, and code presentation.
- Tune form controls, toggle patterns, and select/combobox dropdown behavior.
- Expand core UI view examples for variants and icon usage.

## Changes
- Adjusted core UI typography, link styling, list spacing, and code block contrast.
- Refined button variants/spacing, pill sizing, and hover behaviors.
- Added badge size variants, label sizing tweaks, and checkbox/radio active-state polish.
- Improved collapsible/accordion motion, select/combobox dropdown sizing, and spinner sizing.
- Expanded core UI view to show toggle/switch-text icon variants and select/combobox icon menus.
- Updated Components Godmode examples for badge/label/link sizing updates.

## Files touched
- `frontend/src/styles/_tokens.scss`
- `frontend/src/styles/_core-ui.scss`
- `frontend/src/styles/_mixins.scss`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/core-ui-view.scss`
- `frontend/src/lib/components/ui/button/button.scss`
- `frontend/src/lib/components/ui/badge.scss`
- `frontend/src/lib/components/ui/badge.svelte`
- `frontend/src/lib/components/ui/label.scss`
- `frontend/src/lib/components/ui/label.svelte`
- `frontend/src/lib/components/ui/accordion/accordion.scss`
- `frontend/src/lib/components/ui/collapsible/collapsible.scss`
- `frontend/src/lib/components/ui/radio-group/radio-group-item.svelte`
- `frontend/src/lib/components/ui/radio-group/radio-group.scss`
- `frontend/src/lib/components/ui/checkbox/checkbox.svelte`
- `frontend/src/lib/components/ui/checkbox/checkbox.scss`
- `frontend/src/lib/components/ui/input/input.scss`
- `frontend/src/lib/components/ui/textarea/textarea.scss`
- `frontend/src/lib/components/ui/select/select.scss`
- `frontend/src/lib/components/ui/combobox/combobox.scss`
- `frontend/src/lib/components/ui/toggle-group/toggle-group.scss`
- `frontend/src/lib/components/ui/switch/switch.scss`
- `frontend/src/lib/components/ui/loading-spinner.scss`
- `frontend/src/lib/components/ui/link.scss`
- `frontend/src/lib/components/code-block.scss`
- `frontend/src/components/components-data.ts`

## Validation
- Not run (recommend `pnpm -C frontend check`).

## Notes
- Kept all styling in SCSS and reused a shared collapse animation mixin for accordion/collapsible.
