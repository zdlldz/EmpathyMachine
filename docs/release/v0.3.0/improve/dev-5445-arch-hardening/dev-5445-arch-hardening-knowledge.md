---
title: "Knowledge: Modular Rust Architecture"
id: DEV-5445
category: improve
slug: dev-5445-arch-hardening
status: done
icon: lucide:brain-circuit
tags: knowledge, rust, modularization, patterns
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Architectural standards established during the backend hardening cycle.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **Vertical Slicing:** Instead of a single `queries.rs` for the entire app, each domain (Files, Prompts, etc.) now has its own folder with local `queries.rs` and `mutations.rs`. These are merged at the root `api/schema/mod.rs` using `MergedObject`.
- **Directory-Based Submodules:** For large domain services (VFS, PromptEngine), prefer a directory structure with a `mod.rs` entrypoint that handles re-exports. This keeps the public API clean while allowing internal logic to stay granular.

## 2. Gotchas & Pitfalls
- **Module Shadowing:** Avoid naming a directory the same as a file in the same parent (e.g., `schema.rs` vs `schema/`). Rust 2018+ allows this but it can confuse some tooling and leads to ambiguity errors.
- **Visibility Chain:** Use `pub(crate)` for helper functions used across sub-modules but not intended for the public domain API.

## 3. Core Library Impact
- **ApiState:** Now uses accessor methods (`pool()`, `vfs()`) to satisfy visibility requirements of sub-modules while keeping fields private.
