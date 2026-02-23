# [DEV-5305] - Theme transition polish
Icon: tabler:palette
Tags: frontend, theme, polish
Date: 2026-01-07
Summary: Unified theme transition behavior by adding a global transition rule and debouncing theme-transition class toggles.

## Goal
- Ensure theme/preset changes animate consistently without stacked transitions.

## Scope
- Theme transition timing logic and CSS.

## Changes
- Added global `.theme-transition` CSS for color-related transitions and reduced-motion override.
- Debounced `theme-transition` class removal to avoid stacked timers.

## Files touched
- `frontend/src/core/theme.ts`
- `frontend/src/styles/tailwind.css`

## Validation
- Manual: toggle theme mode/preset in Settings and watch for consistent transitions.
