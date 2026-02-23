# GPU Video Processing Platform (Rust)
Discovery Doc v1 — High-throughput, enterprise-class media pipeline

## 1) Executive summary
We are building a **high-throughput media processing platform** capable of:
- Multi-format ingest (video/audio)
- Proxy + mezzanine generation
- ABR ladder transcodes (HLS/DASH)
- Frame extraction (thumbnails/storyboards)
- Filters (scale, crop, overlay, colorspace, tone-map when possible)
- Audio strip/replace/normalize
- Media analysis (codec/container inspection, QC signals)

The system is designed for **GPU-powered servers** (NVIDIA-first) and aims to maximize throughput via:
- **NVDEC (GPU decode) → GPU filters → NVENC (GPU encode)**
- Avoiding GPU↔CPU frame copies whenever possible
- Efficient scheduling across GPUs and nodes

We will support **multiple execution engines** behind one internal pipeline abstraction:
- **FFmpeg Engine (default)** — ubiquitous, fast iteration, broad codec/container support
- **GStreamer Engine (optional)** — graph pipelines, branching/multi-output flows, streaming-style ops

Rust will power the API + orchestration + worker services.

---

## 2) Goals
### Primary goals
1. **Maximum throughput per GPU** for common workloads (proxies, ladders, transcodes, thumbnails).
2. **Durable execution** (retries, crash recovery, idempotency, exactly-once output semantics).
3. **Multi-tenant isolation** with strong security boundaries.
4. **Deterministic, versioned pipelines** (reproducible processing).
5. **Operational excellence** (observability, auditability, predictable scaling).

### Secondary goals
- Pluggable engines (FFmpeg and/or GStreamer) without API changes.
- Hybrid on-prem / cloud compatibility.
- Local desktop app (Svelte 5 + Tauri) that can offload work to the backend.

---

## 3) Non-goals (v1)
- A full video editor timeline engine.
- Real-time interactive streaming (we can evolve toward this later).
- Writing a custom codec/encoder stack (we leverage NVENC/NVDEC + mature engines).

---

## 4) Core principles
1. **Hardware acceleration first** (NVIDIA NVENC/NVDEC, future: Intel QSV, AMD AMF).
2. **Keep frames on GPU** (decode → filter → encode on-device).
3. **Job execution is stateless** at the worker level; state lives in durable storage.
4. **Idempotent outputs** (same inputs + same pipeline spec → same outputs).
5. **Version everything**: pipeline spec versions, engine versions, presets, codec knobs.

---

## 5) System architecture (high level)

### Services
1. **Control Plane / Orchestrator API (Rust)**
   - Auth + multi-tenant routing
   - Job creation and validation
   - Pipeline compilation (Recipe → Execution Plan)
   - Scheduling + dispatch
   - State machine transitions

2. **Worker Plane (Rust)**
   - Poll/subscribe to queue
   - Acquire resources (GPU tokens)
   - Execute engine pipeline
   - Emit progress + metrics
   - Upload results + finalize outputs

3. **Engine Adapters (Rust modules)**
   - `ffmpeg_engine`: build commands / parse progress / manage sidecars
   - `gstreamer_engine`: build graphs / run pipelines / parse bus events

4. **Storage layer**
   - Object storage for media: S3-compatible (AWS S3 / MinIO)
   - Database for metadata + state
   - Optional CDN for distribution

5. **Observability**
   - Logs, traces, metrics, per-job artifact capture

### Data plane
- Media sources and outputs are stored as objects (chunked, resumable upload).
- All pipeline actions reference immutable objects + versioned specs.

---

## 6) Recommended infrastructure stack (ideal)

### Database (extreme multi-user performance)
**PostgreSQL 16+** as the system of record, because it provides:
- Strong consistency and transactional workflows
- Excellent indexing + JSONB + partitioning
- Mature ecosystem for HA/replication
- Row-level security (RLS) for multi-tenancy

**Key additions**
- **pgBouncer** for connection pooling
- Read replicas for analytics/query load
- Partitioning for large tables (events, metrics, job logs)

