---
title: "Planning (V2): Media Processor Plugins"
id: DEV-5447
category: improve
slug: dev-5447-media-processor-plugins
status: in-progress
icon: lucide:layout-list
tags: planning, architecture, implementation, plugins
author: agent-codex
version: v0.3.0
date: 2026-02-18
description: Deeper architectural planning for the Media Processor framework, ensuring high-performance, pluggable, and durable file handling.
---

# Phase 1: Planning (Refined)

## 1. Architectural Strategy: The "Pipeline" Model
Instead of a single processor per file, we will implement a **Pipeline Registry**. This allows multiple processors to contribute to a single file node.

- **Phase A (Metadata):** Extract technical details (size, MIME validation, checksum confirmation).
- **Phase B (Derivatives):** Generate visual proxies (thumbnails, transcodes).
- **Phase C (Intelligence):** Run OCR, AI classification, or content-specific parsing.

## 2. The `MediaProcessor` Trait (Finalized)
```rust
#[async_trait]
pub trait MediaProcessor: Send + Sync {
    /// Unique identifier for the processor (e.g., "visual-ffmpeg")
    fn id(&self) -> &str;
    
    /// Higher priority processors run first.
    fn priority(&self) -> i32 { 0 }

    /// Determine if this processor can handle the given MIME type.
    fn supports(&self, mime_type: &str) -> bool;

    /// Primary execution hook.
    async fn process(&self, ctx: &ProcessContext) -> Result<ProcessResult, ProcessorError>;
}
```

## 3. Data Structures & Context
- **`ProcessContext`**: Injected with `VfsService`, `SqlitePool`, and metadata about the node being processed.
- **`ProcessResult`**: A collection of **Metadata Pairs** (Key/Value) and **Derivative Requests** (Paths to files that should be registered as new `asset_blobs`).

## 4. The "First-Class" Rebuild Utility
To ensure this is a first-class citizen, the rebuild logic must:
1. **Be Resumable:** Use the Job Engine to track progress. If the app restarts, the batch continues.
2. **Be Atomic:** Each file is its own job. A failure in one file (e.g., a corrupt GIF) does not halt the entire library rebuild.
3. **Provide Feedback:** Emit `JobEvents` so the UI can show "Processing 455/1200 items...".

## 5. Implementation Roadmap
1. **Scaffold Domain:** Create `backend/src/domain/processor/`.
2. **Core Traits:** Implement `traits.rs` and `context.rs`.
3. **The Registry:** Implement `ProcessorRegistry` with priority sorting.
4. **Visual Implementation:** Move FFmpeg logic into `VisualProcessor`.
5. **Base Implementation:** Create `BaseMetadataProcessor` for agnostic properties.
6. **Job Integration:** Refactor `derivative_worker.rs` to use the registry.
7. **GraphQL/CLI:** Expose `rebuildMediaMetadata` mutation and command.
8. **UI:** Add the utility button to Settings.
