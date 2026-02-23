# [DEV-5398] - Prompt / Response API PR 33 Adversarial Review
Icon: tabler:shield-x
Tags: review, backend, frontend, prompt-engine, reliability
Date: 2026-02-12
Summary: Adversarial audit of PR #33 (`32999df`) against `6af0208` found two blocking durability defects and one required localization regression before enterprise-grade approval.

## Goal
- Perform a high-skepticism, enterprise-grade audit of PR #33 (`prompt / response api`) as if it were still under review.

## Scope
- Reviewed target: `https://github.com/Company-XYZ/starter-rust_svelte/pull/33/`
- Commit range audited: `6af0208..32999df`
- Branch context: `zdlldz/dev5398-pr-final` (merged into `main`)
- Surfaces: backend domain/db/jobs/GraphQL, frontend prompt panel + app integration, docs/task tracker alignment.

## Review Types Loaded
- Company lens (`review-lens-company-mantras`)
- Tauri 2
- Svelte 5
- JavaScript/TypeScript
- CSS/SCSS
- HTML/accessibility
- Security boundaries
- Test and observability

## Findings
### Blocking
1. Prompt run state is never terminalized when a job exhausts retries or is manually canceled.
   - Evidence:
   - `backend/src/jobs/mod.rs:92` marks terminal job failure via `jobs::mark_failed` only.
   - `backend/src/db/jobs.rs:432` updates only the `jobs` table (`status='failed'`), not `prompt_runs`/`prompts`.
   - `backend/src/api/schema.rs:1482` cancel mutation calls `mark_canceled_for_tenant` only.
   - `frontend/src/views/prompts-panel.svelte:195` keeps polling while run status is `queued` or `running`.
   - Failure mode: prompt jobs can permanently fail/cancel while prompt runs remain `queued`/`running`, creating stuck UI state, stale domain status, and non-observable operational truth.
   - Fix direction: on terminal job failure/cancel, atomically persist run/prompt terminal status (and error context) through prompt-engine domain APIs; do not rely on `jobs` status alone.

### Required Changes
1. API advertises provider capability that runtime cannot execute.
   - Evidence:
   - `backend/src/domain/prompt_engine.rs:207` and `backend/src/domain/prompt_engine.rs:244` publish `anthropic` and `google-gemini` provider types.
   - `backend/src/domain/prompt_engine.rs:1237` only enforces connection-type compatibility for `openai`.
   - `backend/src/jobs/prompt_engine_worker.rs:47` registers only `openai` executor.
   - `backend/src/jobs/prompt_engine_worker.rs:110` returns `"no provider executor registered"` for unsupported providers.
   - Failure mode: GraphQL contracts report providers/endpoints as available while worker runtime has no implementation; jobs churn through retries and eventually fail without first-class domain semantics.
   - Fix direction: gate provider manifests to implemented executors, or add explicit domain-level "unsupported provider" rejection before run creation.

2. New prompt-engine strings are English across all locales, regressing non-English UX quality.
   - Evidence:
   - `frontend/src/core/i18n/messages.json:647`
   - `frontend/src/core/i18n/messages.json:1000`
   - `frontend/src/core/i18n/messages.json:1353`
   - `frontend/src/core/i18n/messages.json:1706`
   - Failure mode: FR/DE/JA/ES users see untranslated prompt panel copy despite locale selection.
   - Fix direction: provide real locale translations for the new `prompts.*` and `nav.prompts` keys (or route them through an intentional fallback strategy documented as temporary).

### Suggestions
1. Batch submission eagerly materializes the full Cartesian product before sending runs.
   - Evidence:
   - `frontend/src/views/prompts-panel.svelte:410`
   - `frontend/src/views/prompts-panel.svelte:414`
   - Failure mode: large shortcode sets can spike memory/latency in renderer before the first run is enqueued.
   - Fix direction: stream generator output directly into run creation and enforce caps before full expansion.

## Claimed vs Verified
- Alignment: Partially aligned.
- Claimed: final quality gates pass and runtime durability is production-hardened.
- Verified:
  - Quality gates currently pass.
  - Durability still has a blocking status-reconciliation gap (job terminal state vs run/prompt terminal state).
- Mismatch: runtime hardening is incomplete for terminal failure/cancel paths.

## Validation
- `cargo fmt --manifest-path backend/Cargo.toml -- --check`
- `cargo test --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `pnpm -C frontend check`
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend test:e2e`

## Rust Deep Pass Addendum (2026-02-13)
### Review types loaded
- Company lens (`review-lens-company-mantras`)
- Tauri 2
- Security boundaries
- Test and observability

### Additional findings
#### Blocking
1. Running jobs are not recoverable after process crash or hard stop.
   - Evidence:
   - `backend/src/db/jobs.rs:155` leases only jobs in `queued`/`retry`.
   - `backend/src/db/jobs.rs:379` defines `heartbeat`, but no runtime caller exists.
   - `backend/src/jobs/mod.rs:72`/`backend/src/jobs/mod.rs:91` only handles leased jobs and marks terminal state per-job.
   - `backend/src/main.rs:102` starts workers, but no startup reconciliation path exists.
   - Failure mode: if the app exits while a job is `running`, that row is never eligible for lease again, so prompt execution can stall indefinitely.
   - Fix direction: add startup + periodic stale-running reconciliation (or lease-expiry requeue semantics) and wire heartbeat for long-running handlers.

