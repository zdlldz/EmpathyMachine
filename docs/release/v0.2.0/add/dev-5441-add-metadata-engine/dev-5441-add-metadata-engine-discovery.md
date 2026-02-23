---
title: "Discovery: Metadata Extraction & Lineage"
id: DEV-5441
category: add
slug: dev-5441-add-metadata-engine
status: in-progress
icon: lucide:search
tags: discovery, ffprobe, metadata, lineage
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Technical discovery for extracting media metadata via ffprobe and registering asset permutations in the VFS.
---

# Phase 0: Discovery

## 1. The Vision: Intelligent Media VFS
The VFS should not just store bytes; it should understand them. We need to automatically populate the `file_metadata` table with technical details and track all variants (thumbnails, proxies) created for a source file.

## 2. Technical Pillars

### A. FFprobe Intelligence
We already have `FfmpegService::probe(&path)`. We need to:
- Map the JSON output to our `file_metadata` schema.
- Common keys: `width`, `height`, `duration`, `codec_name`, `avg_frame_rate`, `bit_rate`.

### B. The Lineage Loop (Proxy Registration)
When `DerivativeWorker` finishes a WebP thumbnail:
1.  It must create a new `AssetBlob` record for the thumbnail.
2.  It must create a new `Permutations` record linking the original `FileNode` to this new blob.
3.  Intent: `proxy`.

### C. EAV Storage Model
The `file_metadata` table is an EAV (Entity-Attribute-Value) store.
- **Key:** technical.resolution
- **Value:** 1920x1080
- **Advantage:** Flexible, doesn't require schema changes for new metadata types (e.g. AI-generated tags).

## 3. Implementation Alternatives

### Registration Timing
- **Solution A: Ingestion-time (Probing):** Probe the file during `ingest_local_file`. (Best for static metadata like resolution).
- **Solution B: Worker-time (Lineage):** Register thumbnails after transcode completes. (Necessary for derivatives).

## 4. Preliminary Questions
- **Metadata Hierarchy:** Should we store metadata at the `FileNode` level (logical) or `AssetBlob` level (physical)? 
    - *Decision:* Store at `FileNode` level for logical search, but some metadata (like codec) is tied to the blob. 
    - *Plan:* Use `file_metadata` for node-level logic and consider a `blob_metadata` if physical variance becomes complex. For now, stick to `file_metadata`.
- **UI Exposure:** Should we expose metadata via a new GraphQL field? (Recommendation: Yes, `metadata { key, value }`).
