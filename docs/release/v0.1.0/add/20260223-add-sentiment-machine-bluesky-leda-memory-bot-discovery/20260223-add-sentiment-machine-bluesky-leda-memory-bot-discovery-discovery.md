---
title: "Discovery: SentimentMachine Bluesky Bot + Letta/Letta Memory Architecture"
id: 20260223
category: add
slug: 20260223-add-sentiment-machine-bluesky-Letta-memory-bot-discovery
status: in-progress
icon: lucide:search
tags: discovery, research, sentiment-machine, bluesky, letta, Letta
author: codex
version: v0.1.0
date: 2026-02-23
description: Initial research and architecture fingerprint for building SentimentMachine on Bluesky using SDK-first design, memory-backed agent runtime, and a web management frontend.
---

# Phase 0: Discovery

## 1. Context Gathering
- **Release History:** One same-day discovery artifact exists for EmpathyMachine in this release stream: `docs/release/v0.1.0/add/20260223-add-empathy-machine-bluesky-letta-bot-discovery/`.
- **Project Intent Context:** `AGENTS.md` and `SentimentMachine/AGENTS.md` define the objective as broad network mood observation with memory-backed adaptation and iterative learning.
- **Fingerprint (Candidate Stack):**
  - Runtime and language: Node.js + TypeScript
  - Network SDK: Bluesky AT Protocol via `@atproto/api`
  - Agent memory runtime: Letta Code SDK (assumed mapping for "Letta" pending confirmation)
  - Scheduling and orchestration: worker process + queue + cron-style intervals
  - Web frontend: lightweight operations UI for policies, moderation, and telemetry
  - Shared contracts: central typed event/message schemas for DRY modules
- **Internal Docs Reviewed:**
  - `AGENTS.md`
  - `SentimentMachine/AGENTS.md`
  - `docs/README.md`
  - `docs/templates/README.md`
  - `docs/templates/task-bundle/discovery.md`

## 2. Intent vs. Reality
- **Claimed Intent:**
  - Build a Bluesky bot from scratch using official/standard SDKs.
  - Back the bot with a memory-capable LLM framework.
  - Keep implementation clean, DRY, and componentized.
  - Provide a web frontend to manage bot behavior and operations.
- **Current State:**
  - No SentimentMachine runtime code or frontend implementation exists yet.
  - Documentation framework is present and supports structured rollout (Discovery -> Planning -> Process -> QA).
  - Sentiment objectives are declared, but measurement definitions and policy boundaries are not yet formalized.

## 3. External Research Snapshot
- **Bluesky Baseline:** Official docs provide TypeScript-first SDK usage with `@atproto/api`, auth, and posting workflow (`docs.bsky.app`).
- **Bluesky Bot Pattern:** Official starter templates demonstrate minimal bot loops and schedule-based posting, useful as a thin integration baseline before policy/memory layering.
- **Memory-Backed Runtime Fit:** Letta public docs describe persistent agents, sessions, and memory blocks that align with the desired architecture.
- **Naming Ambiguity:** Public research did not return a clear "Letta LLM framework" canonical project; likely intent is Letta, but this must be confirmed before planning.

## 4. Preliminary Architecture Direction (Recommended)
- **A. Network Ingestion Layer (Bluesky Adapter):**
  - Poll mentions/replies/targets using `@atproto/api`.
  - Normalize posts and thread context into canonical internal event objects.
  - Add idempotency and retry policy around outbound actions.
- **B. Sentiment and Policy Layer:**
  - Compute per-event and rolling-window sentiment with pluggable analyzers.
  - Apply engagement policy (reply thresholds, cooldowns, non-engagement rules).
  - Keep classifier choice swappable to avoid lock-in.
- **C. Agent Memory Layer (Letta/Letta):**
  - Maintain persistent memory blocks for context continuity.
  - Use session boundaries to separate per-thread, per-user, and global memory scopes.
  - Run periodic compaction/summarization to reduce drift.
- **D. Orchestration Layer:**
  - Worker executes schedule intervals, queue consumption, and decision pipelines.
  - Emit canonical observability events for every gate: seen, analyzed, responded, suppressed, failed.
- **E. Web Control Plane:**
  - Dashboard for bot health, sentiment trends, and response rates.
  - Policy editor for engagement thresholds and guardrail toggles.
  - Review queue for optional human-in-the-loop approval mode.

## 5. Componentization Strategy (DRY-First)
- Prefer a monorepo split from day one:
  - `packages/network-bluesky` (ATProto integration)
  - `packages/core-memory-agent` (Letta/Letta orchestration)
  - `packages/sentiment-engine` (classification + aggregation)
  - `packages/policy-engine` (engagement and safety decisions)
  - `packages/shared-types` (canonical DTOs/events)
  - `apps/worker` (scheduled runtime)
  - `apps/web` (operator UI)
- Enforce schema-first contracts for all module boundaries.
- Keep prompts, thresholds, and policy tables in versioned config files.

## 6. Findings & Risks
- **Risk: Framework Identity Drift**
  - "Letta" is not currently unambiguous in public references; incorrect framework selection can derail implementation.
- **Risk: Sentiment Overreach**
  - Mood analysis can produce false confidence without strict confidence scores and abstain behavior.
- **Risk: Safety + Moderation**
  - Public reply behavior requires hardened suppression policies and auditability.
- **Risk: Memory Contamination**
  - Long-lived memory can retain adversarial or noisy context without pruning and trust boundaries.
- **Risk: Operational Fragility**
  - Rate limits, API variability, and worker failures require robust retry/backoff and dead-letter handling.

## 7. Open Questions (Blocking for Planning Phase)
- Does "Letta" explicitly mean Letta, or a different memory framework?
- Should V1 only observe and score sentiment, or also post/reply autonomously?
- What is the minimum V1 web scope: telemetry-only, or telemetry + policy editing + approval queue?
- Which sentiment granularity is required first: post-level, thread-level, account-level, or global rolling network mood?
- What are hard no-engage domains for V1 (topics, users, or contexts)?
- What target cadence should V1 use (for example, every 1 minute, 5 minutes, or event-driven)?

## 8. Recommended Next Outputs
- Produce `planning.md` with two architecture options:
  - **Option A:** Letta-backed memory agent with modular sentiment engine.
  - **Option B:** Minimal deterministic sentiment pipeline first, then memory-agent upgrade.
- Define a V1 contract document:
  - Ingestion scope
  - Sentiment scoring contract
  - Engagement policy table
  - Logging and retention policy
- Draft a rollout ladder:
  - Stage 1: Observe-only
  - Stage 2: Human-approved responses
  - Stage 3: Autonomous responses with strict caps

## 9. Source References
- Bluesky Get Started: https://docs.bsky.app/docs/get-started
- Bluesky Bots Starter Template: https://docs.bsky.app/docs/starter-templates/bots
- Bluesky Starter Templates Index: https://docs.bsky.app/docs/category/starter-templates
- Letta Code SDK Overview: https://docs.letta.com/letta-code-sdk/overview/
- Letta Code SDK Quickstart: https://docs.letta.com/letta-code-sdk/quickstart
