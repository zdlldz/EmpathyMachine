---
title: "Process: Prompt & File Service Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: in-progress
icon: lucide:list-checks
tags: process, implementation, rust, prompt-engine
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Checklist and technical process for implementing the capabilities schema and file integration.
---

# Phase 2: Implementation

## Current Focus
Schema definition and initial API Explorer scaffolding.

## Checklist

### 1. Capabilities Schema
- [ ] Extend `PromptEndpointDefinition` in `backend/src/domain/prompt_engine.rs` with `ModelCapabilities`.
- [ ] Define `ModelCapabilities` struct with attachment rules (mime types, sizes).
- [ ] Update static `PROMPT_PROVIDERS` with real capabilities for OpenAI (Images/Video).

### 2. API Explorer (Discovery Tool)
- [ ] Create `backend/src/domain/prompt_engine/explorer.rs`.
- [ ] Implement `ApiExplorer` trait/struct.
- [ ] Implement `OpenAiExplorer` to query `https://api.openai.com/v1/models`.
- [ ] Add CLI command `mm-cli prompt explore --provider openai` to dump the schema.

### 3. VFS Integration
- [ ] Update `create_prompt` to parse `attachments_json` and validate against `ModelCapabilities`.
- [ ] Implement `resolve_attachments` helper that calls `vfs.get_active_blob_for_node`.

### 4. Wire-Up
- [ ] Update GraphQL `PromptEndpointTypeNode` to expose capabilities to the frontend.
- [ ] Verify an end-to-end flow where a prompt with an image attachment passes validation.

## Technical Decisions (In Situ)
- **Lazy Explorer:** The `ApiExplorer` will be a manual tool/CLI command for now, not a background cron job, to avoid API rate limits.
- **Strict Validation:** Prompts will fail creation if attachments violate the schema, rather than failing asynchronously in the job queue.
