---
title: "Planning: Architectural Hardening"
id: DEV-5445
category: improve
slug: dev-5445-arch-hardening
status: in-progress
icon: lucide:layout-template
tags: planning, architecture, modularization
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Strategy for decomposing monolithic files into focused, maintainable modules.
---

# Phase 1: Planning

## 1. Refactor Strategy

### A. PromptEngine (`backend/src/domain/prompt_engine/`)
- `types.rs`: All `enum`, `struct`, and `const` definitions.
- `validation.rs`: Merging `validator.rs` and `deep_validator.rs`.
- `registry.rs`: Provider definitions (`PROMPT_PROVIDERS`).
- `engine.rs`: Core CRUD and business logic.
- `mod.rs`: Re-exports and public API.

### B. VFS (`backend/src/domain/storage/vfs/`)
- `core.rs`: Blob and node persistence logic.
- `taxonomy.rs`: Tag and collection logic.
- `ingestion.rs`: File and folder ingestion methods.
- `mod.rs`: Registry and `VfsService` struct.

### C. GraphQL Schemas (`backend/src/api/schema/`)
- `files/mutations.rs`
- `files/queries.rs`
- `prompts/mutations.rs`
- `prompts/queries.rs`

## 2. High-Level Dependency Map
The goal is to move from **Horizontal Layering** (all queries in one file) to **Vertical Slicing** (all file-related GraphQL in one folder).

## 3. The "Golden Rule" Filter
- [x] **Accessible:** N/A (Internal).
- [x] **Durable:** Uses Rust's visibility modifiers (`pub`, `pub(crate)`) to enforce boundaries.
- [x] **DRY:** Eliminates duplicate imports within monolithic files.
- [x] **Minimal:** No new functional logic; pure refactor.
- [x] **Performant:** No impact on runtime; potential minor improve in dev compile times.
