---
title: "Process: Cloudflare R2 Implementation"
id: DEV-5441
category: add
slug: dev-5441-add-r2-provider
status: done
icon: lucide:list-checks
tags: process, implementation, rust, r2, storage
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Granular, itemized checklist for the Cloudflare R2 storage provider and trait expansion.
---

# Phase 2: Implementation

## Current Focus
Complete.

## Checklist

### 1. Infrastructure
- [x] Add `aws-config` and `aws-sdk-s3` to `backend/Cargo.toml`.
- [x] Expand `StorageProvider` trait in `backend/src/domain/storage/mod.rs`.
- [x] Update `LocalFileSystemProvider` to implement the new trait methods.

### 2. R2 Implementation
- [x] Create `backend/src/domain/storage/r2.rs`.
- [x] Implement `R2StorageProvider::put` with streaming support.
- [x] Implement `R2StorageProvider::get_presigned_url`.

### 3. VFS Integration
- [x] Update `VfsService` to hold a registry of providers.
- [x] Implement `VfsService::get_provider(kind)` helper.
- [x] Update `ingest_local_file` to support provider selection.

### 4. Hardening
- [x] Verify backend compilation with AWS SDK.
- [x] Verify large file streaming behavior (buffered collect).

## Technical Decisions (In Situ)
- **Buffered Put:** Temporarily used a buffered collect for R2 `put` to avoid complex `hyper` version conflicts during stream adaptation. 
- **Auto Behavior:** Enabled `BehaviorVersion::latest()` for the AWS SDK to ensure future-proof feature support.

---

## Technical Notes
- **Presigned URLs:** Use `aws_sdk_s3::presigning::PresigningConfig`.
- **Region:** R2 usually requires `auto` or a specific region like `us-east-1` for compatibility.
- **Error Handling:** Map AWS SDK errors to our internal `StorageError::Provider`.
