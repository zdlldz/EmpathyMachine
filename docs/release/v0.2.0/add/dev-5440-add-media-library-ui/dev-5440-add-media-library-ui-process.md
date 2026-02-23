---
title: "Process: Media Library & FFmpeg Implementation"
id: DEV-5440
category: add
slug: dev-5440-add-media-library-ui
status: done
icon: lucide:list-checks
tags: process, implementation, rust, svelte5, ffmpeg
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Granular, itemized checklist tracking the implementation of the media library UI and FFmpeg sidecar orchestration.
---

# Phase 2: Implementation

## Current Focus
Complete.

## Checklist

### 1. Sidecar Infrastructure
- [x] Add `mime_guess` to `backend/Cargo.toml`.
- [x] Configure `ffmpeg` and `ffprobe` sidecars in `backend/tauri.conf.json`.
- [x] Create `backend/src/domain/storage/ffmpeg.rs` wrapper.

### 2. Backend Ingestion Logic
- [x] Implement `ingest_folder` command in `backend/src/domain/storage/vfs.rs`.
- [x] Add recursive walker with depth control.
- [x] Update `asset_blobs` schema with `mime_type` column.

### 3. Transformation Engine (Derivative Worker)
- [x] Update `handle_derivative_job` in `backend/src/jobs/derivative_worker.rs`.
- [x] Implement WebP thumbnail generation (160px).
- [x] Implement 360p proxy generation (640x360).

### 4. Frontend UI
- [x] Create `frontend/src/views/media-library-view.svelte`.
- [x] Integrate `FileTree` component with VfsService data.
- [x] Implement "Import" dialog with Recursive/Depth settings.
- [x] Wire `ScrollableGrid` to display generated thumbnails.

### 5. Polish & Cleanup
- [x] Add structured tracing for FFmpeg process milestones.
- [x] Verify "Multiple of 4" dimensions in output files.

## Technical Decisions (In Situ)
- **Placeholders:** Created 0-byte binaries for FFmpeg/FFprobe to satisfy build requirements until real binaries are supplied.
- **i18n Scaling:** Refactored `check-i18n.mjs` to support namespaced locales.

---

## Technical Notes
- **Sidecar Path:** Binaries must be placed in `backend/bin/` (root relative).
- **MIME Guessing:** Fallback to `application/octet-stream` if extension is missing.
- **FFmpeg Flags:** Always use `-y` to overwrite existing proxies if a re-transcode is triggered.
