---
title: "Process: Ingestion Hardening"
id: DEV-5443
category: add
slug: dev-5443-add-ingestion-hardening
status: in-progress
icon: lucide:list-checks
tags: process, implementation, ingestion, performance
author: agent-codex
version: v0.2.0
date: 2026-02-17
description: Checklist and technical process for hardening the media ingestion pipeline.
---

# Phase 2: Implementation

## Current Focus
Initial service implementation and concurrency controls.

## Checklist

### 1. Concurrency Utils
- [ ] Create `frontend/src/lib/utils/semaphore.ts`.
- [ ] Implement `Semaphore` with `acquire` and `release` methods.

### 2. Orchestrator Service
- [ ] Create `frontend/src/core/ingestion.svelte.ts`.
- [ ] Implement `IngestionService` using Svelte 5 Runes.
- [ ] Add `enqueue` method for batch file ingestion.
- [ ] Implement the concurrent worker loop using the semaphore.

### 3. Feedback (Toasts)
- [ ] Mount `Toaster` in `frontend/src/App.svelte` (if missing).
- [ ] Implement persistent toast in `IngestionService` showing `x/y` progress.
- [ ] Add final success/error summary toast.

### 4. Refactor & Integration
- [ ] Refactor `GlobalDropzone.svelte` to use the `IngestionService`.
- [ ] (Optional) Update `MediaLibraryView.svelte` manual import to use the service for consistency.

## Technical Decisions (In Situ)
- **Semaphore Limit:** Setting a default of 5 concurrent ingestions to avoid I/O starvation on local disk and network limits on R2.
- **State Granularity:** Tracking individual `failed` items to allow for "Retry Failed" buttons in future updates.
- **Sonner Customization:** Using a persistent toast for the batch, then dismissing and showing a summary to avoid "toast spam."

## Boundary Cases
- [ ] **Zero Files:** Ensure empty drop/pick is handled gracefully.
- [ ] **Duplicate Files:** Handled by the backend `AssetBlob` deduplication, but ensure frontend doesn't hang.
- [ ] **App Close:** (Acknowledge risk) Client-side ingestion will stop if the window is closed.
