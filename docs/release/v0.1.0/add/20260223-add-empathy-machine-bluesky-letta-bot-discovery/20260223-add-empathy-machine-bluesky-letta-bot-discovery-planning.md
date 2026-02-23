---
title: "Planning: EmpathyMachine Bluesky Bot + Letta Memory Platform"
id: 20260223
category: add
slug: 20260223-add-empathy-machine-bluesky-letta-bot-discovery
status: planning
icon: lucide:layout-template
tags: planning, architecture, empathy-machine, bluesky, letta
author: codex
version: v0.1.0
date: 2026-02-23
description: Architecture comparison and selected implementation strategy for a local-first, autonomous EmpathyMachine bot with proactive engagement and observable operations.
---

# Phase 1: Planning

## 1. Solution Comparison

### Solution A: Unified Worker + Embedded Policy Engine + Optional Web
- **Pros:**
  - Fastest path to first runnable version.
  - Fewer moving parts initially.
  - Lower setup burden for local-first development.
- **Cons:**
  - Tighter coupling between ingestion, policy, and agent logic.
  - Harder to reuse for SentimentMachine without refactor.
  - CLI and web features may duplicate logic later.

### Solution B: Modular Monorepo with Shared Engines (Recommended)
- **Pros:**
  - Strong DRY boundary from day one.
  - Enables SentimentMachine as first-class sibling without duplication.
  - Cleanly supports both CLI and web control paths over the same services/contracts.
  - Better migration path from local-first to cloud-hosted workers.
- **Cons:**
  - Slightly more initial scaffolding effort.
  - Requires discipline in package contracts and interfaces.

### Solution C: Web-First Orchestrator with Worker as Subsystem
- **Pros:**
  - Strong operator UX early.
  - Easier to grow into multi-bot controls in one place.
- **Cons:**
  - Overbuild risk for V1.
  - Slower time-to-first-autonomous behavior.
  - More complex local dev loop early.

## 2. Selected Strategy
Choose **Solution B (Modular Monorepo)**.

This strategy best matches project constraints: local-first now, clean/cloud-ready later, and strict DRY/componentization with SentimentMachine as an integral companion capability. V1 remains intentionally small in behavior while being strong in architecture and observability.

## 3. High-Level Architecture
- **Data Flow:**
  1. `network-bluesky` ingests mentions + proactive target candidates.
  2. `sentiment-engine` computes scores and confidence on candidate conversations.
  3. `policy-engine` decides engage/suppress/escalate using config + safety gates.
  4. `core-agent` (Letta session runtime) drafts response with memory context.
  5. `policy-engine` runs post-generation checks before publish.
  6. `network-bluesky` publishes reply/post and records result.
  7. `event-log` writes canonical audit events for every stage.
- **Key Symbols (planned):**
  - `packages/shared-types/src/types.ts`
    - `InboundEvent`, `SentimentResult`, `PolicyDecision`, `AgentDraft`, `PublishResult`, `AuditEvent`
  - `packages/network-bluesky/src/index.ts`
    - `fetchMentions()`, `fetchProactiveCandidates()`, `publishReply()`
  - `packages/sentiment-engine/src/index.ts`
    - `analyzeConversationSentiment()`
  - `packages/policy-engine/src/index.ts`
    - `decideEngagement()`, `applySafetyRules()`
  - `packages/core-agent/src/index.ts`
    - `createMemoryAgentProvider()`, `draftResponse()`
  - `apps/worker/src/main.ts`
    - `runTick()`, `processInboundEvent()`
  - `apps/cli/src/main.ts`
    - `status`, `run-once`, `tail-events`
  - `apps/web/src/*`
    - read-only timeline, metrics cards, mode toggles
- **Standards:**
  - SDK-first integrations (`@atproto/api`, `@letta-ai/letta-code-sdk`)
  - Schema-first interfaces in shared types
  - Config-driven behavior with environment overlays (`local`, later `cloud`)

## 4. V1 Functional Contract
- **Autonomy Mode:**
  - Default: autonomous publish enabled.
  - Toggle: human-in-the-loop gate available but off by default.
- **Engagement Scope:**
  - Mentions: always in scope.
  - Proactive: enabled for selected query/feed/account targets with cooldown + thread-depth limits.
- **Observability Scope:**
  - Every stage emits an `AuditEvent`.
  - Logs queryable by CLI and web dashboard from the same storage.
- **Communication Record Scope:**
  - Persist normalized inbound context, policy decision, model draft, final publish result, and any suppression reason.
- **Local-First Runtime Scope:**
  - Single command start/stop control.
  - Feature flags for `AUTONOMOUS_MODE`, `HITL_MODE`, `PROACTIVE_MODE`, `WEB_UI_ENABLED`.

## 5. Implementation Slices (Recommended Order)
1. **Foundation + Contracts**
   - Initialize monorepo packages and shared event contracts.
   - Add config loader and feature flag schema.
2. **Bluesky Adapter + Record Layer**
   - Build mention/proactive fetch + publish wrappers.
   - Add canonical event journal (JSONL or SQLite-backed) for local-first reliability.
3. **Policy + Sentiment Pass**
   - Implement deterministic policy gate.
   - Add initial sentiment analyzer interface and baseline implementation.
4. **Letta Runtime Integration**
   - Session management and response drafting.
   - Memory compaction job and error-safe retries.
5. **Control Surfaces**
   - CLI commands for operations + diagnostics.
   - Lightweight web dashboard for timeline and toggles.
6. **Hardening**
   - Backoff, idempotency keys, dead-letter records, smoke tests.

## 6. Risk Controls for V1
- **Safety:** hard suppression categories, opt-out list, max replies per thread/day.
- **Reliability:** idempotency key on outbound publish, retry with capped exponential backoff.
- **Memory Hygiene:** periodic summarization + bounded retention for local records.
- **Policy Drift:** explicit response contract tests on generated drafts before publish.

## 7. The "Golden Rule" Filter
- [x] Is it Accessible?
- [x] Is it Durable?
- [x] Is it DRY?
- [x] Is it Minimal?
- [x] Is it Performant?
- [x] Is it Testable?

## 8. Pending Clarifications Before Process Phase
- Confirm memory scope default for V1: hybrid (global + per-thread/per-user) is recommended.
- Confirm initial proactive target source: keyword set, feed list, or account allowlist first.
- Confirm retention window for local communication records (for example: 30/60/90 days).
