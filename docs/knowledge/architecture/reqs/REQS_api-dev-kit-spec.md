# API Dev Kit Requirements (Day‑0 “Right Way” Developer Spec)

> **Purpose**  
> This document defines the opinionated, “day‑0 correct” requirements for an internal GraphQL API dev kit built on **Rust + SQLite + Svelte 5 + Tauri 2**. The goal is to build the API as if it will eventually serve **many concurrent users** in a **multi‑tenant** environment (Figma/Linear‑like), while still running locally today.  
>
> The spec prioritizes **durability, performance, and long‑term maintainability** over short‑term convenience.

---

## 0) Guiding Principles

### 0.1 Single contract, durable core
A local-first app that becomes hybrid must not “change its shape” midstream. We therefore standardize on a single contract (GraphQL), strict identity/versioning, and durable background execution so local and remote modes share the same semantics.

**Spec**
- GraphQL is the only API contract.
- Domain/business logic is independent of transport.
- IDs/versioning/tenancy are enforced at the storage + domain layers (not only at the GraphQL boundary).
- Long-running/multi-step work is expressed as durable jobs, not fat GraphQL mutations.
- All state changes generate append-only change records for observability and eventual sync.

---

## 1) Chosen Direction (No Hedging)

### 1.1 GraphQL stack
A robust internal API requires mature subscriptions, type ergonomics, DataLoader support, and extension hooks (cost limits, tracing, auth). We standardize on the most proven Rust stack for this.

**Spec**
- **GraphQL:** `async-graphql`
- **Transport:** `axum` + `async-graphql-axum`
- **Subscriptions:** WebSocket (GraphQL WS)

### 1.2 Local transport
To avoid maintaining multiple invocation paths (which adds complexity and divergence), we use the same transport model locally as we would remotely.

**Spec**
- Local UI communicates with backend via **loopback HTTP** only.
- Bind server to **127.0.0.1** only.
- Choose an **ephemeral port**.
- Require an **app-generated auth token** per session, passed via header (e.g., `Authorization: Bearer <token>`).

### 1.3 Identity + versioning
High-concurrency systems require stable IDs and concurrency control from day 0. Changing these later is expensive. We choose time-ordered IDs and strict optimistic concurrency.

**Spec**
- Entity IDs: **UUIDv7** (time-ordered)
- SQLite storage for IDs: **BLOB(16)**
- Every mutable row includes:
  - `version INTEGER NOT NULL` (optimistic concurrency)
  - `created_at` / `updated_at` (UTC)
- Every write transaction inserts records into an append-only **`changes`** table.

---

## 2) Goals

### 2.1 Functional goals
Local-first requires responsive reads/writes and offline durability. Hybrid later requires multi-tenant correctness and reliable change propagation.

**Spec**
- Single GraphQL schema usable in:
  - local embedded runtime (Tauri) today
  - remote service later (without changing core semantics)
- Durable long-running operations:
  - retryable, cancelable, resumable jobs
  - progress reporting + persisted logs
- Multi-tenant foundations from day 0:
  - strict `tenant_id` on all domain tables
  - tenant scoping enforced in repositories

### 2.2 Non-functional goals
The database will be row-heavy and relation-heavy. SQLite write serialization must be respected; durability depends on tight transactions and background work offloading.

**Spec**
- High performance for relational workloads:
  - WAL + pooling + strict backpressure
- Extensible module architecture:
  - new domain modules added with minimal coupling
- Safe JSON-first handling:
  - size limits, schema-versioning, validation, derived indexing

---

## 3) Architecture

### 3.1 Layering rules (hard boundaries)
Long-term maintainability depends on keeping the contract (GraphQL) separate from the core logic (domain). This makes it possible to evolve transport or add other internal entry points without rewriting business logic.

**Spec**
- `api/` — GraphQL schema + resolvers (thin)
- `domain/` — services + business rules (**no dependency on `api`**)
- `db/` — repositories + SQL + migrations
- `jobs/` — durable queue + worker runtime
- `events/` — event bus + pub/sub + persistence
- `auth/` — actor/tenant context + permission helpers
- `sync/` — sync interfaces + baseline push/pull
- `shared/` — IDs, error types, time utils, json utilities

**Resolver rule**
- Resolvers may call only domain services; domain services call repos/jobs/events. No SQL in resolvers.

### 3.2 Runtime model
The system must run locally with background work and subscriptions, so the backend runtime includes HTTP + WebSocket + workers + event dispatch.

**Spec**
Single process runtime (Tauri backend) runs:
- `axum` GraphQL HTTP server
- WebSocket server for subscriptions
- background job workers (Tokio tasks)
- event dispatcher (fan-out to subscriptions + outbox)

---

## 4) SQLite Configuration + Usage

### 4.1 Operational pragmas
SQLite durability and concurrency characteristics depend heavily on correct pragmas. WAL mode enables concurrent readers while writes serialize; we therefore minimize write transaction duration.

