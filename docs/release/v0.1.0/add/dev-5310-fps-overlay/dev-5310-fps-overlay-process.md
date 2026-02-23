# [DEV-5310] - FPS overlay dev HUD
Icon: tabler:gauge
Tags: ui, perf, config
Date: 2026-01-26
Summary: Added a small FPS overlay for internal performance checks, gated behind a feature flag in config.

## Goal
- Provide a lightweight, always-on FPS readout for internal performance visibility.

## Scope
- Add a config flag and render the overlay in the main window when enabled.
- Excludes a settings UI toggle or extended profiling metrics.

## Changes
- Added the `fpsOverlay` feature flag and regenerated sync outputs.
- Built an `FpsOverlay` block component with a minimal visual treatment.
- Wired the overlay into the main app behind the feature flag.

## Files touched
- `config/features.json`
- `frontend/src/App.svelte`
- `frontend/src/lib/components/blocks/fps-overlay.svelte`
- `frontend/src/lib/components/blocks/fps-overlay.scss`
- `frontend/src/lib/feature-flags.ts`
- `backend/src/feature_flags.rs`

## Validation
- `pnpm sync:config`

## Notes
- Enable by setting `fpsOverlay` to `true` in `config/features.json`.