> Optional scale-out: **Citus** for sharding certain large multi-tenant tables (if/when needed).

### Queue / eventing
**NATS JetStream** (preferred for simplicity + performance)
- Work queue semantics
- At-least-once delivery
- Fast pub/sub for progress events

Alternative: Kafka (heavier ops, great for huge event volume).

### Object storage
- **S3** (or MinIO on-prem)
- Server-side encryption
- Lifecycle policies (tiering/expiration)

### Cache / rate limiting
- **Redis** (optional): caching manifests, auth sessions, burst control

### Observability
- OpenTelemetry SDK (Rust)
- Prometheus (metrics)
- Loki (logs) + Tempo (traces) or a managed stack

---

## 7) Multi-tenancy model
- Tenants: `org_id`
- Users belong to orgs; resources are scoped by `org_id`
- **RLS policies** enforce separation at the DB layer
- All object storage keys prefixed by `org_id/project_id/...`

### Security rules
- Signed URLs for upload/download (short TTL)
- Strict MIME + container checks on ingest
- Per-tenant quotas + rate limits

---

## 8) Video pipeline abstraction (internal IR)

We define a stable internal representation that compiles to different engines.

### Pipeline IR (conceptual)
- **Inputs**: one or more media objects
- **Stages**:
  1. Inspect / probe
  2. Decode (prefer GPU)
  3. Filter graph (GPU-first)
  4. Encode one or more outputs
  5. Package (HLS/DASH) + manifests
  6. Emit artifacts (thumbnails, storyboards, metadata)

### Example IR schema (simplified)
```json
{
  "pipeline_version": "1.0",
  "inputs": [{"asset_id": "src_123"}],
  "video": {
    "decode": {"hw": "nvidia"},
    "filters": [
      {"type": "scale", "w": 1280, "h": 720, "hw": "gpu"},
      {"type": "overlay", "asset_id": "wm_456", "x": 24, "y": 24, "hw": "gpu"}
    ],
    "outputs": [
      {"name": "proxy_720p", "codec": "h264", "bitrate_kbps": 2500, "hw": "nvenc"},
      {"name": "proxy_360p", "codec": "h264", "bitrate_kbps": 800, "hw": "nvenc"}
    ]
  },
  "audio": {
    "mode": "copy_or_transcode",
    "codec": "aac",
    "bitrate_kbps": 128
  },
  "packaging": {"type": "hls", "segment_seconds": 4}
}
```

### Compilation
- **FFmpeg compiler** maps IR → command + filtergraph
- **GStreamer compiler** maps IR → element graph

---

## 9) Execution engines

### Engine A: FFmpeg (default)
**Why**
- Best breadth of formats and mature CLI workflows
- Straightforward orchestration from Rust
- Easy debugging and reproducibility (store command line + logs)

**How**
- Spawn ffmpeg sidecar process
- Feed signed URLs / local file paths
- Parse progress via stderr/pipe
- Capture machine-readable artifacts:
  - full ffmpeg command line
  - stdout/stderr logs
  - ffprobe JSON before/after

### Engine B: GStreamer (optional)
**Why**
- Complex graphs (tee/multi-output)
- Streaming-ish pipelines and long-running tasks
- Better component-level instrumentation

**How**
- Construct pipeline string or programmatic graph
- Subscribe to bus events
- Emit progress + events per element

---

## 10) GPU scheduling and throughput strategy

### Goals
- Maximize GPU utilization without oversubscription
- Avoid stalls from I/O and CPU-bound work

### Key concepts
**Worker capabilities**
- Each worker reports:
  - GPU count + model
  - NVENC/NVDEC support and codec support
  - Current sessions in use
  - Current VRAM usage

**Resource tokens**
- Each GPU has a pool of “tokens” representing safe concurrency.
- Jobs request tokens (decode + encode + filter complexity).

**Scheduling policy (v1)**
- Score nodes by:
  - free tokens
  - local cache hits (optional)
  - estimated job duration
