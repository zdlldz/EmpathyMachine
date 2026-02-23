# [DEV-5398] - Prompt Engine Hardening Round 3
Icon: tabler:layers-intersect
Tags: frontend, performance, reliability, prompt-engine, hardening
Date: 2026-02-13
Summary: Completes the deferred batch memory optimization by replacing eager shortcode variant materialization with streamed run submission and explicit submission-count safety bounds.

## Goal
- Eliminate frontend memory spikes during large batch submission while preserving existing batch semantics and operator-configurable hard-cap behavior.

## Scope
- In scope:
- Prompt submission flow in `frontend/src/views/prompts-panel.svelte`.
- Submission-time safeguards for oversized cardinality values that exceed JavaScript-safe numeric range.
- i18n messaging for new overflow guard.
- Process/review/task tracking updates.
- Out of scope:
- New backend bulk-create API for prompt runs.
- Parallel submission/concurrency tuning for prompt-run creation.

## Baseline
- Deferred item from Round 2:
- Prompt batch submission still built full `Array.from(expandPromptTemplate(...))` before first `createPromptRun` request.
- Risk profile:
- High-cardinality shortcode combinations could cause avoidable renderer memory pressure and delayed first-run enqueue.
- Execution branch for this round:
- `zdlldz/dev5398-scale-pass`.

## Implementation Plan
1. Replace eager variant array creation with streamed generator submission.
2. Keep hard-cap enforcement based on precomputed `batchSummary.totalCount` (BigInt), not array length.
3. Add safe-count guard before converting batch totals into JSON numeric fields for run metadata.
4. Localize the new overflow error message.
5. Run frontend quality gates and update process/review/task docs.

## Changes
- Replaced eager batch materialization in `submitPrompt` with streamed iteration over `expandPromptTemplate(...)`.
- Added `resolveVariantPlan` helper to produce:
- generator iterator for variants
- `totalBigInt` for robust cap checks
- safe numeric `total` used in run metadata (`batch_total`)
- Added `MAX_SUBMITTABLE_VARIANTS = BigInt(Number.MAX_SAFE_INTEGER)` guard.
- Added localized message key `prompts.message.batchCountOverflow` for `fr`, `de`, `ja`, `es`, and `en`.
- Updated process/review/task docs to mark batch-streaming optimization as completed in this round.

## Files touched
- `frontend/src/views/prompts-panel.svelte`
- `frontend/src/core/i18n/messages.json`
- `docs/process/DEV-5398-prompt-engine-hardening-round-3.md`
- `docs/process/DEV-5398-prompt-response-api-pr-33-review.md`
- `docs/process/DEV-5398-prompt-engine-mainline-tranche-b.md`
- `docs/knowledge/prompt-frontend-sidebar.md`
- `docs/tasks.md`

## Validation
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend check`
- `pnpm -C frontend test:e2e`

## Notes
- Follow-up completed in Round 4:
- backend batch run-creation mutation/command and frontend chunked submission are now implemented in `docs/process/DEV-5398-prompt-engine-hardening-round-4.md`.
