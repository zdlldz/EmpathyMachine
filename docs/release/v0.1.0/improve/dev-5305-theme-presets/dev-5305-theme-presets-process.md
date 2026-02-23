# [DEV-5305] - Theme presets (OKLCH)
Icon: tabler:palette
Tags: theme, settings, shadcn, tailwind
Date: 2026-01-07
Summary: Add preset color themes (default/blue/green/red) with OKLCH tokens and Settings toggles, aligned with shadcn-svelte v4 theming guidance.

## Goal
- Enable theme presets alongside light/dark/system mode using OKLCH CSS variables.

## Scope
- Add preset selection UI in Settings.
- Persist preset selection and apply it to all windows.
- Align Tailwind v4 theming to shadcn-svelte recommendations.

## Changes
- Added preset theme state (`theme_preset`) with Settings persistence.
- Introduced `data-theme` preset handling in `frontend/src/core/theme.ts`.
- Reworked Tailwind theme tokens to OKLCH variables with `@theme inline`.
- Excluded `src/references/**` from Tailwind content scanning to avoid generating CSS from examples.
- Added `aria-pressed` to theme toggle buttons for accessibility.
- Updated the frontend check script to use the local tsconfig path.
- Refreshed Tabs primitives to match the shadcn-svelte v4 registry (Bits UI).
- Added knowledge doc on extending presets.

## Files touched
- `frontend/src/core/theme.ts`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/App.svelte`
- `frontend/src/styles/tailwind.css`
- `frontend/tailwind.config.cjs`
- `frontend/package.json`
- `frontend/src/lib/components/ui/tabs.svelte`
- `frontend/src/lib/components/ui/tabs-list.svelte`
- `frontend/src/lib/components/ui/tabs-trigger.svelte`
- `frontend/src/lib/components/ui/tabs-content.svelte`
- `frontend/src/lib/components/ui/tabs-context.ts`
- `docs/knowledge/theme-presets.md`
- `docs/knowledge/tailwind-v4-shadcn-svelte.md`
- `docs/knowledge/settings-persistence.md`

## Validation
- Not run (not requested).

## Notes
- Preset token values are OKLCH and scoped via `data-theme` on `:root`.
