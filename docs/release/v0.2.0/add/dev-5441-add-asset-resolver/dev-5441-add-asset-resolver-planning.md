---
title: "Planning: Asset Resolver & Streaming API"
id: DEV-5441
category: add
slug: dev-5441-add-asset-resolver
status: planning
icon: lucide:layout-template
tags: planning, architecture, axum, streaming
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Architectural blueprint for the Axum asset resolver, detailing range requests, authentication, and sharded path resolution.
---

# Phase 1: Planning

## 1. Selected Strategy: Stateful Stream Handler
We will implement a custom Axum handler that bridges the VFS database and the HTTP response layer.

### Key Components:
1.  **Resolver Route:** `GET /v1/asset/:id`
2.  **Auth Guard:** Verifies the `?token=...` query parameter or `Authorization` header.
3.  **VFS Bridge:** Lookups the physical path and MIME type in SQLite.
4.  **Range Engine:** Handles byte-range calculations for `206 Partial Content` responses.

## 2. Technical Specifications

### A. URL Generation Logic
To make assets usable in standard HTML tags (`<img>`, `<video>`), the backend will expose a helper to generate "Web-Ready" URLs:
`[api_base]/v1/asset/[asset_id]?token=[short_lived_token]`

### B. Range Request Flow
1.  **Request:** `Range: bytes=500-999` received.
2.  **Stat:** Get total file size from OS (or DB).
3.  **Seek:** Open file and seek to byte 500.
4.  **Stream:** Stream 500 bytes to the response body.
5.  **Headers:** Return `Content-Range: bytes 500-999/TOTAL_SIZE`.

### C. Security Constraints
- **Tenant Isolation:** The SQL query must be `WHERE id = ? AND tenant_id = ?`.
- **Token Scope:** The URL token should be tied to the user's session and have a configurable TTL (e.g., 4 hours).

## 3. The "Golden Rule" Filter
- [x] **Accessible:** Supports `<track>` for subtitles and standard browser media controls.
- [x] **Durable:** Uses `tokio::fs` for non-blocking I/O to prevent thread pool starvation on large files.
- [x] **DRY:** Leverages the existing `VfsService` for path resolution.
- [x] **Performant:** `immutable` cache headers prevent redundant requests for the same content-addressed blob.

## 4. Implementation Stages
1.  **Stage 1:** Basic file serving (Identity mapping).
2.  **Stage 2:** Range request support (Video seeking).
3.  **Stage 3:** Pre-signed URL helper (Frontend integration).
