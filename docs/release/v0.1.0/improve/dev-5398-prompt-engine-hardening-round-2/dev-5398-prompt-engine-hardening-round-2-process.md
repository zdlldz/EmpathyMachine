# [DEV-5398] - Prompt Engine Hardening Round 2
Icon: tabler:shield-lock
Tags: backend, reliability, performance, prompt-engine, hardening
Date: 2026-02-13
Summary: Baseline and execution plan for fixing all identified PR #33 durability gaps with production-grade job recovery, state consistency, runtime-contract alignment, and memory safety improvements.

## Goal
- Resolve all identified blocking/required reliability defects from the adversarial reviews at implementation level.

## Scope
- In scope:
- Prompt job lifecycle consistency across `jobs`, `prompt_runs`, and `prompts`.
- Crash/restart resiliency for leased/running jobs.
- Prompt run status transition safety and anti-regression guards.
- Runtime/provider contract alignment between API manifest and executable workers.
- Bounded resource handling for prompt attachment ingestion in worker runtime.
- Regression tests and docs/process synchronization.
- Out of scope for this round:
- New provider implementations (Anthropic/Gemini/OpenAI chat/codex execution).
- Frontend batching architecture rewrite (kept as documented follow-up).

## Baseline
- Current review verdict: `Request Changes` due to unresolved backend durability and contract defects.
- Primary findings source:
- `docs/process/DEV-5398-prompt-response-api-pr-33-review.md`
- `docs/process/DEV-5398-rust-deep-review-persona.md`
- Current branch for this execution round: `zdlldz/dev5398-hardening`.

## Implementation Plan
1. Job lifecycle reconciliation:
- Ensure prompt job terminal failure/cancel propagates to prompt-run domain state.
- Keep queue metadata and domain state convergent under retries, cancellations, and exhausted attempts.

2. Recovery + liveness hardening:
- Make stale `running` jobs recoverable after crash/restart.
- Wire lease heartbeat in runtime worker loop to prevent duplicate leasing for long operations.

3. State transition guardrails:
- Enforce monotonic prompt-run transition rules for response ingestion.
- Reject illegal terminal-to-nonterminal regressions.

4. Runtime contract alignment:
- Restrict provider/endpoint manifest to implemented execution paths for this release.

5. Memory safety:
- Add bounded attachment-size guard before loading OpenAI video seed files.

6. Regression and docs:
- Add/adjust tests for stale-running lease recovery and transition guard behavior.
- Update process/review docs and task tracker with outcomes and any deferred work.

## Changes
- Backend hardening implemented:
- Added typed prompt-run job payload helpers in domain layer for DRY, shared parsing/serialization:
  - `build_prompt_run_job_payload`
  - `parse_prompt_run_job_payload`
- Added terminal reconciliation helpers to converge prompt-run state on control-plane outcomes:
  - `finalize_prompt_run_terminal`
  - `finalize_prompt_run_from_job_payload`
- Enforced prompt-run state monotonicity:
  - `create_prompt_response` now rejects terminal-to-nonterminal regressions.
  - `mark_prompt_run_running` now rejects transitions from terminal run states.
- Hardened job runner reliability:
  - Added per-job heartbeat loop during handler execution.
  - Added prompt-run terminal reconciliation on no-handler and max-attempt failures.
- Hardened queue recovery behavior:
  - `lease_next` now reclaims stale `running` jobs whose lease is expired/missing.
- Hardened manual cancel path:
  - `cancelJob` now resolves prompt-run terminal state before marking the job canceled.
  - Added `get_by_id_for_tenant` job lookup for safe, tenant-scoped cancellation orchestration.
  - Cancellation update is now limited to cancelable states (`queued`, `retry`, `running`).
- Runtime contract alignment implemented:
  - Prompt provider manifest now only advertises executable surfaces for this release: OpenAI `images` and `videos`.
- Memory safety implemented:
  - Added bounded file handling for OpenAI video seed attachments (max size guard + metadata validation).
- Localization regression addressed:
  - Replaced placeholder-English prompt-engine strings in `fr`, `de`, `ja`, and `es` locales with localized copy.
- Regression coverage added:
  - Stale-running lease recovery test in `db/jobs` tests.
  - Terminal-state transition guard tests in `domain/prompt_engine` tests.
  - Empty video seed file guard test in `jobs/prompt_engine_worker` tests.
  - GraphQL prompt roundtrip now verifies `cancelJob` terminalizes run state.

## Files touched
- `backend/src/api/schema.rs`
- `backend/src/db/jobs.rs`
- `backend/src/domain/prompt_engine.rs`
- `backend/src/jobs/mod.rs`
- `backend/src/jobs/prompt_engine_worker.rs`
- `frontend/src/core/i18n/messages.json`
- `docs/process/DEV-5398-prompt-engine-hardening-round-2.md`
- `docs/process/DEV-5398-prompt-response-api-pr-33-review.md`
- `docs/knowledge/prompt-worker-runtime.md`
- `docs/tasks.md`

## Validation
- `cargo fmt --manifest-path backend/Cargo.toml`
- `cargo test --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `pnpm -C frontend check`
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend test:e2e`

## Notes
- Deferred next-step candidates from Round 2:
- Prompt batch streaming optimization is now completed in `docs/process/DEV-5398-prompt-engine-hardening-round-3.md`.
- Job-history/audit entries for reconciliation terminalization are now implemented in `docs/process/DEV-5398-prompt-engine-hardening-round-4.md`.
