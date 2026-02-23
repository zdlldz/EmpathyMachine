---
title: "Discovery: EmpathyMachine Bluesky Bot + Letta Memory Platform"
id: 20260223
category: add
slug: 20260223-add-empathy-machine-bluesky-letta-bot-discovery
status: in-progress
icon: lucide:search
tags: discovery, research, bluesky, letta, empathy-machine
author: codex
version: v0.1.0
date: 2026-02-23
description: Initial research and architecture fingerprint for building the EmpathyMachine Bluesky bot with a memory-backed Letta architecture and a web control plane.
---

# Phase 0: Discovery

## 1. Context Gathering
- **Release History:** No prior release task artifacts found in `docs/release/` at kickoff.
- **Project Intent Context:** `AGENTS.md` and `EmpathyMachine/AGENTS.md` define the primary mission as agentic kindness, de-escalation, and macro/micro sentiment improvement through sustained empathetic interaction.
- **Fingerprint (Candidate Stack):**
  - Runtime: Node.js + TypeScript
  - Social API: Bluesky AT Protocol via `@atproto/api`
  - Agent Memory Runtime: Letta Code SDK (`@letta-ai/letta-code-sdk`)
  - Agent Portability/State Standard: Agent File (`.af`) for checkpointing/versioning
  - Web Frontend: TypeScript web app (likely Next.js or SvelteKit) for operations and oversight
  - Storage (initial): Letta-managed memory + lightweight app database for bot runs, moderation queue, and audit events
- **Archived/Internal Docs Reviewed:**
  - `AGENTS.md`
  - `EmpathyMachine/AGENTS.md`
  - `SentimentMachine/AGENTS.md`
  - `docs/README.md`
  - `docs/agents.md`
  - `docs/agents/agent-docs.md`

## 2. Intent vs. Reality
- **Claimed Intent:**
  - Build an empathy-focused bot system for Bluesky.
  - Use memory-backed agent behavior that learns over time.
  - Stay clean, DRY, and componentized; use standards and existing SDKs.
  - Include a web frontend for bot management.
- **Current State:**
  - No implementation code yet for bot runtime, orchestration, or frontend.
  - Documentation framework exists and is suitable for structured discovery/planning/process.
  - Empathy/mission prompts are articulated, but operating policies and technical constraints are not yet formalized into a runnable architecture spec.

## 3. External Research Snapshot
- **Bluesky Bot Baseline:** Official starter material supports TypeScript bot construction using `@atproto/api`, login credentials, and cron-like scheduling.
- **Bluesky Client Pattern:** Official examples separate API client setup from feature logic, which aligns with modular and DRY architecture goals.
- **Letta Code SDK Fit:** SDK supports persistent agents, multi-turn sessions, memory file system options, and runtime controls that match the memory-backed automation objective.
- **Agent File Fit:** `.af` provides a standard serialization format for stateful agents, including system prompts, memory blocks, and tools, which is useful for reproducibility, checkpointing, and versioning.

## 4. Preliminary Architecture Direction (Recommended)
- **A. Bot Brain Layer (Letta):**
  - One primary EmpathyMachine persona agent (prompted by `AGENTS.md` principles).
  - Session manager for ongoing conversations and memory continuity.
  - Guardrail middleware to block unsafe outputs and enforce empathy posture.
- **B. Network Adapter Layer (Bluesky):**
  - `@atproto/api` client wrapper for auth, post/reply read-write, mention stream polling, and rate-limit handling.
  - Message normalizer to convert Bluesky records into canonical internal message objects.
- **C. Decision/Policy Layer:**
  - Trigger rules (mentions, keyword windows, reply-depth limits, cooldowns).
  - Response policy (de-escalation first, avoid moralizing, avoid religious claims per project persona rules).
  - Safety policy (abuse handling, opt-out list, do-not-engage topics, max retries).
- **D. Orchestration Layer:**
  - Worker process for scheduled polling + event queue processing.
  - Idempotency keys for post/reply actions.
  - Observability events (what was seen, why response was/was not sent, latency, token usage).
- **E. Web Control Plane:**
  - Persona/profile editor (versioned prompt and policy variants).
  - Moderation and override queue (approve/suppress proposed replies if human-in-the-loop mode is enabled).
  - Conversation timeline viewer with memory snapshots and event logs.
  - Operational dashboards (volume, reply rate, suppression rate, failure rate).

## 5. Componentization Strategy (DRY-First)
- Create isolated packages/modules from day one:
  - `packages/core-agent` (Letta session orchestration + policies)
  - `packages/network-bluesky` (ATProto adapter)
  - `packages/policy-engine` (engagement and safety rules)
  - `apps/worker` (job runner)
  - `apps/web` (management frontend)
  - `packages/shared-types` (all domain contracts)
- Treat every inbound event as a shared canonical type before business logic executes.
- Keep prompt templates, policy config, and trigger config externalized to versioned files.

## 6. Findings & Risks
- **Risk: Platform Policy/Abuse Missteps**
  - Bot behavior on volatile threads can create moderation risk without strict guardrails.
- **Risk: Memory Drift**
  - Long-lived memory can accumulate low-quality or adversarial context unless pruning/summarization strategy is defined.
- **Risk: Rate Limiting + Reliability**
  - Need robust backoff/retry and dead-letter handling for network and API instability.
- **Risk: Persona Consistency**
  - Without explicit response contracts, tone may drift from intended "arbiter of peace" posture.
- **Risk: Privacy + Data Handling**
  - Storing raw thread content and memory state requires clear retention and redaction policy.

## 7. Open Questions (Blocking for Planning Phase)
- **Engagement Scope:** Should V1 reply only to direct mentions, or also proactively engage in selected public threads?
- **Human Oversight Mode:** Should V1 run fully autonomous or require review for first N days/weeks?
- **Memory Scope:** Single global memory, per-user memory, or hybrid memory with strict boundaries?
- **Safety Depth:** Which categories should always suppress responses (harassment, self-harm, politics, etc.) in V1?
- **Frontend Scope for V1:** Minimal ops dashboard only, or full prompt/policy editing UI from the start?
- **Deployment Target:** Local-first, containerized VPS, or managed platform from day one?

## 8. Recommended Next Outputs
- Produce `planning.md` with 2-3 concrete architecture options and tradeoff matrix.
- Define a strict "response contract" and policy table before coding.
- Draft a minimal V1 boundary:
  - Mention-only ingestion
  - Human-in-the-loop approvals
  - Daily memory compaction
  - Audit-first logging

## 9. Source References
- Bluesky Get Started: https://docs.bsky.app/docs/get-started
- Bluesky Starter Templates (Bots/Clients): https://docs.bsky.app/docs/starter-templates/bots
- Agent File Standard: https://github.com/letta-ai/agent-file
- Letta Code SDK: https://github.com/letta-ai/letta-code-sdk
