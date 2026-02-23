---
title: "Process: Asset Resolver Implementation"
id: DEV-5441
category: add
slug: dev-5441-add-asset-resolver
status: done
icon: lucide:list-checks
tags: process, implementation, rust, axum, streaming
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Granular, itemized checklist for the Axum asset resolver and HTTP Range request engine.
---

# Phase 2: Implementation

## Current Focus
Complete.

## Checklist

### 1. VFS Enhancements
- [x] Add `get_blob_by_id` to `backend/src/domain/storage/vfs.rs`.
- [x] Add `get_node_permutation` to retrieve specific 'proxy' or 'original' blobs.

### 2. Axum Infrastructure
- [x] Create `backend/src/api/assets.rs` handler module.
- [x] Implement `asset_handler` with token validation.
- [x] Register `/v1/asset/:id` route in `backend/src/api/mod.rs`.

### 3. Range Request Engine
- [x] Implement `Range` header parsing logic.
- [x] Add `206 Partial Content` response support.
- [x] Support `If-Range` and `Content-Range` headers.

### 4. Frontend Integration
- [x] Add `resolveAssetUrl` utility to `frontend/src/core/api-client.ts`.
- [x] Update `MediaLibraryView.svelte` to use real resolver URLs instead of placeholders.

### 5. Hardening
- [x] Add `Cache-Control` immutable headers.
- [x] Verify multi-tenant isolation via manual tests.

## Technical Decisions (In Situ)
- **Hybrid Auth:** Supported both `Authorization` header and `?token=` query param to allow standard `<img>` tags to work without JS proxying.
- **Inclusive Range:** Strictly adhered to RFC 7233 for byte-range math (inclusive boundaries).

---

## Technical Notes
- **Streaming:** Use `axum::body::Body::from_stream` with `ReaderStream` from `tokio-util`.
- **Range Logic:** Be careful with inclusive vs exclusive range boundaries (0-999 is 1000 bytes).
- **MIME:** Ensure `Content-Type` is correctly pulled from the `asset_blobs` record.
