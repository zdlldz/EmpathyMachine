# [DEV-5398] - Prompt Engine Mainline Tranche B (Final Integrated Plan)
Icon: tabler:route-2
Tags: backend, frontend, api, prompt-engine, planning
Date: 2026-02-12
Summary: Final integrated plan to implement Prompt Engine end-to-end on current `main`, with OpenAI image/video support, shortcode batch durability, Connections integration, and reusable frontend nested-rail mechanics.

## Goal
- Implement the full Prompt Engine plan on latest `main` with enterprise durability, DRY architecture, and first-class OpenAI image/video support.

## Scope
- Full implementation planning only (no phased/V1 fallback framing).
- Backend + GraphQL + worker durability + provider puzzle-piece architecture + frontend nested-right-sidebar + prompt UX.
- Includes documentation and quality gate expectations for merge readiness.

## Baseline snapshot
- Active branch: `zdlldz/dev5398-impl`
- `main` base SHA: `6af0208784fdac1effa8a17dda63e0ff681fff86`
- Divergence at planning checkpoint: `0 0` (`git rev-list --left-right --count main...HEAD`)
- Prior implementation reference (read-only): `codex/dev-5398-mainline-replan` at `5101723`
- Prototype behavior reference (read-only submodule): `references/MediaMachine`

## Final decisions (from latest feedback)
1. Status model:
- Keep explicit terminal `completed_partial` (recommended) for robust visibility and retry semantics.
2. Delivery model:
- Implement the complete architecture now; no V1/V2 scope split in this tranche.
3. Batch limits:
- No always-on hard cap.
- Cap policy is settings-driven and optional.
- If a hard cap is enabled and unset, fallback default is `1000`.
4. Attachments:
- Start with temp-local prompt inputs now, but behind clean attachment abstraction so future file-services work can plug in without refactors.
5. Provider execution:
- Ship one real provider path now: OpenAI image + video.
- Also ship provider template/puzzle-piece scaffolding for additional providers.
6. Connection policy for provider execution:
- Allow multiple provider connections (including multiple OpenAI keys) via Connections API.
- Prompt/batch execution selects connection at submission level (itemized by prompt).
- Support default connection resolution when explicit `connection_id` is omitted.
- Require resolved `connection_id` for production runs; env keys are fallback-only and lower-priority.

## Deep discovery conclusions
1. Current mainline architecture is ready for extension:
- Domain + db layers already support transactional writes, optimistic updates, and event/change patterns.
- Jobs framework already supports idempotency, leases, retries, and queue introspection.
- GraphQL API conventions are stable and reusable.
2. Previous DEV-5398 branch contains solid re-port targets:
- Prompt/run/response table/repository/domain/schema foundations are already proven.
- Queue transaction coupling (`enqueue_in_tx`) and replay-first subscriptions were validated.
3. Prototype reference provides concrete durability behavior to preserve:
- Shortcode parser/validator/expander with preview/counting.
- Batch controls and pacing.
- Retry/regenerate/restart semantics for long-running or partial failures.
4. Frontend framework currently has one right rail only:
- Prompt UX requires a reusable nested-right-sidebar mechanic, not one-off state in one view.
5. Connections model already supports this direction:
- Connection type metadata and validation are centralized in `backend/src/domain/connections.rs`.
- Prompt Engine should reuse this shape rather than introducing a separate credential store.

## Connection routing model (final)
1. Selection precedence (deterministic)
- `connection_id` provided on prompt submission (highest priority).
- endpoint-scoped default mapping from Connections/Prompt routing config.
- provider-wide default mapping (fallback when endpoint-scoped default is absent).
- optional env fallback only when explicit dev fallback setting is enabled.
- otherwise fail with typed validation error.
2. Default mapping contract
- Add a dedicated routing surface (recommended table: `prompt_connection_defaults`) keyed by tenant/provider/(optional endpoint).
- Expose default assignment through Connections-facing API operations so users can mark defaults from Connections UX.
- Keep raw connection rows generic and reusable; avoid provider-specific hardcoding in base connection schema.
3. Runtime policy
- Production: real runs require resolved connection from Connections API.
- Local/dev: Connections still primary; env fallback disabled by default and opt-in only.
4. Batch behavior
- Batch runs inherit one resolved connection from parent prompt submission.
- Future extension point remains open for per-variant overrides, but not required for current scope.

## Integrated implementation plan (single delivery)
1. Core contracts and schema
- Add/restore prompt-engine schema in `backend/migrations/0003_prompt_engine.sql`:
  - `prompts`, `prompt_runs`, `responses`.
  - strict FKs, status checks, tenant/index strategy, prompt idempotency uniqueness.