**Spec**
- `PRAGMA journal_mode = WAL;`
- `PRAGMA foreign_keys = ON;`
- `PRAGMA busy_timeout = <non-trivial>;`
- Consider:
  - `PRAGMA synchronous = NORMAL;` (local performance)
  - `PRAGMA synchronous = FULL;` (max durability environments)

### 4.2 Pooling + concurrency discipline
SQLite supports many readers but serializes writers. To remain performant, DB work must be brief and CPU-heavy work must run off the async executor.

**Spec**
- Use `sqlx` with a pool.
- DB transactions must be tight and short-lived.
- CPU-heavy tasks must not run on async executor threads:
  - use a dedicated CPU pool for job work.
- Design around write serialization:
  - move heavy multi-row operations into jobs
  - avoid long transactions in GraphQL request path

---

## 5) GraphQL Design Requirements

### 5.1 Schema patterns
The API will serve multiple clients and evolve over time. Consistent patterns reduce entropy and make generated tooling reliable.

**Spec**
- Use consistent pagination:
  - either Relay connections or `first/after` pagination across lists
- Mutations return payload objects including:
  - `result`
  - `errors[]`
  - optional `jobId`
  - optional `clientMutationId`

### 5.2 Concurrency contract (non-negotiable)
Concurrent editing (UI + background jobs + other users) must be safe. Optimistic concurrency is the simplest durable baseline.

**Spec**
- Every mutation updating an existing entity must accept `expectedVersion`.
- On mismatch:
  - return a structured conflict error (not a generic failure).
- Version increments on every successful update.

### 5.3 Cost controls
Even internal APIs can be abused accidentally (bad queries, expensive nested selection sets). Cost controls prevent accidental outages and stabilize performance.

**Spec**
- Server-side operation timeout
- Query depth limit
- Query complexity limit
- Per-operation tracing + “slow operation” logging

### 5.4 N+1 prevention (DataLoader required)
GraphQL is prone to N+1 query patterns. Preventing this is mandatory for performance as data volume and relationship density increase.

**Spec**
- Provide DataLoaders in request context:
  - by-id loaders
  - relation loaders (e.g., memberships by user, docs by tenant)
- Resolvers must not query in loops.

---

## 6) Durable Job System (First-Class)

### 6.1 Why jobs are required
In a row-heavy system, multi-step and heavy operations will block the DB and degrade UX if done synchronously. Durable jobs provide retries, cancellation, and progress reporting.

**Spec**
If an operation is any of:
- multi-step
- touches many rows
- uses filesystem / media / network
- takes > ~100–300ms
…it must be queued as a job.

### 6.2 Required job capabilities
Durability and correctness require idempotency, retries, and cancellation. Observability requires persisted progress and logs.

**Spec**
- Enqueue supports **idempotency keys**
- Execution uses **leases/locks** with heartbeats
- Retries with exponential backoff + max attempts
- Cancellation token support
- Progress events + logs persisted to DB

### 6.3 Persistence tables
Jobs must survive process restarts; their state and progress must be queryable.

**Spec**
- `jobs` — canonical state
- `job_events` — progress/log stream (bounded retention)

---

## 7) Events + Subscriptions

### 7.1 Domain events
Reactive UIs and sync foundations rely on a consistent event stream. Events must be generated transactionally with state changes to avoid missing updates.

**Spec**
- All state changes emit domain events.
- Events are persisted (via `changes`) and fanned out to:
  - GraphQL subscriptions
  - job triggers
  - sync/outbox mechanisms

### 7.2 Append-only changes table (mandatory)
An append-only change log enables:
- pull since cursor
- reliable subscriptions
- replay/debugging
- eventual remote sync

**Spec**
- Every mutation that changes state must insert at least one record into `changes` **within the same transaction** as the write.

---

## 8) JSON-First Storage + GraphQL Durability/Safety

### 8.1 Why JSON needs strict rules
JSON models are flexible but can become unbounded, unvalidated, and unsafe. This leads to performance issues (large payloads), schema drift, and rendering/security risks.

**Spec**
- JSON payloads must be size-limited, schema-versioned, and validated on write.
- JSON values must not be treated as executable instructions.
- When JSON drives rendering, sanitize at render time (and validate structure at write time).

### 8.2 GraphQL representation
GraphQL needs a flexible scalar for JSON while still enforcing structure and versioning around it.

**Spec**
- Provide a JSON scalar (e.g., `JSON`).
- Wrap JSON in explicit inputs that include a schema version, e.g.:
  - `input ContentInput { schemaVersion: Int!, data: JSON! }`
- Never accept raw `JSON` without:
  - size limit check
  - schema version presence
  - domain validation pass

### 8.3 Validation strategy (Day-0 requirement)
Multi-client evolution requires explicit versioning and migrations. Validation ensures safety and predictable behavior.

**Spec**
- Every JSON “document type” must define:
  - `schema_version` integer
  - `validate(data) -> Result`
  - optional `canonicalize(data) -> data` (for stable diffs)
