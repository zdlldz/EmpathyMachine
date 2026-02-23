---
title: "Process: Architectural Hardening"
id: DEV-5445
category: improve
slug: dev-5445-arch-hardening
status: in-progress
icon: lucide:list-checks
tags: process, implementation, modularization
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Checklist and technical process for Rust file modularization.
---

# Phase 2: Implementation

## Current Focus
Initial modularization of PromptEngine.

## Checklist

### 1. PromptEngine Refactor
- [ ] Create `backend/src/domain/prompt_engine/types.rs` and migrate structs/enums.
- [ ] Create `backend/src/domain/prompt_engine/registry.rs` and migrate static provider logic.
- [ ] Consolidate validation into `backend/src/domain/prompt_engine/validation.rs`.
- [ ] Move core methods to `backend/src/domain/prompt_engine/engine.rs`.
- [ ] Verify with `cargo check`.

### 2. VFS Refactor
- [ ] Create directory `backend/src/domain/storage/vfs/`.
- [ ] Decompose `vfs.rs` into logical files.
- [ ] Update `backend/src/domain/storage/mod.rs` to reflect directory move.
- [ ] Verify with `cargo check`.

### 3. GraphQL Schema Refactor
- [ ] Modularize `files.rs` into `files/` directory.
- [ ] Modularize `prompts.rs` into `prompts/` directory.
- [ ] Verify with `cargo check`.

## Technical Decisions (In Situ)
- **Visibility:** Using `pub` for items required by external modules and `pub(crate)` for internal inter-module logic.
- **Re-exports:** Using `pub use` in `mod.rs` files to maintain public API stability while changing internal organization.

## Boundary Cases
- [ ] **Tests:** Ensure unit tests migrated into new files still run.
- [ ] **Cyclic Dependencies:** Watch for cross-module imports that might cause cycles.
