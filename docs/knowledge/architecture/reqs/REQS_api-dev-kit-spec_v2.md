# API Dev Kit Spec v2 (Revised Draft)

Status: Draft (revised)
Date: 2026-01-27
Revised: 2026-01-27
Based on: `docs/REQS_api-dev-kit-spec.md` (v1)

Summary: This v2 spec preserves the v1 foundations while tightening unresolved decisions, operational details, and safety edges needed for a durable, multi-tenant, local-first GraphQL backend.

---

## 0) Handoff checklist (read first)
- Read: `agents.md`, `docs/REQS_api-dev-kit-spec.md` (v1), and this document.
- Use pinned toolchain: `rust-toolchain.toml`.
- Config sources of truth: `config/app.json`, `config/features.json`.
- Directory intent (backend):
  - GraphQL: `backend/src/api/`
  - Domain: `backend/src/domain/`
  - Repos/DB: `backend/src/db/`
  - Jobs: `backend/src/jobs/`
  - Events: `backend/src/events/`
  - Auth: `backend/src/auth/`
  - Sync: `backend/src/sync/`
  - Shared: `backend/src/shared/`
- Process hygiene (per `agents.md`): create a process doc for each task, update `docs/tasks.md`, and update `docs/knowledge/` when durable learnings emerge.

---

## 1) Scope and goals (v2)
- Keep the v1 core: Rust + SQLite + async-graphql + axum, local loopback HTTP, single GraphQL contract.
- Make day-0 decisions that avoid later churn: storage invariants, auth bootstrap, job orchestration, subscription semantics, and safety limits.
- Prove the architecture with a minimal domain while enabling future multi-tenant, multi-user scale.

Non-goals (v2):
- Production multi-region hosting.
- External third-party auth providers (can be layered later).
- Full sync engine (only interfaces and scaffolds in v2).

---

## 2) Adversarial review of v1 (gaps + risks)

1) Auth/token lifecycle is under-specified
- Risk: loopback tokens can leak via logs, crash reports, or debugger tools.
- Missing: token issuance, rotation, TTLs, revocation, and secure storage (OS keychain vs file).
- Missing: WebSocket auth and re-auth on reconnect.

2) Bootstrap flow is unclear for local-first, multi-tenant
- Risk: inconsistent first-run initialization and tenant/user creation.
- Missing: deterministic bootstrap sequence, default tenant/user creation, and idempotent setup.

3) SQLite concurrency mechanics are too vague
- Risk: "busy" errors and fragile throughput once jobs and requests overlap.
- Missing: concrete pool sizing, connection options, per-connection pragmas, and write serialization policy.

4) Jobs system needs locking and idempotency details
- Risk: double execution, stuck jobs, or starvation.
- Missing: lease duration, heartbeats, lock ownership, and cleanup strategy.
- Missing: idempotency key uniqueness scope (tenant + job type + key?)

5) Changes/events retention policy not defined
- Risk: unbounded growth; slow queries; subscription replay cost.
- Missing: retention window, pruning strategy, and archival options.

6) Cost controls are named but not actionable
- Risk: either overly permissive or disruptive default limits.
- Missing: default complexity/depth/time thresholds and observability on rejections.

7) JSON rules lack concrete validation tooling
- Risk: validation drift and inconsistent canonicalization.
- Missing: per-type schema registry, versioned validators, and canonical JSON rules.

8) Subscription semantics are incomplete
- Risk: missed events or duplicate delivery on reconnects.
- Missing: cursor-based replay, resume tokens, and backpressure strategy.

9) Testing strategy for concurrency + durability not defined
- Risk: regressions that only show up under contention or restart conditions.
- Missing: job retry tests, change log integrity tests, subscription replay tests.

---

## 3) v2 decisions (affirmed from v1)
- GraphQL: async-graphql on axum with GraphQL over HTTP + WebSocket subscriptions.
- Transport: loopback HTTP only; bind 127.0.0.1; ephemeral port per session.
- IDs: UUIDv7 stored as BLOB(16).
- Optimistic concurrency via `version` on all mutable rows.
- Append-only `changes` table written in the same transaction as state changes.
- Durable jobs for multi-step / long-running / heavy IO or multi-row operations.

---

## 4) v2 decision refinements (new in v2)

### 4.1 Auth/token lifecycle (loopback)
- Tokens are short-lived, per-session, in-memory by default.
- Token issuance: backend generates token at startup; frontend fetches via a Tauri command (IPC) that is only exposed to the app shell.
- Token storage: avoid disk persistence; if persistence is required later, use OS keychain.
- WebSocket auth: require token via connection params (GraphQL WS `connection_init`) and accept `Authorization` header where available.
- Token rotation: rotate on app restart; invalidate on shutdown.
- Token expiry: default TTL 8 hours; frontend refreshes via IPC when expired.

### 4.2 Bootstrap sequence
- On startup, run migrations, then ensure base records exist:
  - create default tenant if none exists.
  - create local user and membership.
- Bootstrap is idempotent and transactionally safe.

### 4.3 SQLite runtime configuration
- Use sqlx SQLite pool with explicit connect options:
  - `journal_mode = WAL`, `foreign_keys = ON`, `busy_timeout = 5000` (initial default).
  - `synchronous = NORMAL` default for local; allow config override to `FULL` for max durability or server use.
