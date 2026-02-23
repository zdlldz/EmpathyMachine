---
title: "Knowledge: File Service API"
id: DEV-5422
category: add
slug: dev-5422-add-file-service-api
status: done
icon: lucide:brain-circuit
tags: knowledge, storage, rust, vfs
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Core technical insights and "Gotchas" discovered during the VFS implementation.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **Hash Sharding:** Implemented 2-character directory sharding (e.g., `storage/tenant_id/ab/hash`) to prevent file systems from choking on thousands of files in a single directory.
- **Async Streaming:** Standardized on `BoxStream<'static, Result<Bytes, std::io::Error>>` for the `StorageProvider`. This allows the app to move multi-gigabyte files with constant memory overhead.

## 2. Gotchas & Pitfalls
- **Path Parents:** Learned that `source_path.parent()` can be `None` for relative or root paths. Refactored `VfsService` to handle this safely with `StorageError::Validation`.
- **Duplicate Constraints:** SQLite `UNIQUE(tenant_id, hash)` allows for global deduplication while maintaining strict multi-tenant isolation.

## 3. Core Library Impact
- [x] `docs/knowledge/ops/` should be updated with VFS management commands.
- [x] `agents_tauri.md` should be refined with the "Vault Serialization" rule (already completed).
