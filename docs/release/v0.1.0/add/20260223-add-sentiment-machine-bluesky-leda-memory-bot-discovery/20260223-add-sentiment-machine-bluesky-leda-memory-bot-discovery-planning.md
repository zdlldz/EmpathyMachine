---
title: "Planning: SentimentMachine Companion Service for EmpathyMachine"
id: 20260223
category: add
slug: 20260223-add-sentiment-machine-bluesky-leda-memory-bot-discovery
status: planning
icon: lucide:layout-template
tags: planning, architecture, sentiment-machine, empathy-machine, bluesky
author: codex
version: v0.1.0
date: 2026-02-23
description: DRY-first scaffold plan for a sentiment companion service that feeds engagement decisions and observability for EmpathyMachine.
---

# Phase 1: Planning

## 1. Solution Comparison

### Solution A: Inline Sentiment Inside Empathy Worker
- **Pros:** fastest possible implementation.
- **Cons:** sentiment logic tightly coupled; poor reuse; higher long-term refactor cost.

### Solution B: Standalone Sentiment Service with Shared Contracts (Recommended)
- **Pros:** reusable across bots, testable in isolation, clearer boundaries, supports future model swaps.
- **Cons:** one extra package/process to maintain.

### Solution C: Third-Party Sentiment API Only
- **Pros:** minimal engineering effort.
- **Cons:** less control, cost and privacy concerns, weaker explainability, harder offline/local-first workflow.

## 2. Selected Strategy
Choose **Solution B**.

SentimentMachine should begin as a companion package/service with strict shared contracts so EmpathyMachine can consume results without embedding sentiment internals. This preserves DRY principles and lets sentiment quality evolve without destabilizing bot orchestration.

## 3. High-Level Architecture
- **Data Flow:**
  1. Receive normalized thread/post context from `shared-types`.
  2. Produce `SentimentResult` with score, confidence, and rationale tags.
  3. Emit result to `policy-engine` for engage/suppress decisioning.
  4. Persist sentiment events for trend and post-analysis.
- **Key Symbols (planned):**
  - `packages/sentiment-engine/src/contracts.ts`
    - `SentimentInput`, `SentimentResult`, `SentimentLabel`
  - `packages/sentiment-engine/src/analyzers/*`
    - `ruleBasedAnalyzer`, `llmAssistedAnalyzer` (behind feature flag)
  - `packages/sentiment-engine/src/pipeline.ts`
    - `analyzeConversationSentiment()`
  - `packages/shared-types/src/events.ts`
    - shared event DTOs consumed by worker, CLI, web
- **Standards:**
  - Explainable output (`label`, `score`, `confidence`, `reasons[]`)
  - Abstain behavior for low-confidence classifications
  - Deterministic fallback when model inference is unavailable

## 4. V1 Scope for SentimentMachine
- **Primary Role:** scoring assistant for engagement and observability, not a publishing actor.
- **Outputs in V1:**
  - post-level and thread-level sentiment scores,
  - confidence score,
  - trend buckets (`improving`, `stable`, `degrading`) over fixed windows.
- **Operational Mode:** local-first, same event store as EmpathyMachine.
- **Control Flags:**
  - `SENTIMENT_ENABLED=true|false`
  - `SENTIMENT_MODE=rules|llm|hybrid`
  - `SENTIMENT_MIN_CONFIDENCE=<float>`

## 5. Integration Contract with EmpathyMachine
- `policy-engine` consumes `SentimentResult` and applies threshold logic.
- Proactive thread engagement uses sentiment as one scoring signal, not sole authority.
- Low-confidence sentiment defaults to conservative policy behavior.
- All sentiment decisions are logged to shared audit stream for CLI/web visibility.

## 6. Rollout Slices
1. Define shared sentiment contracts and fixtures.
2. Build rule-based baseline analyzer for deterministic local-first behavior.
3. Wire sentiment results into policy decisions and audit logs.
4. Add optional LLM-assisted analyzer behind feature flag.
5. Expose sentiment traces in CLI (`tail-events`, `inspect-thread`) and web timeline.

## 7. The "Golden Rule" Filter
- [x] Is it Accessible?
- [x] Is it Durable?
- [x] Is it DRY?
- [x] Is it Minimal?
- [x] Is it Performant?
- [x] Is it Testable?

## 8. Open Items for Next Phase
- Confirm initial sentiment taxonomy for V1 labels.
- Confirm acceptable false-positive/false-negative tolerance.
- Confirm whether sentiment storage needs anonymization/redaction in local records.
