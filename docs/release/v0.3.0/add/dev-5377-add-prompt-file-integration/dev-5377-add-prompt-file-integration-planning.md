---
title: "Planning: Prompt & File Service Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: in-progress
icon: lucide:layout-template
tags: planning, architecture, prompt-engine, vfs
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Architectural plan for the capabilities schema, API explorer, and VFS attachment wiring.
---

# Phase 1: Planning

## 1. Solution Comparison

### Solution A: Ad-Hoc Validation
- **Description:** Hardcode checks inside `create_prompt` (e.g., `if model == "sora" && img.width != 1024 ...`).
- **Pros:** Fast to write initially.
- **Cons:** Brittle, not DRY, hard to maintain as models proliferate.

### Solution B: Schema-Driven Capabilities (Selected)
- **Description:** Define a `ModelCapability` struct attached to `PromptEndpointDefinition`. Use a generic `PromptValidator` service to check inputs against this schema.
- **Pros:** declarative, extendable, and can be serialized to the frontend for UI validation.
- **Cons:** Slightly higher upfront complexity.

## 2. Selected Strategy
Implement **Solution B**. We will treat Model Capabilities as data, not code.

### 3. High-Level Architecture

#### A. Capabilities Schema
Extended `PromptEndpointDefinition` in `backend/src/domain/prompt_engine.rs`:
```rust
pub struct ModelCapabilities {
    pub max_attachments: usize,
    pub supported_mime_types: Vec<String>,
    pub max_image_dimensions: Option<(u32, u32)>, // Width, Height
    pub supports_url_attachments: bool,
    pub supports_base64_attachments: bool,
}
```

#### B. Dynamic API Explorer
A new service `backend/src/domain/prompt_engine/explorer.rs` that can:
1.  Query `GET /models` from OpenAI (and others).
2.  Map returned models to our `PromptEndpointDefinition` struct.
3.  Dump this map to JSON for debugging/verification.

#### C. VFS Integration
1.  **Input:** `attachments_json` in `PromptInput` will optionally contain: `[{ "node_id": "..." }]`.
2.  **Resolution:** During `create_prompt` or `execute_run`, the engine calls `vfs.get_active_blob_for_node()` to resolve the file path.
3.  **Adaptation:** The provider implementation (e.g., `openai.rs`) decides whether to send the file as a URL (if R2) or base64 (if Local).

## 4. Key Symbols
- `ModelCapabilities` (Struct)
- `ApiExplorer` (Service/Trait)
- `PromptValidator` (Service)

## 5. The "Golden Rule" Filter
- [x] **Accessible:** Validation errors return clear, human-readable messages.
- [x] **Durable:** Capabilities are versioned with the model ID.
- [x] **DRY:** Validation logic is centralized, not scattered in handlers.
- [x] **Minimal:** Reuses existing VFS paths; no file copying unless strictly necessary (e.g., resizing).
- [x] **Performant:** Validation happens before the job queue; minimal overhead.
