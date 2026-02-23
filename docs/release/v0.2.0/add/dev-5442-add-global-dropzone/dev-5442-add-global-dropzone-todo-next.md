---
title: "To-Do Next: Global Drag & Drop Ingestion"
id: DEV-5442
category: add
slug: dev-5442-add-global-dropzone
status: done
icon: lucide:fast-forward
tags: roadmap, todo, next-steps
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Actionable follow-up tasks and roadmap items derived from the post-mortem.
---

# Phase 7: To-Do Next

## 1. Ingestion Hardening: The Batch Orchestrator (DEV-5443)
- **The Goal:** Deepen and harden the current ingestion pipeline by moving the frontend sequential loop into a specialized backend or background orchestrator.
- **High-Density Details:**
  - **[PERFORMANCE]** Implement a **Semaphore** (concurrency limit = 5) to prevent overwhelming the system's I/O during massive drops (100+ files).
  - **[UX]** Add a "Toast" notification system to show real-time ingestion progress (e.g., "Ingesting 12/45 files...").
  - **[DURABILITY]** Implement a "Retry" queue for failed ingestions (e.g., file busy, network timeout).

## 2. Media Intelligence: The Vision Worker
- **The Goal:** Add a `VisionWorker` that auto-tags media during ingestion.
- **High-Density Details:**
  - **Auto-Tagging:** Extract labels (e.g., "mountain", "document") using a lightweight local model or external vision API.
  - **Color Palettes:** Generate dominant color swatches for assets to enable "Filter by Color" UI patterns.
  - **OCR:** Perform optical character recognition on dropped documents/screenshots.

## 3. The "Mirror" Bridge (DEV-5439)
- **The Goal:** Verify the Asset Resolver and Global Dropzone in a thin-client (web) environment.
- **High-Density Details:**
  - **Portability:** Audit all `handleDrop` logic for browser compatibility (e.g., `(file as any).path` is Tauri-only; standard web needs a different strategy).
  - **Window Parity:** Ensure the `fade` overlay and `dragCounter` logic behaves identically across browsers.

## 4. VFS Evolution: Virtual Collections
- **The Goal:** Implement logical groupings for assets without physical disk movement.
- **High-Density Details:**
  - **Tags vs. Folders:** Create a "Collection" node type in the VFS that acts as a virtual folder for tagged assets.
  - **Cross-Provider:** Allow a single Collection to contain assets from both Local and R2/S3 providers.

## 5. UI/UX Polish: Video Filmstrips
- **The Goal:** Generate "Sprite Sheets" for frame-accurate scrubbing in the Media Library.
- **High-Density Details:**
  - **FFmpeg Integration:** Orchestrate a background job to capture frames at 1s intervals.
  - **Canvas Delivery:** Deliver these sprite sheets via the `AssetResolver` for high-performance rendering.