- Extend domain models in `backend/src/domain/models.rs`.
- Re-introduce db repositories:
  - `backend/src/db/prompts.rs`
  - `backend/src/db/prompt_runs.rs`
  - `backend/src/db/responses.rs`

2. Prompt/response domain orchestration
- Implement `backend/src/domain/prompt_engine.rs` as orchestration boundary:
  - provider/endpoint/model compatibility validation from manifest.
  - prompt/run/response CRUD + listing.
  - aggregate prompt status derived from run statuses.
  - transactionally create runs + enqueue jobs.
  - emit `changes` + EventBus events for prompts/runs/responses.
- Keep prompt and response surfaces separate but relationally coherent.

3. Shortcode + batch engine (first-class)
- Add shortcode domain utilities shared by backend and frontend contracts:
  - token extraction (`[name]`), normalization, row validation, expansion iterator, preview generation.
- Persist batch spec as part of prompt contract (variables/settings JSON with explicit shape).
- Generate deterministic variant identity keys per expanded run for dedupe and replay safety.
- Add settings-backed guardrails:
  - optional hard-cap enable flag + cap value.
  - warning/validation messaging paths for extreme expansion.

4. Queue execution + durability semantics
- Register and execute `prompt_engine.run.execute` workers on existing jobs backbone.
- Add bounded retry/backoff with lease heartbeat and stale-lease recovery.
- Implement startup reconciliation:
  - repair `running`/leased runs left from crash/restart.
  - reconcile prompt aggregate status after recovery.
- Implement lifecycle actions:
  - retry failed outputs
  - full regenerate
  - restart/reconcile long-running polling flows
- Keep `completed_partial` terminal with metadata for failed/remaining outputs.

5. Provider puzzle-piece architecture + OpenAI first-class path
- Add provider manifest registry + executor trait/registry split:
  - manifest answers “what can be configured”
  - executor answers “how to run it”
- Integrate provider selection with Connections:
  - provider runs resolve credentials/config from `connection_id` and validated connection type.
  - allow multiple OpenAI connections and per-prompt key selection.
  - support provider/endpoint default connection mapping when `connection_id` is omitted.
- Add OpenAI puzzle piece first:
  - images path
  - videos path (async/polling-aware durability handling)
  - typed provider errors and usage/artifact mapping into `responses`.
  - connection-config support for either single key or split image/video keys with deterministic fallback.
- Add provider template module to clone for future providers (Gemini/Anthropic/etc.).

6. GraphQL full surface
- Extend `backend/src/api/schema.rs` with:
  - prompt/provider/run/response nodes + connections.
  - provider manifest metadata query (`promptProviderTypes`).
  - mutations for prompt/run/response lifecycle + retry/restart actions.
  - subscriptions: `promptChanged`, `promptRunChanged`, `promptResponseChanged` using replay-first + live stream.
- Preserve existing payload + `MutationError` + `clientMutationId` conventions.

7. Frontend framework + prompt UX
- Add reusable nested-right-sidebar shell/state pattern in app layout primitives.
- Add Prompts surface via `frontend/src/core/views.ts` and right-rail nav integration.
- Build prompt sidebar UX with core components:
  - textarea
  - provider/model endpoint selectors (metadata-driven)
  - connection selector (scoped to selected provider, with clear default indicator)
  - attachment DnD queue rows (name/type/size)
  - shortcode/batch section (toggle, rows, count, preview, validation)
  - submit + in-flight status actions
- Add run/response status surfaces with subscription updates and durability actions.
- Persist prompt-related UI preferences in `frontend/src/core/settings.svelte.ts`.

8. Settings + configurability
- Add prompt engine settings keys (frontend + backend persistence):
  - batch hard cap enabled
  - batch hard cap value (optional, fallback 1000 when enabled and unset)
  - optional submission pacing/concurrency knobs
  - allow env fallback for provider credentials (default false)
- Keep defaults performance-safe but operator-adjustable.

