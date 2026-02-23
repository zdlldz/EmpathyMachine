---
title: "Planning: Ingestion Hardening"
id: DEV-5443
category: add
slug: dev-5443-add-ingestion-hardening
status: in-progress
icon: lucide:layout-template
tags: planning, architecture, ingestion, concurrency
author: agent-codex
version: v0.2.0
date: 2026-02-17
description: Architectural planning for the concurrent ingestion orchestrator.
---

# Phase 1: Planning

## 1. Solution Comparison

### Solution A: Frontend-Only Loop (Current)
- **Pros:** Extremely simple to implement.
- **Cons:** Sequential, blocking (O(n)), no error recovery, poor UX for large batches.

### Solution B: Backend Job Engine
- **Pros:** Most robust; can survive app restarts.
- **Cons:** Higher complexity; requires managing job state in SQLite; overkill for immediate ingestion feedback.

### Solution C: Orchestrated Service (Selected)
- **Pros:** Uses Svelte 5 Runes for real-time UI state. Implements a client-side **Semaphore** for controlled concurrency. Provides immediate feedback via `sonner`.
- **Cons:** State is lost if the window is refreshed (acceptable for now, as ingestion is fast).

## 2. Selected Strategy
Implement a `IngestionService` (singleton) using Svelte 5 Runes. This service will manage a queue of ingestion tasks and execute them using a pool-based approach (max 5 concurrent). It will emit toast notifications for progress and final results.

## 3. High-Level Architecture
- **State Management:** `$state` for `total`, `completed`, `failed`, and `isProcessing`.
- **Concurrency Control:** A custom `Semaphore` utility to limit active GraphQL requests.
- **Feedback Loop:** `toast.promise` or a custom persistent toast for batch progress.
- **Integration:** 
  - `GlobalDropzone.svelte` calls `ingestion.add(files)`.
  - `IngestionService` manages the lifecycle and notifies `sonner`.

## 4. Key Symbols
- `frontend/src/core/ingestion.svelte.ts`: The orchestrator.
- `frontend/src/lib/utils/semaphore.ts`: Concurrency utility.
- `IngestTask`: Interface for individual file ingestion jobs.

## 5. The "Golden Rule" Filter
- [x] **Accessible:** Toast messages are announced by screen readers.
- [x] **Durable:** Failed items are tracked; errors are logged without stopping the batch.
- [x] **DRY:** Centralizes the ingestion logic used by Dropzone and manual pickers.
- [x] **Minimal:** Reuses `svelte-sonner` and existing GraphQL bridges.
- [x] **Performant:** Non-blocking; controls I/O saturation.
- [x] **Testable:** Service can be unit tested independently of the UI.
