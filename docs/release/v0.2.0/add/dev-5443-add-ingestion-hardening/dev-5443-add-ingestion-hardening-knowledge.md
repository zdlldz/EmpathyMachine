---
title: "Knowledge: Ingestion Hardening"
id: DEV-5443
category: add
slug: dev-5443-add-ingestion-hardening
status: done
icon: lucide:brain-circuit
tags: knowledge, semaphore, ingestion, concurrency
author: agent-codex
version: v0.2.0
date: 2026-02-17
description: Knowledge and architectural patterns discovered during ingestion hardening.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **The Orchestrated Service Pattern:** Moving business logic (like batch ingestion) out of components and into a singleton service (`IngestionService`) ensures that state persists across view transitions and simplifies component logic.
- **Client-Side Semaphore:** Using a `Semaphore` utility is the canonical way to control concurrency for async tasks in the frontend. It prevents "Network Hammering" and local I/O saturation while still allowing for parallel performance gains.

## 2. Gotchas & Pitfalls
- **Toast Spam:** When processing many files, firing a toast for every individual completion causes significant UI lag and poor UX.
- **Solution:** Use a single persistent "Loading" toast for the batch and update its content with a progress percentage.

## 3. Core Library Impact
- **Settings Integration:** Bubbling up performance-sensitive vars (like concurrency) to the settings UI allows power users to tune the app for their specific hardware (High CPU/GPU vs. Thin Client).