- Assign job → node

### Concurrency guidelines (practical)
- Start with a conservative max concurrency per GPU (e.g., 2–6 jobs) depending on:
  - resolution
  - codec complexity
  - filter graph
  - GPU generation
- Auto-tune using real telemetry.

### Avoiding GPU↔CPU copies
- Prefer GPU decode and GPU filters
- Only fall back to CPU filters if required
- If CPU filters are required, consider:
  - decode on CPU to avoid redundant transfers
  - or isolate such jobs to a CPU-focused worker pool

---

## 11) Durability: job state machine

### Job states
- `QUEUED`
- `DISPATCHED`
- `RUNNING`
- `UPLOADING`
- `FINALIZING`
- `SUCCEEDED`
- `FAILED_RETRYABLE`
- `FAILED_TERMINAL`
- `CANCELLED`

### Leasing + heartbeats
- Worker claims job with a lease (e.g., 60s)
- Worker renews heartbeat
- If lease expires, orchestrator re-queues

### Idempotency
- Each job has an idempotency key derived from:
  - input asset IDs + versions
  - pipeline spec ID + version
  - output profile set

Outputs are written to a temp prefix and atomically promoted.

---

## 12) Data model (Postgres)

### Core tables
- `org`
- `user`
- `project`
- `asset` (source objects)
- `asset_version` (immutable ingest versions)
- `pipeline_spec` (versioned)
- `job`
- `job_attempt`
- `job_event` (progress stream, partitioned)
- `output_asset` (produced objects)

### Storage keys
- `s3://bucket/org/{org_id}/project/{project_id}/asset/{asset_id}/v/{version_id}/...`

### Indexing strategy
- Composite indexes by `(org_id, created_at)` on large tables
- Partition `job_event` by time and/or org

---

## 13) API surface (Rust)

### Auth
- OIDC / JWT
- Service tokens for worker-plane access

### Key endpoints
- `POST /assets` → create asset record
- `POST /assets/{id}/upload-url` → signed multipart upload
- `POST /pipelines` → create spec
- `POST /jobs` → submit job with pipeline + inputs
- `GET /jobs/{id}` → state + progress
- `GET /jobs/{id}/events` → stream events
- `GET /outputs/{id}` → signed download URLs

### Streaming updates
- WebSocket/SSE channel: job progress, per-stage updates

---

## 14) Output types and common recipes

This section defines **Golden Path** presets: opinionated, high-signal defaults that cover most real workloads while keeping costs predictable and throughput high.

### Golden Path philosophy
- Prefer **hardware decode + hardware encode** when available.
- Prefer **GPU filters** (scale/convert/overlay) when possible.
- Prefer **copy** over transcode when no transformation is needed (especially audio).
- Emit **consistent artifacts** for every pipeline: probes, manifests, thumbnails, logs.
- Make presets stable and versioned (`preset_id + preset_version`).

### A) Source ingest + canonical metadata (required)
**Purpose**: normalize ingest, validate containers/codecs, generate a canonical probe.

**Outputs**
- `probe.json` (ffprobe-style)
- `keyframes.json` (optional)
- `audio_tracks.json`

**Notes**
- Reject obviously broken/truncated files early.
- Record colorimetry and bit-depth (8/10-bit), HDR flags.

---

### B) Proxy preset (fast editing/review)
**Use case**: fast scrubbing, quick previews, downstream transformations.

**Default output**
- MP4, H.264 (NVENC) + AAC
- 720p (or 1080p depending on UI needs)
- CFR, audio kept where possible

**Suggested profiles**
- `proxy_720p_h264`:
  - 1280x720
  - 2–4 Mbps (content-dependent)
  - GOP ~2s, keyframes aligned
- `proxy_1080p_h264` (optional):
  - 1920x1080
  - 4–8 Mbps

**Artifacts**
- 1 thumbnail at 10% duration
- 1 thumbnail at midpoint

---

### C) Web delivery ladder (HLS) — throughput-first
**Use case**: most user-facing web playback.

