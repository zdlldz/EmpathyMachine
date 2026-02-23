---
title: "Knowledge: Tauri Performance & DI Inversion"
id: DEV-5446
category: fix
slug: dev-5446-vfs-ui-polish
status: done
icon: lucide:brain-circuit
tags: knowledge, tauri, performance, rust, async-graphql
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Critical knowledge regarding IPC bottlenecks and service injection patterns.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **Synchronous URL Construction:** In Tauri apps, avoid calling IPC (`invoke`) inside loops. Even if the call is "fast", the cumulative overhead of `N` calls will block the UI. Instead, fetch connection parameters *once* and construct URLs synchronously.
- **Type-Strict Injection:** `async-graphql` matches data by exact type. If you inject `Arc<T>`, you *must* request `Arc<T>`. Requesting `T` directly will fail with a "Data not found" or "service does not exist" error.

## 2. Gotchas & Pitfalls
- **IPC Flooding:** Calling async IPC in a `map` or `forEach` loop without a semaphore or batching can lead to a "deadlock" state where the UI cannot process user input because the IPC bridge is saturated.
- **Virtualization Stability:** Always use `overflow: hidden` on virtualized scroll containers to prevent `ResizeObserver` loops caused by fluctuating layout boundaries.

## 3. Core Library Impact
- **ApiState:** Established as the "Source of Truth" for all backend services. All GraphQL schemas must align their `ctx.data::<T>()` calls with the wrappers provided by `ApiState`.
