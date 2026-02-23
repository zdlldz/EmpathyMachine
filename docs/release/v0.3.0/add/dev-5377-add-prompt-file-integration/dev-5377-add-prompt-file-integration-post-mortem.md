---
title: "Post-Mortem: Prompt & File Service Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: done
icon: lucide:microscope
tags: post-mortem, reflection, roadmap
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Retrospective on the prompt capabilities schema and file integration.
---

# Phase 6: Post-Mortem

## 1. Process Reflection
- **What worked well?** Defining capabilities as data (`ModelCapabilities` struct) rather than hardcoded logic made validation trivial to implement and easy to expose via GraphQL.
- **What was difficult?** The "Deep Validator" needed access to the VFS service, which required threading `VfsService` dependencies through the `create_prompt` call chain in the GraphQL layer.
- **Wish I'd known:** That OpenAI's model list is quite flat; we had to use heuristics (string matching on `gpt-`, `dall-e`) to map models to our internal endpoints.

## 2. Technical Debt & Roadmap
- **[PERFORMANCE]** `ApiExplorer` is synchronous HTTP. Ideally, this should be cached in Redis or SQLite to avoid rate limits on every CLI run.
- **[SUPPORT]** Add `Anthropic` and `Google` explorers.

## 3. Operations & Tooling
- **CLI:** The `mm-cli prompt explore` command is a great developer tool for debugging new API keys or checking model availability.
