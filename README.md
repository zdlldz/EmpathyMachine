# EmpathyMachine (TASK1)

EmpathyMachine is a local-first, memory-backed Bluesky bot system designed to inject calm, kindness, and de-escalation into volatile network conversations.

This repository is the core human-in-the-loop operator framework for:

- EmpathyMachine (engagement and response agent)
- SentimentMachine (sentiment analysis companion engine)
- Shared policy, event contracts, and observability

## Core Principles

- **Empathy first:** de-escalate, reduce heat, increase understanding.
- **Safety by design:** suppress or review high-risk interactions.
- **DRY and componentized:** isolate network, policy, sentiment, and memory concerns.
- **Local-first operations:** reliable local control now, cloud-ready migration later.
- **Traceability:** every decision path is auditable.
- **Operational clarity:** one command path for worker, CLI, and web dashboard.

## Project Framework

EmpathyMachine uses a layered architecture:

1. **Network layer** (`packages/network-bluesky`)
   - Ingests mentions and proactive candidates from Bluesky.
   - Publishes replies with thread-safe root/parent references.
2. **Sentiment layer** (`packages/sentiment-engine`)
   - Scores conversation tone with confidence and rationale.
3. **Policy layer** (`packages/policy-engine`)
   - Decides `engage`, `suppress`, or `review` (HITL mode).
4. **Memory-agent layer** (`packages/core-agent`)
   - Drafts responses using either local fallback or Letta-backed runtime.
5. **Orchestration layer** (`apps/worker`)
   - Runs end-to-end processing ticks and enforces runtime flags.
6. **Observability layer**
   - CLI (`apps/cli`)
   - Web dashboard (`apps/web`)
   - Event journal (`packages/event-log`)

## Human-In-The-Loop Model

V1 is autonomous by default and supports HITL as a runtime toggle.

- `HITL_MODE=false`:
  - Policy-approved responses can publish automatically.
- `HITL_MODE=true`:
  - Policy can route sensitive interactions to `review` behavior.
  - Publishing behavior remains controlled by policy decisions and runtime mode.

## Repository Layout

- `apps/worker`: runtime orchestration
- `apps/cli`: operator command interface
- `apps/web`: lightweight local dashboard
- `packages/shared-types`: canonical contracts and config types
- `packages/event-log`: append-only JSONL event journal
- `packages/network-bluesky`: Bluesky adapter
- `packages/core-agent`: memory provider adapter
- `packages/sentiment-engine`: sentiment analysis
- `packages/policy-engine`: safety and engagement policy logic
- `docs/`: discovery, planning, process, and release artifacts

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env
```

3. Run one processing tick:

```bash
npm run dev:worker
```

4. Validate runtime status:

```bash
npm run dev:cli -- status
```

5. Start dashboard:

```bash
npm run dev:web
```

Then open `http://localhost:4173`.

## Commands

- `npm run dev:worker`
  - Run one worker tick (ingest -> sentiment -> policy -> draft -> publish/log).
- `npm run dev:cli -- status`
  - Show journal summary.
- `npm run dev:cli -- run-once`
  - Execute one worker tick from CLI.
- `npm run dev:cli -- tail-events 50`
  - Print recent audit events.
- `npm run dev:web`
  - Start local observability dashboard.
- `npm run typecheck`
  - Run TypeScript checks across apps/packages.
- `npm test`
  - Run baseline smoke tests.

## Environment Configuration

Configure in `.env` (see `.env.example`):

