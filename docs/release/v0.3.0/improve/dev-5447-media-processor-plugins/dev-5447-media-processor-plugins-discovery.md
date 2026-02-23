---
title: "Discovery: Media Processor Plugins"
id: DEV-5447
category: improve
slug: dev-5447-media-processor-plugins
status: in-progress
icon: lucide:search
tags: discovery, architecture, plugins, media
author: agent-codex
version: v0.3.0
date: 2026-02-18
description: Exploration of the current media processing limitations and the proposed pluggable architecture.
---

# Phase 0: Discovery

## 1. Current State (The "Sloppy" Reality)
- **Hardcoded Logic:** `DerivativeWorker` uses an `if/else` block based on MIME type starts (`image/`, `video/`). This is a classic monolith-in-the-making.
- **Inflexible Storage:** Thumbnails are always 160px WebP. There's no way to request a "high-res proxy" or different formats without changing core code.
- **Missing Domain:** "Processing" doesn't have its own domain in `backend/src/domain/`. It lives inside `jobs/` and `storage/vfs/`.

## 2. The Plugin Vision
We need a `MediaProcessor` trait that returns **Derivatives** (blobs) and **Metadata** (EAV pairs).

### Proposed Trait (Conceptual)
```rust
#[async_trait]
trait MediaProcessor: Send + Sync {
    fn id(&self) -> &str;
    fn can_handle(&self, mime_type: &str) -> bool;
    async fn process(&self, context: &ProcessContext) -> Result<ProcessResult, ProcessError>;
}
```

### Potential Plugins
- **VisualProcessor:** (Current FFmpeg logic) -> Thumbnails, Duration, Resolution.
- **PdfProcessor:** -> OCR, Page Count, Text extraction.
- **MarkdownProcessor:** -> Frontmatter parsing, word count.
- **ArchiveProcessor:** -> Content listing (recursive VFS injection?).

## 3. Thumbnail Regeneration Logic
### The Batching Strategy
Regenerating thumbnails for 10,000 items would lock the DB if done in one transaction. 
**The Right Way:**
1. **Trigger:** `rebuildThumbnails(filter: TaxonomyFilter)` mutation.
2. **Orchestrator:** A new Job Type `REBUILD_THUMBNAILS_ORCHESTRATOR` that identifies the nodes.
3. **Execution:** It enqueues individual `derivative_gen` jobs for each node with a `priority: low` flag.
4. **Guardrails:** 
   - Check for existing thumbnails (option to `force: true`).
   - Rate limit the orchestrator to prevent job queue explosion.

## 4. Gaps & Shortcomings
- **MIME Accuracy:** We rely on `mime_guess`. We should move to a "Magic Byte" sniffer for higher enterprise durability.
- **Content Hashing:** We have it (`sha256`), but we don't use it to prevent processing the *same* physical file twice if it exists under different nodes.
- **Worker Isolation:** Processors should ideally run in isolated processes or at least be wrapped in robust error boundaries to prevent one corrupt PDF from crashing the `JobRunner`.
