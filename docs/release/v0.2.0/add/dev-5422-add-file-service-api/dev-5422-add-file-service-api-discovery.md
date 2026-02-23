---
title: "Discovery: File Service API Spec (VFS Model)"
id: DEV-5422
category: add
slug: dev-5422-add-file-service-api
status: complete
icon: lucide:file-box
tags: discovery, storage, vfs, non-destructive, automation
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Definitive technical discovery for the Universal Virtual File System, enabling non-destructive workflows, multi-modal previews, and hybrid storage.
---

# Phase 0: Discovery (Final)

## 1. The Core Philosophy: "The Sacred Source"
The File Service is built on a **Strict Immutability Law**. Original media sources are never modified. All edits, trims, or transformations result in new **Permutations** within a file's **Lineage**.

- **Non-Destructive Workflow:** The app acts as a lens over the source material.
- **Lineage Engine:** Tracks the relationship between the Source and all generated variants.
- **Internal Integration:** The app's own outputs (e.g., Prompt Engine results) are ingested as first-class citizens.

## 2. Ingestion Policies (Managed vs. External)
Users can choose how the app handles their physical bytes:

| Mode | Physical Action | DB Reference | Use Case |
| :--- | :--- | :--- | :--- |
| **Keep in Place** | Create Symlink | Absolute Path | Large external media libraries. |
| **Import Blob** | Copy to App Dir | Internal Hashed Path | Portable project assets, App-generated results. |

## 3. The Hybrid VFS (Folders vs. Collections)
The system must support two simultaneous ways of viewing data:
- **Hierarchical:** Reflecting the physical disk structure (Recursive folder scanning).
- **Virtualized:** "Collections" that group files from disparate sources (Local + Cloud) into a flat, searchable, or tagged view.

### C. The Modular Cloud (Provider Plugins)
The service must support more than just raw S3/R2 storage.
- **S3-Compatible:** Generic adapter for R2, AWS S3, MinIO.
- **Specialized Services:** Dedicated plugins for **Cloudflare Stream** (Video), **Cloudflare Images** (Optimization), Google Drive, and Dropbox.
- **Integration:** These providers are configured via the existing `Connections API`. The File Service delegates I/O operations to the specific provider implementation associated with the connection.

## 4. Universal Preview Engine (Handler Plugins)
The File Service handles thumbnails and previews via a **Handler Plugin Model**:
- **Media Handlers:** FFmpeg for Video/Audio frames.
- **Document Handlers:** Markdown, PDF.
- **3D Handlers:** GLTF/OBJ snapshots.
- **Cloud Handlers:** Delegating thumbnail generation to the provider (e.g., fetching a pre-generated poster from Cloudflare Stream).

## 5. Metadata & Search (EAV Model)
Every asset is indexed in a searchable SQLite store using an **Entity-Attribute-Value (EAV)** pattern to support infinite metadata types (AI labels, EXIF, Cloud-specific tags) without schema migrations.

## 6. Integrity & Lifecycle (The Janitor)
- **Deduplication:** Content-addressing ensures that identical files share a single `AssetBlob`.
- **Garbage Collection:** An async background task purges `AssetBlobs` that no longer have a logical `FileNode` or `Permutation` reference.
- **Watchers:** Rust `notify` watchers monitor "Keep in Place" files for external deletions or moves.

## 7. Preliminary GraphQL Schema (The VFS Engine)
```graphql
type FileNode {
  id: ID!
  name: String!
  kind: NodeKind! # file | folder | collection
  owner: User!
  activePermutation: Permutation!
  lineage: [Permutation!]!
  metadata: [MetadataEntry!]!
  path: String # Only for physical hierarchical nodes
}

type Permutation {
  id: ID!
  blob: AssetBlob!
  proxies: [ProxyAsset!]! # Thumbnails, waveforms, low-res previews
  createdAt: String!
  intent: String! # e.g., "original", "trimmed", "graded"
}

type AssetBlob {
  id: ID!
  uri: String! # asset://[hash] OR provider://[connection_id]/[remote_id]
  provider: StorageProviderKind! # local_managed | local_external | s3_r2 | cf_stream | gdrive
  hash: String!
  size: Int!
}
```

## 8. Risks & Considerations
- **Orchestration Overload:** Triggering many derivative generators (thumbnails, transcode) simultaneously requires a prioritized job queue.
- **Provider Latency:** Specialized cloud providers (Drive, Dropbox) may have rate limits or latency that require robust caching/sync logic.
- **Plugin Performance:** Third-party binary dependencies (FFmpeg) must be managed across platforms.

