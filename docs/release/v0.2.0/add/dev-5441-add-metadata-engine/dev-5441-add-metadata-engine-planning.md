---
title: "Planning: Metadata & Lineage Engine"
id: DEV-5441
category: add
slug: dev-5441-add-metadata-engine
status: planning
icon: lucide:layout-template
tags: planning, architecture, metadata, lineage, vfs
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Architectural blueprint for the media metadata engine and proxy registration pipeline.
---

# Phase 1: Planning

## 1. Selected Strategy: Integrated Loop
We will integrate metadata extraction into the ingestion pipeline and proxy registration into the background worker pipeline.

### Key Components:
1.  **VFS Metadata Bridge:** A helper to upsert EAV records into `file_metadata`.
2.  **FFprobe Mapper:** Logic to extract `video` and `audio` stream info from FFprobe JSON.
3.  **Proxy Closer:** `VfsService::register_proxy_blob` to link new derivatives to their parents.

## 2. Technical Specifications

### A. EAV Mapping Table
| Source (FFprobe) | EAV Key | Type |
| :--- | :--- | :--- |
| `streams[0].width` x `height` | `media.resolution` | Text |
| `format.duration` | `media.duration_sec` | Num |
| `streams[0].codec_name` | `media.codec` | Text |
| `format.bit_rate` | `media.bitrate` | Num |

### B. Proxy Registration Flow
1.  **Worker:** Finishes `ffmpeg` thumbnail extraction.
2.  **Stat:** Get size and hash of the new WebP file.
3.  **VFS:** `register_proxy_blob(parent_node_id, path, intent='proxy', mime='image/webp')`.
4.  **SQL:** Insert into `asset_blobs`, then insert into `permutations`.

## 3. GraphQL Schema Expansion
Add `metadata` field to `FileNode`:
```graphql
type FileMetadata {
  key: String!
  value: String
}

extend type FileNode {
  metadata: [FileMetadata!]!
}
```

## 4. The "Golden Rule" Filter
- [x] **Accessible:** Technical metadata enables screen readers to announce video duration and resolution.
- [x] **Durable:** Transactional registration ensures we never have "orphaned" thumbnails in the DB.
- [x] **DRY:** Reuses `ingest_local_file` sharding logic for proxies.
- [x] **Performant:** Probing happens in the background worker, keeping the main ingestion API fast.
