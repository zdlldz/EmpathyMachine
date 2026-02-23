---
title: "Discovery: Asset Resolver & Streaming"
id: DEV-5441
category: add
slug: dev-5441-add-asset-resolver
status: in-progress
icon: lucide:search
tags: discovery, axum, streaming, range-requests
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Technical discovery for serving VFS assets via Axum, supporting HTTP Range requests for video scrubbing.
---

# Phase 0: Discovery

## 1. The Challenge: Serving "Opaque" Assets
The frontend doesn't know where files are on disk. It only has an `AssetID`. We need a route:
`GET /asset/:id`

## 2. Technical Pillars

### A. HTTP Range Requests (RFC 7233)
Standard video players (`<video>`) require `Range` support to:
- Jump to a specific timestamp.
- Stream large files without downloading the whole thing first.
- **Goal:** Use `tower-http` or manual byte-range math to handle `Range: bytes=0-1023` headers.

### B. Security & Multi-Tenancy
We cannot serve arbitrary files.
- **Verification:** The request must include a session token.
- **Scope:** The system must verify that the `asset_id` belongs to the requesting `tenant_id`.

### C. Performance & Caching
- **Immutable Assets:** Since blobs are content-addressed, they are essentially immutable.
- **Policy:** Use `Cache-Control: public, max-age=31536000, immutable` for all managed blobs.

## 3. Implementation Alternatives

### Solution A: Axum `ServeDir` (Rejected)
`ServeDir` is great for static files but doesn't handle database-backed ID resolution or multi-tenant logic well.

### Solution B: Custom Stream Handler (Selected)
We will write a custom Axum handler that:
1.  Lookups the `AssetID` in SQLite to get the physical path.
2.  Checks permissions.
3.  Opens the file via `tokio::fs::File`.
4.  Returns a `Response` with `Body::from_stream` and `Content-Range` headers if requested.

## 4. Preliminary Questions
- **Pre-signed URLs:** Should we use short-lived pre-signed URLs (e.g., `/asset/:id?token=...`) to allow `<img>` tags to work without complex header management? (Recommendation: Yes, for ease of use in Mirror views).
- **MIME Sniffing:** Should we trust the `mime_type` in the database or sniff the file? (Recommendation: Trust the DB, as we already guessed it during ingestion).