#### Required Changes
1. Response lifecycle allows non-monotonic run status transitions.
   - Evidence:
   - `backend/src/domain/prompt_engine.rs:930` accepts response writes for any existing run.
   - `backend/src/domain/prompt_engine.rs:978` maps response status directly to run status.
   - `backend/src/domain/prompt_engine.rs:1006` updates run status without transition guards.
   - Failure mode: out-of-order/duplicate response writes can move a run from terminal (`completed`/`failed`/`canceled`) back to `running`, causing stale or oscillating prompt status.
   - Fix direction: enforce an explicit run-status transition matrix (monotonic terminal behavior), reject stale transitions, and add regression tests for duplicate/out-of-order response writes.

2. Runtime execution contract still diverges from provider and endpoint manifest.
   - Evidence:
   - `backend/src/domain/prompt_engine.rs:87` advertises OpenAI chat/codex endpoints.
   - `backend/src/domain/prompt_engine.rs:206` and `backend/src/domain/prompt_engine.rs:243` advertise Anthropic and Gemini providers.
   - `backend/src/jobs/prompt_engine_worker.rs:47` registers only the OpenAI executor.
   - `backend/src/jobs/prompt_engine_worker.rs:247` executes only OpenAI images/videos and force-fails other OpenAI endpoints.
   - Failure mode: valid API selections are accepted, enqueued, and then fail at runtime, violating contract predictability.
   - Fix direction: restrict manifest to executable surfaces or add implementations before advertising them.

3. Video seed attachments are loaded into memory without size bounds.
   - Evidence:
   - `backend/src/jobs/prompt_engine_worker.rs:485` reads attachment path from prompt metadata.
   - `backend/src/jobs/prompt_engine_worker.rs:486` uses `tokio::fs::read` (full-file read).
   - Failure mode: oversized temp files can cause memory spikes and worker instability.
   - Fix direction: enforce maximum seed size with metadata checks and bounded/streamed reads.

#### Suggestions
1. Add backend regression tests for crash recovery and status monotonicity.
   - Evidence:
   - `backend/src/domain/prompt_engine.rs:1553` test suite covers happy paths/mixed outcomes, but not stale-running recovery or terminal-to-running rejection.
   - `backend/src/db/jobs.rs:379` heartbeat has no integration coverage.
   - Rationale: current tests pass while critical operational edge paths remain unverified.

## Round 2 Remediation Draft (2026-02-13)
### Detailed implementation plan (executed)
1. Add shared prompt-job payload contract in domain layer.
- Goal: remove payload parsing drift across API, worker, and job-runner control paths.
- Result: added typed payload parse/build helpers used by enqueue and worker/runtime reconciliation.

2. Reconcile domain state on job control outcomes.
- Goal: ensure `jobs` terminal events also converge `prompt_runs` and `prompts`.
- Result: added terminalization helpers and wired them into:
  - max-attempt failure path
  - no-handler failure path
  - manual `cancelJob` mutation path

3. Harden crash/restart resilience.
- Goal: ensure stale `running` jobs are not orphaned and long-running handlers do not lose lease ownership.
- Result:
  - stale `running` jobs are now eligible for reclaim once lease is stale.
  - heartbeat loop now refreshes leases while handlers run.

4. Enforce run-state monotonicity.
- Goal: prevent terminal run regression via out-of-order/late response writes.
- Result:
  - response ingestion now rejects terminal-to-nonterminal transitions.
  - `mark_prompt_run_running` rejects terminal regressions.

5. Align runtime contract with advertised capabilities.
- Goal: eliminate manifest/runtime mismatch.
- Result: provider manifest now advertises only executable surfaces for this release (`openai/images`, `openai/videos`).

6. Bound resource usage in worker.
- Goal: avoid unbounded attachment reads.
- Result: added metadata guard + max-size checks before video seed file read.

7. Close localization quality gap.
- Goal: remove English fallback copy in non-English prompt-engine strings.
- Result: localized prompt-engine keyset for `fr`, `de`, `ja`, and `es`.

### Validation evidence for remediation
- `cargo fmt --manifest-path backend/Cargo.toml`
- `cargo test --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend check`
- `pnpm -C frontend test:e2e`

### Post-remediation status
- Original PR audit verdict remains historically `Request Changes`.
- On remediation branch `zdlldz/dev5398-hardening`, all previously listed blocking and required items are implemented and validated.

### Round 3 follow-up status (2026-02-13)
1. Batch submission memory profile:
- Implemented on `zdlldz/dev5398-scale-pass` by replacing eager variant materialization with streamed submission from `expandPromptTemplate(...)`.
- Added submission-count overflow guard to prevent unsafe numeric conversion for run metadata.

### Round 4 follow-up status (2026-02-13)
1. Job auditability:
- Implemented on `zdlldz/dev5398-next-tranche`.
- Reconciliation-triggered terminalization now writes explicit `job_events` records and is queryable via `adminJobEvents`.
2. Batch run-create scalability:
- Implemented on `zdlldz/dev5398-next-tranche`.
- Added `createPromptRuns` bulk mutation + frontend chunked submission path to reduce per-run GraphQL roundtrips while keeping memory bounded.
3. Optional next refinement:
- Add adaptive chunk-size tuning based on observed latency/queue pressure for high-volume tenant workloads.

### Round 5 follow-up status (2026-02-13)
1. Adaptive chunk tuning:
- Implemented on `zdlldz/dev5398-finalize`.
- Frontend batch submission now tunes `createPromptRuns` chunk size using measured mutation latency and queue-depth snapshot bias, with bounded min/max limits.
2. PR readiness:
- Full backend/frontend quality gates rerun successfully after implementation and documentation finalization.

## Verdict
- Request Changes
