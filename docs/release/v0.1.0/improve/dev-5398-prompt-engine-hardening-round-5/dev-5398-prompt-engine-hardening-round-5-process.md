# [DEV-5398] - Prompt Engine Hardening Round 5
Icon: tabler:shield-check
Tags: frontend, performance, reliability, prompt-engine, finalization
Date: 2026-02-13
Summary: Final PR-prep tranche adds adaptive chunk-size tuning for batched prompt-run creation using measured mutation latency plus queue-depth bias, then performs a full sanity gate pass for enterprise-grade readiness.

## Goal
- Improve batch submission throughput resilience under varying runtime load while preserving bounded request size and memory constraints.
- Close DEV-5398 with a full final sanity check and updated durable documentation.

## Scope
- In scope:
- Adaptive chunk-size control loop in prompt submission flow.
- Queue-depth snapshot integration for initial chunk sizing bias.
- Final process/task/knowledge documentation updates.
- Full backend + frontend quality gate revalidation.
- Out of scope:
- Live adaptive control from streaming telemetry.
- Job-event real-time subscriptions.

## Baseline
- Round 4 completed:
- backend `createPromptRuns` bulk mutation and frontend chunked bulk submission.
- reconciliation audit trail persistence + `adminJobEvents` query surface.
- Remaining recommendation:
- adaptive chunk sizing based on measured latency and queue depth.

## Implementation Plan
1. Add queue-depth snapshot fetch in prompt client surface.
2. Add adaptive chunk controls to prompt panel:
- bounded min/max chunk sizes
- initial chunk-size estimator using batch cardinality + queue depth
- per-chunk latency feedback tuning
3. Keep DRY flow: no duplicate run-create paths, continue using `createPromptRuns` API.
4. Re-run full quality gates and update docs/process/task links.

## Changes
- Added prompt health client query in `frontend/src/core/prompt-engine-client.ts`:
- `fetchPromptHealthSnapshot()` over GraphQL `health { queueDepth at }`.
- Updated prompt submission in `frontend/src/views/prompts-panel.svelte`:
- added bounded adaptive chunk sizing (`min`, `max`, base size constants)
- initial chunk estimate from batch total + queue-depth snapshot
- per-chunk latency measurement and chunk-size tuning
- retains deterministic variant streaming + stable attempt-order sort
- refactored layout to use standard `Sidebar` components (Header, Content, Footer) for consistency with application chrome.
- Updated English translations in `frontend/src/core/i18n/messages.json`:
- corrected French labels in the `en` section for prompt engine title and description.
- completed localization for all remaining prompt-related keys.
- Updated process/docs linkage for finalization round.

## Files touched
- `frontend/src/core/prompt-engine-client.ts`
- `frontend/src/views/prompts-panel.svelte`
- `frontend/src/views/prompts-panel.scss`
- `frontend/src/core/i18n/messages.json`
- `docs/process/DEV-5398-prompt-engine-hardening-round-5.md`
- `docs/process/DEV-5398-prompt-engine-hardening-round-4.md`
- `docs/process/DEV-5398-prompt-response-api-pr-33-review.md`
- `docs/process/DEV-5398-prompt-engine-mainline-tranche-b.md`
- `docs/knowledge/prompt-frontend-sidebar.md`
- `docs/tasks.md`

## Validation
- `cargo fmt --manifest-path backend/Cargo.toml`
- `cargo test --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend check`
- `pnpm -C frontend test:e2e`
- Post-interruption final sanity rerun (2026-02-13):
- backend tests: 43 passed, 0 failed, 2 ignored
- clippy: clean with `-D warnings`
- frontend checks: `i18n:check` OK (5 locales, 352 keys), `check` 0 errors/0 warnings, e2e 12/12 passed

## Notes
- DEV-5398 recommended implementation items are complete.
- Optional future tuning:
- dynamic chunk strategy could incorporate rolling queue-depth refreshes if submission durations become long enough to justify additional control feedback.
