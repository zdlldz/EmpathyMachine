---
title: "Discovery: Cloudflare R2 Storage"
id: DEV-5441
category: add
slug: dev-5441-add-r2-provider
status: in-progress
icon: lucide:search
tags: discovery, r2, s3, storage, cloud
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Technical discovery for implementing an S3-compatible storage provider for Cloudflare R2.
---

# Phase 0: Discovery

## 1. The Vision: Hybrid Cloud VFS
The VFS should be able to store assets either locally or in the cloud. Cloudflare R2 provides an S3-compatible API with zero egress fees, making it perfect for high-bandwidth media applications.

## 2. Technical Pillars

### A. AWS SDK for Rust
We will use the official `aws-sdk-s3` crate.
- **Compatibility:** R2 is almost 100% S3 compatible.
- **Authentication:** Requires `Access Key ID` and `Secret Access Key`.
- **Endpoint:** Must point to the custom R2 worker/account endpoint.

### B. Streaming Uploads
For large video files, we cannot load the whole file into memory.
- **Goal:** Use `Body::wrap_stream` to pipe the VFS input stream directly to R2.
- **Multipart:** For files > 5GB (or optimized at > 100MB), use multipart upload.

### C. Pre-signed URLs
To allow the frontend to access cloud assets without proxying through our backend:
- **Task:** Implement `StorageProvider::get_signed_url`.
- **TTL:** URLs should be valid for a short duration (e.g. 15 mins).

## 3. Configuration Requirements
We need new application settings or environment variables:
- `STORAGE_R2_BUCKET`
- `STORAGE_R2_ACCESS_KEY_ID`
- `STORAGE_R2_SECRET_ACCESS_KEY`
- `STORAGE_R2_ENDPOINT`

## 4. Preliminary Questions
- **Automatic Migration:** Should the app automatically "promote" local files to R2 if they become popular or if the user requests "Cloud Sync"?
    - *Decision:* Out of scope for this task. Focus on providing the *capability* first.
- **Provider Choice:** How does the system decide which provider to use for `put()`?
    - *Plan:* Add a `default_provider` setting to `VfsService`.
