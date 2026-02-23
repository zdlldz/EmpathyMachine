---
title: "Discovery: Architectural Hardening"
id: DEV-5445
category: improve
slug: dev-5445-arch-hardening
status: complete
icon: lucide:search
tags: discovery, research, architecture
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Assessment of monolithic file risks and mapping of modular targets.
---

# Phase 0: Discovery

## 1. Context Gathering
As the project has grown, several core files have exceeded the "sweet spot" for maintainability:
- **`backend/src/domain/prompt_engine/mod.rs`**: ~2500 lines. Handles types, validation, job logic, and provider mapping.
- **`backend/src/domain/storage/vfs.rs`**: ~600 lines. Handles file ingestion, blob management, and taxonomy logic.
- **`backend/src/api/schema/files.rs`**: ~300 lines. Mixes queries and mutations.
- **`backend/src/api/schema/prompts.rs`**: ~1400 lines. Monolithic GraphQL logic.

## 2. Intent vs. Reality
- **Intent:** Small, focused modules following the "Single Responsibility Principle".
- **Reality:** Feature-creep has centralized too much logic in `mod.rs` files.

## 3. Findings & Risks
- **[MAINTAINABILITY]** Difficult to navigate large files; increased chance of merge conflicts.
- **[PERFORMANCE]** (Minor) Single-file compilation cannot be easily parallelized by the Rust compiler.
- **[RISK]** Breaking trait implementations or visibility during the split.

## 4. Target Structure
- **Domain Modules:** Use directory-based modules (`mod.rs` as the entrypoint).
- **GraphQL Schema:** Split into `queries.rs` and `mutations.rs` inside domain-specific folders.