9. Quality gates and docs
- Backend:
  - `cargo fmt --manifest-path backend/Cargo.toml`
  - `cargo test --manifest-path backend/Cargo.toml`
  - `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- Frontend:
  - `pnpm -C frontend check`
  - `pnpm -C frontend test:e2e`
  - `pnpm -C frontend i18n:check`
- Docs:
  - keep this process doc current
  - update `docs/tasks.md` and add knowledge docs for provider plugin contract + prompt durability rules

## DRY and integration guardrails
- Extend existing `connections`, `jobs`, `changes`, GraphQL payload, and settings patterns instead of introducing parallel systems.
- Keep provider manifests/executors modular and decoupled.
- Keep shortcode rules centralized and reused across backend validation and frontend UX.
- Keep attachment model abstract (`temp` now, storage-backed later) to avoid future file-services rewrites.

## Clarifications resolved
1. OpenAI credentials:
- Support multiple OpenAI connections through Connections API.
- Connection config allows either one API key or split image/video keys.
2. Runtime policy:
- Production runs require resolved connection from Connections API.
- Env credentials are fallback-only and opt-in, with Connections still prioritized.
3. Prompt selection behavior:
- Users can submit prompt/batch jobs against different API keys by selecting different connections.
- Defaults are available to reduce friction when explicit selection is omitted.

## Files touched
- `backend/migrations/0003_prompt_engine.sql`
- `backend/src/api/schema.rs`
- `backend/src/db.rs`
- `backend/src/db/prompt_connection_defaults.rs`
- `backend/src/db/prompt_runs.rs`
- `backend/src/db/prompts.rs`
- `backend/src/db/responses.rs`
- `backend/src/domain/connections.rs`
- `backend/src/domain/models.rs`
- `backend/src/domain/prompt_engine.rs`
- `docs/process/DEV-5398-prompt-engine-mainline-tranche-b.md`

## Implementation update (2026-02-12)
### Completed in this round
- Re-ported and integrated Prompt Engine backend foundations on current `main`:
  - prompt/run/response db modules
  - domain orchestration
  - GraphQL prompt queries/mutations/subscriptions
  - migration `0003_prompt_engine.sql`
- Added explicit `completed_partial` prompt status semantics and run-aggregate derivation.
- Implemented connection routing defaults:
  - new table `prompt_connection_defaults`
  - domain APIs to set/clear/list defaults
  - deterministic resolution precedence: explicit -> endpoint default -> provider default -> opt-in env fallback.
- Added OpenAI as first-class connection type in Connections API with support for:
  - shared `api_key`
  - split `image_api_key` / `video_api_key`
  - validation requiring at least one key.
- Enforced strict OpenAI prompt connection compatibility at domain boundary.
- Extended GraphQL surface for prompt connection defaults management.
- Added/updated backend tests for:
  - strict connection requirement
  - endpoint-vs-provider default precedence
  - completed_partial status lifecycle
  - prompt engine GraphQL roundtrip with explicit connection.

### Completed in this round (runtime + worker continuation)
- Added in-process prompt job execution wiring:
  - app startup now spawns background workers via `jobs::spawn_background_workers`.
  - `prompt_engine.run.execute` jobs are now actively consumed by `JobRunner`.
- Added provider-executor puzzle-piece runtime in `backend/src/jobs/prompt_engine_worker.rs`:
  - provider registry abstraction (`PromptProviderRegistry` + `PromptProviderExecutor` trait).
  - OpenAI executor implemented as first concrete provider piece.
- Added real OpenAI execution paths:
  - image generation via `POST /v1/images/generations`.
  - video create via `POST /v1/videos`.
  - video polling via `GET /v1/videos/{id}` with retry-driven progression.
- Added run-progress durability behavior:
  - new domain operation `mark_prompt_run_running` to persist provider run IDs and running status safely.
  - prompt aggregate status reconciliation when runs move to running state.
- Hardened GraphQL mutation consistency for prompt connection defaults:
  - aligned clear/set payload behavior and rate-limit error shape.
- Added attachment safety guardrail for current temp-local stage:
  - only temp-local canonical paths are accepted for video seed uploads.
- Increased prompt job retry budget to support long-running provider polling workflows.

### Completed in this round (frontend prompt surface + nested rail)
- Added a reusable nested right-rail block for app-shell composition:
  - `frontend/src/lib/components/blocks/nested-right-rail.svelte`
  - supports icon rail + optional nested content panel on the same side.
- Integrated Prompt Engine as first nested right-rail panel in app chrome:
  - right rail now includes `Prompts` (sparkle icon) as a panel toggle alongside existing right-nav views.
- Implemented Prompt Engine panel UX in Svelte 5:
  - provider/endpoint/model selectors from `promptProviderTypes`.
  - connection selector with explicit/default mode and resolved-connection visibility.
  - endpoint + provider default management actions via GraphQL.
  - prompt text input + dynamic endpoint config field rendering.
  - attachment dropzone integration for temp-local first pass.
  - shortcode batch expansion + preview + optional settings-backed hard cap controls.
  - prompt submission flow creating one prompt + N prompt runs transactionally from frontend intent.
  - run/response status monitor for recent prompts with polling refresh while runs are active.
- Added frontend core modules to keep the panel thin and DRY:
  - `frontend/src/core/prompt-engine-client.ts` (typed GraphQL client surface).
  - `frontend/src/core/prompt-shortcodes.ts` (shortcode parsing/expansion helpers).
- Added new prompt settings keys in core settings state:
  - `promptBatchHardCapEnabled`
  - `promptBatchHardCapValue`
  - `promptEngineAllowEnvFallback`
- Added prompt i18n keys across all locales via shared messages map updates.

### Completed in this round (worker compatibility for batch variants)
- Updated OpenAI worker execution to prefer run-level `input.prompt_text` when present.
- This enables shortcode-expanded variants to run as separate prompt-runs under a single prompt.
- Added worker unit tests for run-level prompt text override/fallback behavior.

### Remaining for full scope
- Runtime hardening follow-ups:
  - configurable polling/retry knobs via settings surface instead of constants.
  - explicit startup reconciliation for previously leased/running prompt-run jobs.

## Validation performed during final planning round
- `git branch -m zdlldz/dev5398-finalplan`
- `git branch -m zdlldz/dev5398-conn-policy`
- `git branch -m zdlldz/dev5398-impl`
- `git rev-list --left-right --count main...HEAD`
- `git show codex/dev-5398-mainline-replan:backend/src/domain/prompt_engine.rs`
- `git show codex/dev-5398-mainline-replan:backend/migrations/0003_prompt_engine.sql`
- `git show codex/dev-5398-mainline-replan:backend/src/db/prompts.rs`
- `git show codex/dev-5398-mainline-replan:backend/src/db/prompt_runs.rs`
- `git show codex/dev-5398-mainline-replan:backend/src/db/responses.rs`
- `git show codex/dev-5398-mainline-replan:docs/knowledge/prompt-engine-foundation.md`
- Discovery reads on:
  - `backend/src/domain/connections.rs`
  - `backend/src/db/jobs.rs`
  - `backend/src/api/schema.rs`
  - `frontend/src/App.svelte`
  - `frontend/src/core/views.ts`
  - `frontend/src/core/settings.svelte.ts`
  - `references/MediaMachine/backend/src/api/openai.ts`
  - `references/MediaMachine/frontend/src/utils/shortcodes.ts`

## Validation performed during this implementation round
- `cargo fmt --manifest-path backend/Cargo.toml`
- `cargo test --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend check` (pass; warnings only)
- `pnpm -C frontend test:e2e` (pass; 12/12)

## Validation performed during frontend stabilization pass
- `git branch -m zdlldz/dev5398-polish-pass`
- `pnpm -C frontend check` (pass; warnings only)
- `pnpm -C frontend test:e2e` (pass; 12/12)

## Validation performed during final polish + sanity pass
- `git branch -m zdlldz/dev5398-final-polish`
- `cargo fmt --manifest-path backend/Cargo.toml`
- `cargo test --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `pnpm -C frontend i18n:check`
- `pnpm -C frontend check` (pass; 0 errors, 0 warnings)
- `pnpm -C frontend test:e2e` (pass; 12/12)