- Validation approach (choose per type):
  - JSON Schema validation for general documents
  - custom validators for performance-critical structures
- Define a per-version migration plan:
  - `vN -> vN+1` transformations where appropriate

### 8.4 Storage strategy in SQLite
JSON1 querying is possible but expensive at scale. Derive columns for frequently queried fields to keep queries fast and indexable.

**Spec**
- Store JSON as `TEXT` (canonical JSON string) if JSON1 queries may be needed.
- Maintain derived columns for indexable fields (e.g., `title`, `status`, `type`).
- Avoid JSON-extract on hot paths; query derived columns instead.

### 8.5 Safety limits (mandatory)
Prevent DoS and pathological payloads by enforcing constraints at the boundary.

**Spec**
- Hard maximum payload sizes per JSON document type.
- Maximum nesting depth and element count where feasible.
- Reject suspiciously large arrays/objects unless explicitly required.

---

## 9) Multi-Tenant + Permissions

### 9.1 Auth context
Future multi-user correctness requires that every request has an explicit actor + tenant scope and that the scope is available everywhere.

**Spec**
Every request context includes:
- `actor_user_id`
- `tenant_id`
- `roles/permissions`
- `device_id` (sync lineage foundation)

### 9.2 Enforcement level
Tenant scoping must be enforced at the DB/repository level so it cannot be bypassed by resolver mistakes.

**Spec**
- Repository queries must include tenant scope filters by default.
- Domain services must not expose unscoped data access.

---

## 10) Starter “Minimum Viable Domain” (Proves the Architecture)

### 10.1 Why a small domain matters
The starter kit should demonstrate all core patterns (tenancy, concurrency, jobs, subscriptions, changes) without becoming a full product.

**Spec**
Starter entities:
- `tenants`
- `users`
- `memberships`
- `documents`
- `jobs`
- `changes`

Starter GraphQL operations:
- Query:
  - `viewer`, `tenant`, `documents(first, after)`
- Mutations:
  - `createDocument(input)`
  - `updateDocument(id, expectedVersion, contentInput|patchInput)`
  - `enqueueImportJob(idempotencyKey, input)`
- Subscriptions:
  - `documentChanged(tenantId)`
  - `jobProgress(jobId)`

---

## 11) Concrete Starter DB Schema (Recommended Baseline Shape)

### 11.1 Core tables (shape sketch)
A row-heavy relational workload requires explicit indexes and tenant scoping. IDs are BLOB(16) UUIDv7.

**Spec (schema sketch; final DDL provided separately)**
- `tenants(id BLOB(16) PK, …)`
- `users(id BLOB(16) PK, …)`
- `memberships(tenant_id BLOB(16), user_id BLOB(16), role TEXT, …, PK(tenant_id,user_id))`
- `documents(id BLOB(16) PK, tenant_id BLOB(16), version INT, title TEXT, content_json TEXT, content_schema_version INT, created_at, updated_at, …)`
- `changes(change_id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id BLOB(16), entity_type TEXT, entity_id BLOB(16), op TEXT, payload_json TEXT NULL, created_at TEXT)`
- `jobs(id BLOB(16) PK, tenant_id BLOB(16), status TEXT, idempotency_key TEXT, run_at, locked_at, locked_by, attempts INT, payload_json TEXT, created_at, updated_at)`
- `job_events(id INTEGER PK, job_id BLOB(16), at TEXT, level TEXT, message TEXT, progress REAL, payload_json TEXT)`

### 11.2 Index requirements
Indexes must support tenant-scoped pagination, change feed consumption, and job scheduling.

**Spec**
- `documents(tenant_id, updated_at)`
- `changes(tenant_id, change_id)`
- `jobs(tenant_id, status, run_at)`
- Add derived-field indexes as needed (e.g., `(tenant_id, title)`).

---

## 12) Operational Defaults

### 12.1 Migrations
Schema evolution must be deterministic and consistent across local and future remote deployments.

**Spec**
- Migration runner required and shared between local and server builds.
- Migrations are executed on startup in a controlled, logged sequence.

### 12.2 Observability
Durable operations require visibility into the request path and job execution.

**Spec**
- Structured logs (JSON)
- Tracing spans per GraphQL operation and per job step
- “Slow operation” thresholds with log emission
- Minimal metrics:
  - queue depth, job duration, retry counts, DB time

### 12.3 Admin debug surface (internal)
Developer velocity improves when job and change systems are inspectable via GraphQL.

**Spec**
Admin-only operations to:
- list jobs + cancel/retry
- view recent changes
- view DB health snapshot (pool state, queue depth)

---

## Appendix A) Key Terms (for consistency)

- **Tenant:** Workspace/account boundary; every row is scoped by `tenant_id`.
- **Actor:** The authenticated user (or system agent) performing an operation.
- **Change log:** Append-only record of state changes used for subscriptions and eventual sync.
- **Job:** Durable background operation with retries, progress, and cancellation.
