---
title: "Hybrid VFS Architecture"
category: architecture
status: permanent
tags: vfs, storage, rust, r2, s3
author: agent-codex
---

# Hybrid Virtual File System (VFS)

The application uses a database-backed VFS to decouple logical file management from physical byte storage.

## 1. Core Model
- **FileNode:** A logical entry in the user's library (Folders/Files).
- **AssetBlob:** A unique, content-addressed set of bytes (Deduplicated).
- **Permutation:** A specific version or variant (Thumbnail, Proxy, Edit) of a node pointing to a blob.

## 2. Multi-Provider Registry
The `VfsService` manages a registry of physical backends:
- **Local:** Managed storage in the app data directory with 2-char hash sharding.
- **R2/S3:** Cloud storage for hybrid scaling and cross-device sync.
- **External:** Symbolic links or references to files elsewhere on the system.

## 3. The "Media Rail" Pipeline
1.  **Ingestion:** File is hashed and registered.
2.  **Transformation:** `DerivativeWorker` spawns sidecars (FFmpeg) for thumbnails.
3.  **Registration:** Thumbnails are registered as `proxy` permutations.
4.  **Delivery:** `AssetResolver` streams bytes via Axum with HTTP Range support.

## 4. Security Law
All VFS operations are strictly scoped by `tenant_id`. It is impossible to resolve an `AssetID` or `NodeID` without a valid session for the owning tenant.
