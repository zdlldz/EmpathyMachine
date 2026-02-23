---
title: "PR: Prompt & File Service Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: pr-pending
icon: lucide:git-pull-request
tags: pr, documentation, comms
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Pull Request for connecting VFS attachments to the Prompt Engine and adding dynamic API exploration.
---

# Phase 5: Pull Request Prep

## 1. Summary
This PR bridges the gap between the `Prompts API` and the `File Service`, allowing users to attach VFS assets (images, docs) to AI prompts. It introduces a schema-driven "Capabilities" system to validate attachments before they reach the provider, and a new `mm-cli prompt explore` tool for dynamic model discovery.

## 2. Commit History (Draft)
```text
feat: Add ModelCapabilities struct to PromptEndpointDefinition (DEV-5377)
feat: Implement ApiExplorer trait and OpenAiExplorer service (DEV-5377)
feat: Add PromptValidator for deep attachment validation against VFS (DEV-5377)
feat: Add 'prompt explore' command to mm-cli (DEV-5377)
api: Expose capabilities via GraphQL PromptEndpointTypeNode (DEV-5377)
```

## 3. QA & Verification (Handoff)

### Evidence of Proof
- **Detailed QA Report:** `dev-5377-add-prompt-file-integration-qa.md`
- **CLI Output:** Successful model dump from `mm-cli prompt explore`.

### Risk Map (Blast Radius)
- **Primary:** `PromptEngine`, `VfsService`
- **Secondary:** `FilesMutation` (create_prompt validation logic)

## 4. QA Checklist
- [x] **Functionality:** Attachments are validated against model constraints.
- [x] **Tooling:** CLI command works with valid API Key.
- [x] **Integration:** Schema changes are non-breaking for existing frontend queries.
