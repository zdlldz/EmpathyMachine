---
title: "Planning: Media Library & FFmpeg Integration"
id: DEV-5440
category: add
slug: dev-5440-add-media-library-ui
status: planning
icon: lucide:layout-template
tags: planning, architecture, ffmpeg, svelte5
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Architectural blueprint for the media library UI, FFmpeg sidecar orchestration, and recursive ingestion logic.
---

# Phase 1: Planning

## 1. Solution Comparison

### FFmpeg Invocation
- **Solution A: Shell Commands (Rejected):** Simple but prone to escaping issues and lacks process control.
- **Solution B: `tauri::process::Command` (Selected):** Built-in Tauri support for sidecars, provides better lifecycle management and security (via `capabilities`).

## 2. Selected Strategy: The "Media Rail"
We will implement a high-performance "Media Rail" that bridges the VFS and the UI.

### Key Components:
1.  **FFmpeg Sidecar Service:** A Rust wrapper around the `ffmpeg` binary.
2.  **MediaLibraryView:** A two-pane view (FileTree + ScrollableGrid).
3.  **Recursive Ingestor:** A recursive walker in Rust that enqueues `VfsService::ingest_local_file` tasks.

## 3. High-Level Architecture

### Data Flow (Ingestion)
1.  **UI:** User selects folder + "Recursive (Level 2)".
2.  **Command:** `ingest_folder(path, recursive: true, depth: 2)` invoked.
3.  **Rust:** `VfsService` walks directory, filters for media extensions, and enqueues VFS records.
4.  **Jobs:** `DerivativeWorker` detects new records and spawns FFmpeg sidecar for WebP thumbs.

### UI Architecture (Svelte 5)
- **`MediaLibraryView.svelte`**: The root container.
- **`MediaSidebar.svelte`**: Uses `FileTree` component, bound to a new `useCollections` or `useFolders` rune.
- **`MediaGrid.svelte`**: Uses `ScrollableGrid` + `useLibrary`.

## 4. Technical Specifications

### FFmpeg Command Pattern (macOS Example)
```bash
# Suffix requirement: ffmpeg-aarch64-apple-darwin
ffmpeg -hwaccel videotoolbox -i [source] -vf "scale=160:-1" -vframes 1 [output].webp
```

### DB Schema Updates (Minor)
- Add `mime_type` to `asset_blobs` for precise handler routing.
- Ensure `file_nodes` can store `parent_id` for hierarchical browsing.

## 5. Technical Requirements & Hardening
- **MIME Detection:** Use the `mime_guess` crate in Rust to categorize assets during ingestion.
- **Process Control:** Implement a kill-switch in the `DerivativeWorker`. If a job is canceled via GraphQL, the corresponding FFmpeg sidecar process must be terminated immediately.
- **Concurrency Guard:** Limit simultaneous GPU transcodes to 2 (default) to prevent system UI lag.

## 6. The "Golden Rule" Filter
- [x] **Accessible:** Media grid must support keyboard navigation and screen reader status for transcode progress.
- [x] **Durable:** Sidecars are bundled, ensuring the app doesn't break if the user doesn't have FFmpeg installed.
- [x] **DRY:** Reuses existing `ScrollableGrid`, `GridCardMedia`, and `JobRunner`.
- [x] **Performant:** GPU acceleration via VideoToolbox/NVENC ensures low CPU usage during transcode.
- [x] **Minimal:** Only generates 160px WebP thumbs and 360p proxies by default.
