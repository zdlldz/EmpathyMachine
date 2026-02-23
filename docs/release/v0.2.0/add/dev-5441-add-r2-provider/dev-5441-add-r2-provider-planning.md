---
title: "Planning: Hybrid Cloud Storage"
id: DEV-5441
category: add
slug: dev-5441-add-r2-provider
status: planning
icon: lucide:layout-template
tags: planning, architecture, r2, s3, storage
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Architectural blueprint for the S3-compatible R2 storage provider and hybrid VFS orchestration.
---

# Phase 1: Planning

## 1. Selected Strategy: Dynamic Provider Registry
We will update the `VfsService` to manage a registry of storage providers, allowing it to route `put` and `get` operations based on policy.

### Key Components:
1.  **R2 Provider:** Implements `StorageProvider` using `aws-sdk-s3`.
2.  **Trait Update:** Add `get_presigned_url` to `StorageProvider`.
3.  **Config Engine:** Logic to load R2 credentials from settings.

## 2. Technical Specifications

### A. StorageProvider Trait Expansion
```rust
#[async_trait]
pub trait StorageProvider: Send + Sync {
    async fn put(&self, tenant_id: Id, hash: &str, data: BoxStream<Bytes>) -> Result<String, Error>;
    async fn get(&self, location: &str) -> Result<BoxStream<Bytes>, Error>;
    async fn get_presigned_url(&self, location: &str, ttl_sec: u64) -> Result<String, Error>;
    fn kind(&self) -> &str;
}
```

### B. R2 Provider Implementation
- **Key Pattern:** `{tenant_id}/{hash}`
- **Large File Support:** Use `aws_sdk_s3::primitives::ByteStream::from_body_0_4` (or latest) to stream from the VFS.

### C. VFS Orchestration
Update `VfsService` to store a `HashMap<String, Arc<dyn StorageProvider>>`.
Ingestion will default to 'local' unless a cloud-first flag is passed.

## 3. The "Golden Rule" Filter
- [x] **Accessible:** Pre-signed URLs bypass backend bottleneck for direct client-to-cloud delivery.
- [x] **Durable:** R2's 99.9% durability ensures assets are safe if local drives fail.
- [x] **DRY:** Local and R2 share the same sharded hash-based naming convention.
- [x] **Performant:** Zero-egress fees on R2 mean we can serve high-res media without cost anxiety.