## Files touched in this round
- `backend/src/jobs/prompt_engine_worker.rs`
- `frontend/src/App.svelte`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/core/prompt-engine-client.ts`
- `frontend/src/core/prompt-shortcodes.ts`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/lib/components/blocks/datatable.svelte`
- `frontend/src/lib/components/blocks/file-tree-item.svelte`
- `frontend/src/lib/components/blocks/nested-right-rail.scss`
- `frontend/src/lib/components/blocks/nested-right-rail.svelte`
- `frontend/src/lib/components/ui/accordion/accordion-content.svelte`
- `frontend/src/lib/components/ui/collapsible/collapsible-content.svelte`
- `frontend/src/lib/components/ui/search-field.svelte`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/folder-viewer-view.svelte`
- `frontend/src/views/grid-view.svelte`
- `frontend/src/views/prompts-panel.scss`
- `frontend/src/views/prompts-panel.svelte`
- `frontend/tests/grid.spec.ts`

## Notes
- Previous stale branches remain reference-only.
- This plan is now locked to forward-most `main` conventions and user-confirmed architecture decisions.
- Adversarial PR review follow-up: `docs/process/DEV-5398-prompt-response-api-pr-33-review.md`.
- Rust deep-pass follow-up + persona draft: `docs/process/DEV-5398-rust-deep-review-persona.md`.
- Hardening implementation follow-up: `docs/process/DEV-5398-prompt-engine-hardening-round-2.md`.
- Batch streaming/memory optimization follow-up: `docs/process/DEV-5398-prompt-engine-hardening-round-3.md`.
- Batch mutation + reconciliation audit follow-up: `docs/process/DEV-5398-prompt-engine-hardening-round-4.md`.
- Adaptive chunk tuning + final sanity follow-up: `docs/process/DEV-5398-prompt-engine-hardening-round-5.md`.
