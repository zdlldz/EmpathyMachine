---
title: "Post-Mortem: Architectural Hardening"
id: DEV-5445
category: improve
slug: dev-5445-arch-hardening
status: done
icon: lucide:microscope
tags: post-mortem, reflection, architecture
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Retrospective on the modularization of monolithic backend files.
---

# Phase 6: Post-Mortem

## 1. Process Reflection
- **What worked well?** Using directory-based modules (`mod.rs`) provided a clean way to re-export items, making the refactor almost invisible to external callers (CLI/Tauri).
- **What was difficult?** Managing circular dependencies during the `PromptEngine` split required carefully identifying which types belonged in a shared `types.rs`.
- **Wish I'd known:** That Axum v0.7+ (and v0.8) strictly requires `{capture}` syntax for routes; using the old `:id` style causes a runtime panic.

## 2. Technical Debt & Roadmap
- **[DURABILITY]** Fixed a critical runtime panic in `backend/src/api/mod.rs` where the asset resolver route was using outdated `:id` syntax. Resolved by migrating to `{id}`.
- **[MAINTAINABILITY]** Further extract provider-specific logic (OpenAI, R2) from the `engine.rs` files into a `providers/` sub-module structure.
- **[STANDards]** Formalize the "Vertical Slice" pattern for all future GraphQL domain additions.

## 3. Operations & Tooling
- **DocsMachine:** Handled the refactor documentation smoothly, ensuring the complex movement of logic was tracked across artifacts.
