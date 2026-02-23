---
title: "Discovery: Media Library & FFmpeg Engine"
id: DEV-5440
category: add
slug: dev-5440-add-media-library-ui
status: complete
icon: lucide:search
tags: discovery, ffmpeg, svelte5, gpu, performance
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Research and technical discovery for the high-performance media library and transformation engine.
---

# Phase 0: Discovery

## 1. The Vision: High-Performance Media DX
The goal is to transition the VFS from a backend storage layer to a visual, interactive **Media Library**. This requires a first-class UI and a "righteous" transformation engine.

## 2. Technical Pillars

### A. The "Multiple of 4" Strategy
Many hardware encoders (including GPU-based ones) perform most efficiently when dimensions are multiples of 4 (or 16).
- **Policy:** All generated thumbnails/proxies must strictly follow `width % 4 == 0` and `height % 4 == 0`.
- **Target Sizes:** 
    - **Thumbnails:** 160px WebP (Replaces 150px).
    - **Proxies:** 640x360 MP4 (360p).

### B. High-Performance FFmpeg (Tauri Sidecar)
FFmpeg will be integrated as a first-class Rust service using a **Tauri Sidecar**.
- **Reasoning:** Sidecars ensure 100% consistent behavior across user machines and allow us to use specific GPU-optimized flags.
- **macOS (Darwin):** Use `h264_videotoolbox` or `hevc_videotoolbox` for hardware-accelerated encoding.
- **Windows:** Use `h264_nvenc` (NVIDIA) or `h264_qsv` (Intel).

### C. Media Library UI (Svelte 5)
A dedicated `MediaLibraryView.svelte` will be created, leveraging existing components:
- **Navigation (Sidebar):** An evolution of the `FileTree` component, connected to the backend `VfsService`.
- **Content (Main):** The core `ScrollableGrid` using specialized media cards.
- **Consistency:** Use the same `GridCardMedia` and `GridCardData` components as other project grids.
- **Performance:** Integrated with `library.svelte.ts` for virtualization and 150ms debounced search.

## 3. The Ingestion Flow & UI
The ingestion UI must support complex batch operations:
- **Recursive Control:** 
    - A "Recursive" checkbox in the import dialog.
    - A depth field: `0` (Infinite), `1`, `2`, etc.
- **Preview Integration:** Every ingested file automatically enters the `derivative_gen` job queue.

## 4. Requirement: WebP Thumbnails
- **Why:** WebP offers superior compression and alpha support compared to JPG/PNG.
- **Standard:** Every ingested visual asset must produce at least one `160px` WebP thumbnail.

## 5. Preliminary Questions & Clarifications
- **FFmpeg Binaries:** We will bundle specific "Static" FFmpeg binaries as Sidecars.
- **Concurrent Transforms:** We will allow 2-4 simultaneous GPU transcodes depending on hardware detection.

## 6. Risks
- **GPU Driver Drift:** Different OS versions handling hardware acceleration differently.
- **Binary Permissions:** macOS Gatekeeper/App Sandbox restrictions on executing sidecar binaries.
- **Memory Overhead:** FFmpeg can be hungry; must be managed as a background task via the `JobRunner`.
