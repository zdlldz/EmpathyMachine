---
title: "Planning: CLI Application Expansion"
id: DEV-5420
category: improve
slug: dev-5420-cli-expansion
status: complete
icon: lucide:layout-template
tags: planning, architecture, cli
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Architectural plan for CLI parity expansion.
---

# Phase 1: Planning

## 1. Solution Comparison

### Solution A: GraphQL-Only
- **Pros:** Zero new code in CLI handlers.
- **Cons:** High friction for users (must write raw GraphQL).

### Solution B: Native Rust Handlers (Selected)
- **Pros:** Best UX; reuses domain logic; type-safe.
- **Cons:** Requires small amount of glue code in `cli/vfs.rs`.

## 2. Selected Strategy
Implement native Rust command groups for `vfs`, `taxonomy`, and `metadata`. Reuse the established `CliContext` and domain services to ensure 100% logic parity.

## 3. The "Golden Rule" Filter
- [x] **Accessible:** CLI output supports both Text and JSON formats.
- [x] **Durable:** Transactional integrity maintained via VfsService.
- [x] **DRY:** Business logic is imported from `backend/src/lib.rs`, not duplicated.
- [x] **Minimal:** Lean handlers that delegate to domain services.
- [x] **Performant:** Standard Rust CLI performance (near-zero overhead).