- Writer discipline: single-writer lock in app layer to keep write tx short and serialized.
- Long tasks run off the async runtime on a dedicated blocking pool.
- Pool sizing defaults: min 1, max 8 connections; keep max small to reduce contention.

### 4.4 Jobs system rules
- Job identity: (tenant_id, job_type, idempotency_key) unique.
- Lease model: job row includes `locked_at`, `locked_by`, `lease_expires_at`.
- Worker must heartbeat before lease expiry; on expiry, job becomes available.
- Retries: exponential backoff with max attempts; failed jobs stay queryable.
- Cancellation: set status to `canceled`, workers must check and stop.
- Job payloads include `payload_version` (integer) to allow forward-compatible schema changes.

### 4.5 Changes/events retention + payload shape
- Default retention window: 30 days (configurable).
- Pruning job compacts old events; change log retains minimal metadata.
- Provide admin GraphQL to inspect retention and run prune.
- `changes` payload strategy:
  - Always store a compact envelope: `entity_type`, `entity_id`, `op`, `entity_version`, and `tenant_id`.
  - `payload_json` is optional and typed by `payload_kind` (`none` | `patch` | `snapshot`).
  - Default to `patch` for updates, `snapshot` for creates when useful, and minimal tombstone data for deletes.
- Change payload mapping (day 0):
  - `tenants`: `snapshot` on create, `patch` on update, `none` on delete.
  - `users`: `snapshot` on create, `patch` on update, `none` on delete.
  - `memberships`: `snapshot` on create, `patch` on update, `none` on delete.
  - `documents`: `snapshot` on create (metadata + content hash), `patch` on update (changed fields + content hash), `none` on delete.
  - `jobs`: `none` (use `job_events` for progress).

### 4.6 Cost controls (defaults)
- Operation timeout: 5s default (configurable).
- Depth limit: 12 default.
- Complexity limit: 5,000 default.
- Log structured rejection events (query hash, actor, tenant).
- Per-tenant rate limits (in-memory, per-process) with conservative defaults to prevent runaway usage.
- Rate limit defaults (token-bucket, per tenant):
  - Ops: 600/min, burst 120.
  - Mutations: 120/min, burst 30.
  - Complexity budget: 100,000/min, burst 20,000 (cost counted per op).
  - Subscriptions: 10 concurrent per tenant.
- Rate limit key: `tenant_id` when available, else `device_id`; system actors (jobs) bypass limits.

### 4.7 JSON schema registry
- Maintain a registry per document type with:
  - schema_version -> validator
  - canonicalize(data)
  - max_size_bytes
  - max_depth/max_elements (where applicable)
- Canonical JSON: stable ordering, stable whitespace (serialize via canonicalizer).
- Use canonical JSON to compute `content_hash` for documents and include it in change payloads.

### 4.8 Subscriptions + replay
- Each subscription supports optional `sinceChangeId` for replay.
- On reconnect, client re-subscribes with last seen change id.
- Backpressure: cap in-memory queue per subscriber; drop and force resubscribe if overflow.

### 4.9 Testing focus
- Add unit + integration tests for:
  - version conflicts
  - job leasing + retries
  - change log integrity (same transaction)
  - subscription replay from cursor

---

## 5) Starter domain (v2 validation scope)
- Entities: tenants, users, memberships, documents, jobs, changes.
- GraphQL operations:
  - Query: viewer, tenant(id), documents(first, after)
  - Mutations: createDocument, updateDocument(expectedVersion), enqueueImportJob
  - Subscriptions: documentChanged(tenantId, sinceChangeId), jobProgress(jobId)

---

## 6) Implementation plan (phased)

Phase 0 - schema and scaffolding
- Define DB schema + migrations for core tables.
- Add shared types (UUIDv7, time, error types).
- Add change log insertion helper.
- Add job payload versioning column and change payload kind fields.

Phase 1 - data access + domain core
- Repos enforce tenant scoping by default.
- Domain services implement document CRUD + concurrency checks.
- Job queue tables and leasing helpers.
- Add rate limiting primitives (per-tenant, per-process).

Phase 2 - GraphQL API
- GraphQL schema + resolvers (thin).
- DataLoader wiring and request context.
- Cost controls and tracing.
- Auth token handoff command and WS connection auth enforcement.
- Rate limit errors mapped to GraphQL error codes and retry hints.

Phase 3 - jobs + subscriptions
- Worker runtime, lease/heartbeat, retry policies.
- Subscription fan-out from changes table.
- Replay support with `sinceChangeId`.

Phase 4 - admin/debug
- Admin GraphQL: list jobs, cancel/retry, inspect changes.
- Health snapshot: DB pool stats, queue depth.

Phase 5 - tests + docs
- Concurrency tests, job tests, replay tests.
- Update docs/knowledge when design decisions are finalized.

---

## 7) Open questions (remaining)
- None. Defaults are defined; revisit after Phase 0 if real-world usage indicates changes.

---

## 8) Decision log
- 2026-01-27: Draft v2 spec created from v1 with clarified auth, jobs, and retention.
- 2026-01-27: Incorporated responses; locked auth handoff, rate limits (per-tenant), change payload strategy, job payload versioning, and SQLite `synchronous` defaults.
- 2026-01-27: Finalized default rate limits, change payload mapping, and token TTL.

---

## 9) Process notes
- Next step is to validate open questions and lock defaults before code implementation.
