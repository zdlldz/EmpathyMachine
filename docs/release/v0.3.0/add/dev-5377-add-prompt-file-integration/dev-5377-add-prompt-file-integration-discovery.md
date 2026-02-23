---
title: "Discovery: Prompt & File Service Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: complete
icon: lucide:search
tags: discovery, research, prompt-engine, vfs
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Research and discovery for connecting the Prompts API with VFS file attachments.
---

# Phase 0: Discovery

## 1. Context Gathering
- **Current State:** The `Prompts API` supports basic text prompts and settings JSON. The `VFS` manages files and metadata. There is no direct link between a `Prompt` and a `FileNode` or `AssetBlob`.
- **Legacy Reference:** The React/TypeScript implementation (`references/MediaMachine/backend/src/routes/prompts.ts`) handled attachments implicitly via `ImageGenerationOptions` or direct base64 embedding. It lacked a structured schema for capabilities.
- **Backend Schema:** `PromptInput` in `prompt_engine.rs` has an `attachments_json` field, but it's unstructured JSON. `PromptEndpointDefinition` has a `supports_attachments` boolean flag.

## 2. Intent vs. Reality
- **Intent:** A unified system where users can attach any VFS file (local or cloud) to a prompt, and the system automatically handles formatting, resizing, and uploading based on the model's capabilities (the "Connection Schema").
- **Reality:** Attachments are just a JSON blob. No validation logic exists to check if an image is too large, the wrong format, or if the model even supports that file type.

## 3. Findings & Risks
- **[ARCHITECTURE]** We need a `CapabilitySchema` to define rules per model:
  - `max_attachments`: Count limit.
  - `supported_mime_types`: List of allowed MIME types.
  - `max_dimensions`: For images (e.g., video generation constraints).
  - `max_file_size_bytes`: Byte limit.
- **[INTEGRATION]** The `PromptEngine` needs to resolve `attachments_json` (containing Node IDs) into actual file paths/URLs using the `VfsService` before sending to the provider.
- **[TOOLING]** We rely on static provider definitions. A dynamic `ApiExplorer` is needed to verify these capabilities against live APIs (e.g., querying OpenAI's `GET /models`).

## 4. Technical Hurdles
- **Multipart/Form-Data:** OpenAI's file API often requires multipart uploads, whereas chat completions might take base64 or URL. We need an adapter layer for this.
- **Versioning:** Models change capabilities (e.g., `dall-e-3` vs `dall-e-2`). The schema must be version-aware.
