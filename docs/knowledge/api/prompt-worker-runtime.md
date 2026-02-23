# Prompt Worker Runtime
Tags: prompt-engine, jobs, openai, backend
Date: 2026-02-13
Summary: Prompt run jobs execute in-process with lease heartbeat, stale-running recovery, terminal-state reconciliation, and OpenAI image/video provider execution.

## Runtime flow
- Prompt submission creates `prompt_runs` rows and enqueues `prompt_engine.run.execute` jobs transactionally.
- The app starts an in-process `JobRunner` at startup.
- `JobRunner` leases eligible jobs (queued/retry + stale running leases) and routes prompt jobs to the provider registry in `backend/src/jobs/prompt_engine_worker.rs`.
- While a handler executes, JobRunner sends lease heartbeats to prevent duplicate reclaim for long operations.

## Provider executor architecture
- Provider execution is routed through a registry (`PromptProviderRegistry`) keyed by `provider_id`.
- Each provider is a separate executor puzzle piece implementing `PromptProviderExecutor`.
- Current release manifest/runtime only exposes executable OpenAI endpoints (`images`, `videos`).

## OpenAI behavior
- Credentials resolve from Connections first (`connection_id`), then endpoint-specific env fallback:
  - `images`: `image_api_key` -> `api_key` -> `OPENAI_API_KEY_IMAGE` -> `OPENAI_API_KEY`
  - `videos`: `video_api_key` -> `api_key` -> `OPENAI_API_KEY_VIDEO` -> `OPENAI_API_KEY`
- `OpenAI-Organization` and `OpenAI-Project` headers are forwarded when set.
- Images use `POST /v1/images/generations` and persist a completed response.
- Videos use `POST /v1/videos`, persist provider run id on the run, then poll `GET /v1/videos/{id}` on retries until terminal.

## Retry and durability notes
- Prompt jobs now use a high retry budget (`max_attempts = 1000`) for long-running video polling.
- Non-retryable OpenAI HTTP statuses (`400/401/403/404/422`) persist a failed response immediately.
- Retryable failures bubble to JobRunner retry backoff.
- On prompt job terminal failure (max attempts or no handler), JobRunner reconciles prompt-run terminal state so `jobs`, `prompt_runs`, and `prompts` remain consistent.
- Manual `cancelJob` for prompt jobs now terminalizes the linked run state before marking queue state canceled.
- Reconciliation paths now persist explicit `job_events` audit entries (including trigger and terminal state context) for:
  - no handler terminalization
  - max-attempt terminalization
  - manual cancel terminalization
- Reconciliation audit events are exposed via GraphQL `adminJobEvents` for tenant-scoped operational inspection.

## Security guardrail
- Video seed attachments are only accepted from temp-local paths.
- Attachment path extraction requires canonical path under `std::env::temp_dir()`.
- Paths outside temp are ignored.
- Video seed files are metadata-validated and bounded by size before read (`20 MiB` max).
