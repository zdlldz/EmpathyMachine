# [DEV-5312] - FPS overlay refresh note
Icon: tabler:activity
Tags: ui, perf
Date: 2026-01-26
Summary: Added a concise Hz readout to the FPS overlay to hint at refresh rate/vsync.

## Goal
- Make the FPS overlay clarify likely refresh limits with a minimal extra hint.

## Scope
- Add a short Hz readout derived from the sampled frame time.

## Changes
- Added a Hz readout alongside the ms sample in the FPS overlay.

## Files touched
- `frontend/src/lib/components/blocks/fps-overlay.svelte`

## Validation
- Not run (UI-only change).

## Notes
- Hz is derived from the sampled frame time, so it reflects the same average window.