**Default output**
- HLS master + renditions
- H.264 or HEVC depending on device policy
- AAC audio

**Throughput-first ladder example (H.264)**
- 240p ~ 300–450 kbps
- 360p ~ 600–900 kbps
- 480p ~ 900–1400 kbps
- 720p ~ 2000–3500 kbps
- 1080p ~ 4000–6500 kbps

**Segments**
- 4s or 6s segments
- Keyframes aligned to segment boundaries

**Notes**
- Use GPU decode once, then multi-output where feasible.
- Consider a “safe baseline” ladder that works for most content.

---

### D) Mezzanine preset (archival / source-of-truth intermediate)
**Use case**: robust intermediate for future re-encodes and finishing.

**Options**
- `mezzanine_hq_h264` (broad compatibility):
  - H.264 high profile, higher bitrate
- `mezzanine_hq_hevc` (smaller storage):
  - HEVC (NVENC) at higher quality

**Notes**
- If storage is cheap, prioritize mezzanine quality.
- If storage is expensive, choose HEVC mezzanine.

---

### E) Thumbnail + storyboard preset
**Use case**: preview UIs, search surfaces, scrub thumbnails.

**Outputs**
- `thumb_small` (e.g., 320px wide)
- `thumb_large` (e.g., 1280px wide)
- `storyboard` grid (optional)

**Sampling strategy**
- 1 frame at: 0%, 10%, 25%, 50%, 75%, 90%
- Or N frames evenly spaced

**Notes**
- Prefer GPU decode, CPU encode for JPEG/WebP if simpler.
- Store timecodes with every thumbnail.

---

### F) Audio operations preset
**Use case**: keep audio untouched unless required.

**Modes**
- `audio_copy` — container remux only
- `audio_transcode_aac_128` — default fallback
- `audio_strip` — remove all audio
- `audio_replace` — replace with provided track

**Notes**
- Always preserve track metadata if possible.

---

### G) Frame extraction / analysis preset
**Use case**: ML analysis, OCR, motion detection, content signals.

**Outputs**
- Frame sequence or sparse frames by timecode
- JSON manifest of extracted frames

**Notes**
- Prefer GPU decode, but extraction can be I/O heavy.
- Consider chunking extraction jobs for parallelism.

---

### H) “Quality tier” presets (GPU vs CPU)
Some customers want a quality-per-bitrate tier for premium delivery.

- `tier_fast_gpu` — NVENC, throughput-first
- `tier_premium_cpu` — CPU encode (slower), better compression efficiency

The system should allow selecting tiers per job.

---


## 15) Worker implementation details (Rust)

### Components
- `worker::runner` — state machine executor
- `worker::engine` — trait + adapters
- `worker::resources` — GPU token manager
- `worker::io` — download/upload, signed URL handling
- `worker::events` — event emitter (NATS)
- `worker::artifacts` — logs/probes, upload to object storage

### Engine trait
```rust
trait MediaEngine {
  fn probe(&self, input: &Input) -> Result<ProbeJson>;
  fn run(&self, plan: &ExecutionPlan, ctx: &JobContext) -> Result<EngineResult>;
}
```

### Execution plan
A compiled plan contains:
- resolved URLs/paths
- engine graph/command
- estimated token costs
- output target keys

---

## 16) Observability + auditing

### Per job, capture
- input probe JSON
- compiled plan
- engine version + build info
- logs (chunked)
- progress events
- output probe JSON

### Metrics
- jobs/sec per GPU
- avg encode time per profile
- GPU utilization (NVML)
- failure rates by stage
- queue latency

---

## 17) Desktop client integration (Svelte 5 + Tauri)

### Upload flow
1. Client requests signed upload URL(s)
2. Resumable multipart upload
3. Finalize asset version
4. Submit job referencing asset version
5. Subscribe to job progress
6. Download outputs via signed URLs

### Local-first option
- Client can run local transforms (optional) and then upload results
- Or client can stage source on local disk while remote processing runs (hybrid)

---

## 18) Local + cloud unified model (recommended)

