# Prompt frontend sidebar
Icon: tabler:sparkles
Tags: prompt-engine, frontend, sidebar, svelte
Date: 2026-02-12
Summary: Prompt Engine frontend is implemented as a nested right-rail panel with typed GraphQL client helpers, shortcode batch expansion, and settings-backed cap controls.

## Architecture
- Right rail now supports nested panel composition through:
  - `frontend/src/lib/components/blocks/nested-right-rail.svelte`
- Prompt Engine panel is mounted from app shell:
  - `frontend/src/views/prompts-panel.svelte`
- GraphQL interaction is centralized:
  - `frontend/src/core/prompt-engine-client.ts`
- Shortcode parsing/expansion is centralized:
  - `frontend/src/core/prompt-shortcodes.ts`

## Connection behavior
- Prompt submission uses explicit connection when selected.
- If explicit connection is unset, backend resolves via defaults:
  - endpoint default -> provider default -> optional env fallback.
- Panel includes endpoint/provider default set/clear actions via GraphQL.

## Batch behavior
- Batch mode is shortcode-token driven (`[token]` format).
- Prompt panel computes:
  - token detection
  - missing token checks
  - expansion count
  - preview slice
- Submission creates:
  - one prompt row (`createPrompt`)
  - prompt-run chunks via `createPromptRuns` bulk mutation
- Submission streams shortcode expansion directly into run creation (no full in-memory variant array), reducing peak renderer memory during large valid batches.
- Chunked bulk submission reduces GraphQL roundtrips for high-cardinality valid batches while keeping per-request payload bounded.
- Chunk size is now adaptive per submission (bounded min/max) based on:
  - initial queue-depth snapshot (`health.queueDepth`)
  - observed per-chunk mutation latency
- Worker consumes run-level `input.prompt_text` override, enabling variant text execution per run.

## Settings linkage
- Prompt panel uses core settings state (`frontend/src/core/settings.svelte.ts`) for:
  - `promptBatchHardCapEnabled`
  - `promptBatchHardCapValue`
  - `promptEngineAllowEnvFallback`
- Cap defaults to `1000` when enabled and unset/invalid.

## Validation baseline
- `pnpm -C frontend check` is currently green in the DEV-5398 hardening branch line.
- Prompt panel changes are validated through check + e2e gates in the DEV-5398 hardening process docs.
