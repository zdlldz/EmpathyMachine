---
title: "Knowledge: Prompt & File Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: done
icon: lucide:brain-circuit
tags: knowledge, prompt-engine, ai, vfs
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Knowledge captured during the integration of VFS file attachments with the Prompts API.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **Capability-Driven Validation:** Instead of hardcoding checks in the prompt engine, we now define `ModelCapabilities` as data (structs). This allows the frontend to query capabilities via GraphQL and perform pre-flight validation, while the backend enforces strict limits (MIME types, dimensions) before queuing jobs.
- **Dynamic Exploration:** The `ApiExplorer` trait allows us to "ping" providers like OpenAI to discover new models and their constraints dynamically, rather than relying on stale documentation or static enums.

## 2. Gotchas & Pitfalls
- **MIME Type Mismatch:** OpenAI's file API and chat completion API handle images differently. Chat uses base64/URL, while Files API uses multipart uploads. Our abstraction layer needs to handle this adapter logic carefully.
- **Async Validation:** While we validate attachments synchronously during `create_prompt`, deep validation (like checking image dimensions) might require reading the file header, which adds I/O latency to the mutation. We settled on a "fast fail" approach where basic checks happen early, and deeper failures (corrupt files) happen in the background job.

## 3. Core Library Impact
- **Prompt Engine:** Now depends on `VfsService` for file resolution.
- **CLI:** New `prompt explore` command allows developers to debug provider connectivity and model availability.