We will build a single **enterprise-grade media core** that can execute pipelines either:
- **Locally** (macOS/Windows desktop via Tauri)
- **In the cloud** (GPU worker fleet)

The objective is **maximum DRY**, shared architecture, and consistent behavior across environments.

### 18.1 Design goals
- One pipeline definition language (IR) for all environments
- One preset library (“Golden Path”) shared everywhere
- One execution model: job state machine + progress events + artifacts
- Best-available hardware acceleration per machine (cloud GPU or local device)
- Seamless “run here or offload” routing

### 18.2 Layered architecture

#### A) Shared core crate (Rust)
**`media_core`** — the single source of truth for pipeline behavior.

Responsibilities:
- Pipeline IR types and validation
- Preset registry + versioning
- Capability matching (what this machine can do)
- Compilation: IR → ExecutionPlan(s)
- Artifact schemas (probe.json, manifests, event types)
- Deterministic hashing/idempotency key derivation

#### B) Executor implementations
Executors implement a single trait and differ only in I/O + environment details.

**`executor_local`**
- Filesystem paths for inputs/outputs
- Local caches
- Local resource management (CPU/GPU)
- Runs inside Tauri (Rust side) or as a local daemon

**`executor_cloud_worker`**
- Signed URLs + object storage I/O
- GPU token scheduling and node telemetry
- Leases/heartbeats from the orchestrator

#### C) Control planes
**Local mode control plane**
- Lightweight local queue + local DB (SQLite)
- No multi-tenant requirements
- Offline-first supported

**Cloud control plane (enterprise)**
- Orchestrator API + queue + worker pool
- Multi-tenant auth, quotas, billing
- Global observability and SLAs

### 18.3 Unified execution contract
Every job produces the same shape:
- `JobResult` (success/failure + outputs)
- `Artifacts` (logs, probes, manifests)
- `Events` (progress timeline)

This consistency enables:
- identical UI flows (local vs cloud)
- deterministic debugging
- portable “job replay” between environments

---

## 19) Hardware acceleration strategy (portable)

We treat hardware acceleration as a **capability graph** rather than a fixed assumption.

### 19.1 Accelerator families
- **macOS**: VideoToolbox (hardware decode/encode)
- **Windows/Linux**: NVENC/NVDEC (NVIDIA), QSV (Intel), AMF (AMD)

### 19.2 Capability resolver
Each executor queries machine capabilities at runtime:
- supported codecs (H.264/HEVC/AV1)
- supported pixel formats (8/10-bit)
- max supported resolution and level
- hardware decode availability
- hardware encode availability

The resolver returns a `Capabilities` object used by compilation.

### 19.3 Compilation policy (GPU-first)
Compilation chooses the **fastest correct path**:
1. Hardware decode + hardware encode + GPU filters
2. Hardware decode + CPU filters + hardware encode
3. CPU decode + CPU filters + hardware encode
4. CPU fallback end-to-end (rare, but required for edge cases)

This makes pipelines portable while preserving peak performance.

---

## 20) Hybrid routing: local vs cloud execution

Hybrid routing allows a single app to:
- run pipelines locally when feasible
- offload to cloud GPUs for speed, scale, or premium features

### 20.1 Routing objectives
- minimize time-to-result
- minimize cost when acceptable
- preserve user privacy rules
- support offline workflows

### 20.2 Routing policy (enterprise default)
The routing decision is made from:
- job requirements (codec/HDR/AV1/filters)
- local machine capabilities + current load
- user/org policy (privacy, cost, tier)
- expected duration and queue latency

**Policy examples**
- Always run locally if:
  - job is lightweight (thumbnails/proxy) and machine supports acceleration
  - user selected “local-only” mode
- Prefer cloud if:
  - job requires multi-rendition ladder
  - job requires sustained throughput / batch processing
  - machine lacks required accelerator
- Force cloud if:
  - enterprise policy requires centralized processing
  - auditing/compliance requires server-side provenance