| Variable | Purpose | Default |
| --- | --- | --- |
| `BLUESKY_IDENTIFIER` | Bluesky account handle/email | empty |
| `BLUESKY_PASSWORD` | Bluesky app password | empty |
| `BLUESKY_SERVICE_URL` | Bluesky service endpoint | `https://bsky.social` |
| `PROACTIVE_QUERY` | Search query for proactive candidates | `(angry OR upset OR stressed OR conflict)` |
| `PROACTIVE_LIMIT` | Max proactive candidates fetched per tick | `10` |
| `EVENT_LOG_PATH` | JSONL event journal path | `.runtime/events.jsonl` |
| `WEB_PORT` | Dashboard port | `4173` |
| `AUTONOMOUS_MODE` | Enable automatic publish path | `true` |
| `HITL_MODE` | Enable review-oriented policy behavior | `false` |
| `PROACTIVE_MODE` | Enable proactive ingestion | `true` |
| `WEB_UI_ENABLED` | Enable web UI mode flag | `true` |
| `SENTIMENT_ENABLED` | Enable sentiment gating | `true` |
| `SENTIMENT_MIN_CONFIDENCE` | Minimum confidence to allow engagement | `0.5` |
| `MAX_REPLIES_PER_TICK` | Hard cap on processed events per tick | `5` |
| `LETTA_ENABLED` | Use Letta memory provider | `false` |
| `LETTA_AGENT_ID` | Reuse existing Letta agent | empty |
| `LETTA_MODEL` | Optional Letta model override | empty |

## Runtime Modes

- **Safe local dry mode**
  - Leave Bluesky credentials empty.
  - Worker runs no-op network behavior and still logs flow events.
- **Autonomous mode**
  - Set valid Bluesky credentials.
  - Keep `AUTONOMOUS_MODE=true`.
- **HITL leaning mode**
  - Set `HITL_MODE=true`.
  - Keep audit review active through CLI/web before expanding scope.
- **Memory provider mode**
  - `LETTA_ENABLED=false` uses local fallback provider.
  - `LETTA_ENABLED=true` uses Letta provider with local fallback on errors.

## Communication Record and Observability

EmpathyMachine writes an append-only event stream (`JSONL`) and treats it as the operational truth source.

Core event kinds:

- `inbound_seen`
- `sentiment_scored`
- `policy_decision`
- `draft_created`
- `publish_result`
- `error`

This enables:

- full replay of execution paths,
- policy and sentiment auditability,
- lightweight local metrics and timeline views.

## Safety and Policy Baseline

Current baseline includes:

- suppression/review categories for protected terms,
- confidence-gated sentiment behavior,
- explicit engage/suppress/review decisions,
- configurable autonomous and HITL toggles.

Recommended operational policy:

- start with low `MAX_REPLIES_PER_TICK`,
- review `publish_result` and `error` events daily,
- tighten thresholds before increasing proactive scope.

## Development Workflow

1. Discovery and planning artifacts are created in `docs/release/...`.
2. Implement small, testable slices.
3. Validate with `typecheck` and CLI/web runtime checks.
4. Keep changes modular and contract-first.
5. Update process documentation as implementation evolves.

## Current Status

Implemented:

- local-first monorepo and runtime scaffolding,
- Bluesky adapter with login, mentions, proactive search, and reply publishing,
- sentiment and policy engines with deterministic baseline behavior,
- memory-provider adapter with local + Letta integration path,
- CLI and web observability surfaces,
- append-only communication record journal,
- retry with bounded backoff for network operations,
- idempotent inbound processing and dead-letter audit behavior,
- baseline smoke tests for sentiment/policy and event-log behavior.

In progress:

- expanded test coverage (worker integration and end-to-end harness),
- cloud deployment profile and migration runbook.

## Troubleshooting

- **No events appear**
  - Run `npm run dev:cli -- run-once`, then `tail-events`.
  - Confirm `EVENT_LOG_PATH`.
- **No Bluesky activity**
  - Verify `BLUESKY_IDENTIFIER` and `BLUESKY_PASSWORD`.
  - Check proactive query and mode flags.
- **Unexpected suppress behavior**
  - Inspect `policy_decision` events and confidence values.
- **Memory provider not responding**
  - If `LETTA_ENABLED=true`, verify local Letta setup or set it to `false` to use fallback provider.

## Notes

- This repository is intentionally local-first.
- No destructive git operations should be used on concurrent work.
- Keep safety, empathy, and auditability as non-negotiable constraints.
