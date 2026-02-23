# [DEV-5398] - Prompt Engine Hardening Round 4
Icon: tabler:stack-2
Tags: backend, frontend, reliability, performance, prompt-engine, graphql
Date: 2026-02-13
Summary: Implements the next enterprise hardening tranche by adding batched prompt-run creation to reduce GraphQL roundtrips and persisting explicit reconciliation audit events for prompt-run terminalization control paths.

## Goal
- Improve large-batch throughput while preserving bounded memory behavior.
- Add explicit, queryable audit evidence for reconciliation-driven terminalization events.

## Scope
- In scope:
- Backend GraphQL bulk mutation for prompt-run creation.
- Domain-level transactional batch run creation with shared lifecycle logic.
- Frontend prompt submission upgrade to chunked bulk run creation.
- Job-event persistence for reconciliation-triggered failure/cancel terminalization.
- Tenant-scoped GraphQL query surface for job events.
- Process/knowledge/task tracker updates.
- Out of scope:
- Real-time progress subscriptions for job events.
- Adaptive chunk sizing based on runtime latency/queue pressure.

## Baseline
- Round 3 completed streaming frontend variant generation, eliminating eager full-array materialization.
- Remaining recommended next steps were:
- backend batch run-create API/mutation to reduce per-run roundtrips.
- explicit reconciliation job-event audit trail for operational forensics.

## Implementation Plan
1. Add a domain batch run-creation function and make single-run creation a wrapper.
2. Expose batch run-creation via GraphQL (`createPromptRuns`) with mutation-rate cost proportional to batch size.
3. Update frontend prompt submission to send bounded chunks through the new mutation.
4. Reuse existing `job_events` table for reconciliation audit entries and expose tenant-scoped query (`adminJobEvents`).
5. Persist audit events on prompt reconciliation paths:
- no handler registered
- max attempts exhausted
- manual cancel
6. Extend tests to cover batch mutation and audit event visibility.

## Changes
- Added `backend/src/db/job_events.rs` module:
- typed insert-in-transaction helper
- tenant-scoped listing with job join
- regression test for insert/list behavior
- Added transactional audited job status updates in `backend/src/db/jobs.rs`:
- `mark_failed_with_event`
- `mark_canceled_for_tenant_with_event`
- Added reconciliation audit event emission in `backend/src/jobs/mod.rs` for failure terminalization paths.
- Added domain batch run-create path in `backend/src/domain/prompt_engine.rs`:
- `create_prompt_runs`
- `create_prompt_run` now delegates to batch path (DRY lifecycle consistency)
- Added GraphQL API extensions in `backend/src/api/schema.rs`:
- `createPromptRuns` mutation (`CreatePromptRunsInput`)
- `adminJobEvents` query
- `JobEventNode` + `PromptRunsPayload`
- cancellation path now records manual-cancel reconciliation events transactionally with job state update
- Updated frontend GraphQL client `frontend/src/core/prompt-engine-client.ts`:
- `createPromptRuns` mutation + typed client helper
- Updated prompt panel submission flow `frontend/src/views/prompts-panel.svelte`:
- chunked bulk run creation (bounded chunks)
- stable run ordering by attempt after chunked responses
- Added/updated tests:
- `backend/src/db/job_events.rs` test coverage
- `backend/src/db/jobs.rs` audited cancel test
- `backend/src/domain/prompt_engine.rs` batch run-create test
- `backend/src/api/schema.rs` roundtrip test now exercises `createPromptRuns` and validates `adminJobEvents` manual-cancel reconciliation evidence

## Files touched
- `backend/src/db.rs`
- `backend/src/db/job_events.rs`
- `backend/src/db/jobs.rs`
- `backend/src/domain/prompt_engine.rs`
- `backend/src/jobs/mod.rs`
- `backend/src/api/schema.rs`
- `frontend/src/core/prompt-engine-client.ts`
- `frontend/src/views/prompts-panel.svelte`
- `docs/process/DEV-5398-prompt-engine-hardening-round-4.md`
- `docs/process/DEV-5398-prompt-response-api-pr-33-review.md`
- `docs/process/DEV-5398-prompt-engine-mainline-tranche-b.md`
- `docs/knowledge/prompt-worker-runtime.md`
- `docs/knowledge/prompt-frontend-sidebar.md`
- `docs/tasks.md`

## Validation
- `cargo fmt --manifest-path backend/Cargo.toml`
- `cargo test --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `pnpm -C frontend check`
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend test:e2e`

## Notes
- Follow-up completed in Round 5:
- Adaptive chunk sizing for `createPromptRuns` based on measured latency and queue depth is implemented in `docs/process/DEV-5398-prompt-engine-hardening-round-5.md`.
- Add job-event subscriptions if operators need live reconciliation telemetry without polling.
