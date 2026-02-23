# [DEV-5305] - Transition standardization
Icon: tabler:transition-right
Tags: frontend, polish, theme
Date: 2026-01-07
Summary: Standardized transition durations to 200ms and aligned theme/icon transitions with a shared token.

## Goal
- Make all UI transitions feel consistent across themes and components.

## Scope
- Global transition duration token and Tailwind defaults.
- Theme transition timing alignment.
- Sidebar collapsed width + icon alignment tweaks.
- Sheet open/close duration alignment.

## Changes
- Added `--transition-duration: 200ms` and applied it to theme transitions.
- Set Tailwind default transition duration to `var(--transition-duration)`.
- Updated theme transition timer to 200ms.
- Tightened collapsed sidebar width and centered icon layout.
- Standardized sheet open/close durations to 200ms.

## Files touched
- `frontend/src/styles/tailwind.css`
- `frontend/src/core/theme.ts`
- `frontend/tailwind.config.cjs`
- `frontend/src/lib/components/ui/sidebar/constants.ts`
- `frontend/src/lib/components/ui/sidebar/sidebar-menu-button.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-inset.svelte`
- `frontend/src/lib/components/ui/sheet/sheet-content.svelte`
- `docs/knowledge/theme-presets.md`
- `frontend/agents.md`

## Validation
- Manual: switch themes/presets and observe icon color timing; collapse sidebar icons.
