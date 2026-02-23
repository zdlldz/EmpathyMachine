---
title: "Discovery: Ingestion Hardening"
id: DEV-5443
category: add
slug: dev-5443-add-ingestion-hardening
status: in-progress
icon: lucide:search
tags: discovery, research, performance
author: agent-codex
version: v0.2.0
date: 2026-02-17
description: Research and discovery for hardening the media ingestion pipeline.
---

# Phase 0: Discovery

## 1. Context Gathering
- **Target Component:** `frontend/src/lib/components/blocks/global-dropzone.svelte`.
- **Backend Bridge:** `ingestLocalFile` mutation in `backend/src/api/schema/`.
- **Current Pattern:** A `for...of` loop in Svelte that awaits each `graphqlRequest` sequentially.
- **Risks Identified:**
  - **Sequential Bottleneck:** If 100 files are dropped, and each takes 200ms, the UI remains in a "busy" state for 20 seconds.
  - **Connection Overload:** If we run them all in `Promise.all`, we may exceed database lock limits or network socket limits.
  - **Lack of Visibility:** The user has no way to see progress once the overlay disappears.

## 2. Intent vs. Reality
- **Intent:** Enterprise-grade batch processing.
- **Reality:** Simple client-side loop with no concurrency or failure recovery.

## 3. Findings & Risks
- **[PERFORMANCE]** The current implementation is O(n) blocking. We need a producer/consumer model or a semaphore-based concurrent pool.
- **[UX]** We need a centralized notification/toast service. `frontend/src/lib/components/ui/` should be checked for an existing Toast component.
- **[DURABILITY]** If the app closes mid-ingestion, the remaining files are lost.