### 20.3 Execution portability
Any job can be exported as a **replay bundle**:
- pipeline spec version
- preset version
- engine selection
- input asset references

This enables:
- run locally for iteration
- replay in cloud for production

---

## 21) Local architecture (Svelte 5 + Tauri)

### 21.1 Recommended local topology
- Tauri UI (Svelte 5)
- Rust backend embedded in the app
- Optional local background daemon for long-running jobs

### 21.2 Local storage
- SQLite DB for job history + manifests
- Local cache directory for intermediates
- Export/share outputs to user-selected locations

### 21.3 Local executor behavior
- Uses filesystem paths for input/output
- Streams events to the UI
- Captures the same artifacts as cloud:
  - input probe
  - compiled plan
  - logs
  - output probe

### 21.4 Local reliability
- Durable local queue persisted to SQLite
- Recover jobs after app restart
- Resume partially completed outputs when possible

---

## 22) Cloud architecture (enterprise)

### 22.1 Orchestrator API
- Multi-tenant auth (OIDC/JWT)
- Pipeline + preset registries (versioned)
- Job submission + state machine
- Worker scheduling

### 22.2 Worker fleet
- GPU nodes with a worker agent
- Capability reporting + token pools
- Streaming job events

### 22.3 Storage
- Object storage is authoritative for media objects
- Database stores metadata and state transitions

### 22.4 Observability
- OpenTelemetry
- GPU telemetry integration (NVML where available)
- Per-job audit trail

---

## 23) Codebase structure (Rust, DRY-first)

### 23.1 Crate layout
**`media_core/`**
- `ir/` pipeline types
- `presets/` golden path registry
- `capabilities/` detection + matching
- `compiler/` IR → ExecutionPlan
- `artifacts/` schemas
- `events/` common event types

**`media_engines/`**
- `ffmpeg/` compiler + runner
- `gstreamer/` compiler + runner (optional)

**`executor/`**
- `traits/` executor interface
- `local/` local executor
- `cloud/` worker executor

**`orchestrator_api/`**
- auth
- job state machine
- queue integration
- scheduling policies

**`desktop_app/`**
- Tauri wrapper
- IPC bindings to local executor

### 23.2 Trait-driven boundaries
Key interfaces are stable and tested:
- `MediaEngine`
- `Executor`
- `CapabilityResolver`
- `StorageProvider`
- `EventSink`

This allows swapping implementations without touching core logic.

---

## 24) Enterprise-grade durability and correctness

### 24.1 Exactly-once output semantics (practical)
We implement exactly-once *effects* via:
- idempotency keys
- temp output prefixes
- atomic promote/finalize
- job attempt tracking

### 24.2 Crash recovery
- Worker leases + heartbeats
- Requeue on lease expiry
- Attempt limits + exponential backoff

### 24.3 Determinism
- Versioned presets and pipeline specs
- Engine version captured per job
- All compilation inputs stored as artifacts

---

## 25) Production hardening checklist

### Performance
- GPU-only paths prioritized
- Concurrency tuned by telemetry
- Object storage multipart + parallel uploads

### Security
- Signed URLs
- Strict ingest validation
- Tenant isolation (RLS)

### Operations
- Structured logs + trace IDs
- Dashboards per org and per GPU pool
- Alerting on failure rate and queue depth

---

## 26) Roadmap

### V1
- FFmpeg engine
- Unified core crate + presets
- Local executor via Tauri
- Cloud orchestrator + GPU workers
- Hybrid routing (basic)

### V2
- GStreamer engine adapter
- Advanced multi-output graphs
- Smart intermediate caching
- Expanded platform acceleration paths

### V3
- Advanced QC / perceptual metrics
- Content-aware encoding policies
- Multi-region execution + edge distribution

---

## 27) Key open questions
- Required codec matrix (H.264/HEVC/AV1) per tier
- HDR workflow requirements (10-bit, tone mapping)
- Compliance needs (audit retention duration)
- Default cloud GPU target (NVIDIA generation)
- Packaging targets (HLS only vs DASH too)

