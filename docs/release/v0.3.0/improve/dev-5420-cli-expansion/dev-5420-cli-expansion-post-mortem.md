---
title: "Post-Mortem: CLI Application Expansion"
id: DEV-5420
category: improve
slug: dev-5420-cli-expansion
status: done
icon: lucide:microscope
tags: post-mortem, reflection, cli
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Retrospective on the CLI expansion and serialization challenges.
---

# Phase 6: Post-Mortem

## 1. Process Reflection
- **What worked well?** The `CliContext` architecture made it extremely easy to plug in new domain services like `VfsService`.
- **What was difficult?** Resolving `Serialize` trait bounds for domain records that were originally designed for GraphQL only.
- **Wish I'd known:** That `sqlx` migrations check checksums by default, which can be sensitive to whitespace or comment changes in dev.

## 2. Technical Debt & Roadmap
- **[PERFORMANCE]** The `vfs list` command is currently a flat list. For massive libraries, we should add pagination flags (`--first`, `--after`).
- **[UX]** Add a `vfs search` command using the new `suggest_taxonomies` logic.

## 3. Operations & Tooling
- **Auto-Docs:** The `mm-cli docs generate` command is now a vital part of the release cycle to ensure the Command Reference stays in sync.
