---
title: "Planning: File Service API (Hardened)"
id: DEV-5422
category: add
slug: dev-5422-add-file-service-api
status: planning
icon: lucide:layout-template
tags: planning, architecture, vfs, storage
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Hardened architectural planning for the Virtual File System, incorporating multi-tenancy, optimistic concurrency, and job-system integration.
---

# Phase 1: Planning

## 1. Selected Strategy: Managed VFS
We will implement a database-backed Virtual File System (VFS). The frontend interacts exclusively with opaque `AssetID`s, while the backend manages the mapping to physical bytes across hybrid providers.

## 2. High-Level Architecture

### Data Flow & Orchestration
1.  **Ingest:** `FileService` receives data -> Hashes (SHA-256) -> Validates Tenant Scope.
2.  **Storage:** `StorageManager` chooses provider -> Writes bytes -> Updates `AssetBlob` (Deduplicated).
3.  **Metadata:** `FileNode` created with `version: 1`.
4.  **Derivatives:** `FileService` enqueues jobs via the existing **Concurrent JobRunner** (`backend/src/jobs/`).
5.  **Serve:** Rust signs a temporary URI for the frontend.

## 3. Hardened SQLite Schema

```sql
-- Logical Tree (Folders/Files)
CREATE TABLE file_nodes (
    id BLOB PRIMARY KEY,
    tenant_id BLOB NOT NULL, -- Strict Isolation
    parent_id BLOB,
    kind TEXT NOT NULL, -- 'file', 'folder', 'collection'
    name TEXT NOT NULL,
    version INTEGER NOT NULL DEFAULT 1, -- Optimistic Concurrency
    archived_at TEXT, -- Soft Deletes
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
);

-- Physical Content (Content-Addressable)
CREATE TABLE asset_blobs (
    id BLOB PRIMARY KEY,
    tenant_id BLOB NOT NULL,
    hash TEXT NOT NULL UNIQUE, -- e.g. 'sha256:...'
    provider_kind TEXT NOT NULL, -- 'local', 's3', 'cf_stream'
    provider_location TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(tenant_id) REFERENCES tenants(id)
);

-- Lineage (Mapping Node to Blobs)
CREATE TABLE permutations (
    id BLOB PRIMARY KEY,
    tenant_id BLOB NOT NULL,
    node_id BLOB NOT NULL,
    blob_id BLOB NOT NULL,
    intent TEXT NOT NULL, -- 'original', 'proxy', 'edit'
    created_at TEXT NOT NULL,
    FOREIGN KEY(node_id) REFERENCES file_nodes(id),
    FOREIGN KEY(blob_id) REFERENCES asset_blobs(id)
);

-- EAV Store for Infinite Metadata
CREATE TABLE file_metadata (
    node_id BLOB NOT NULL,
    tenant_id BLOB NOT NULL,
    key TEXT NOT NULL,
    value_text TEXT,
    value_num REAL,
    value_json TEXT,
    PRIMARY KEY(node_id, key),
    FOREIGN KEY(node_id) REFERENCES file_nodes(id)
);
```

## 4. Key Logic Interfaces (Rust)

### `StorageProvider` Trait
The interface for physical byte management.
```rust
#[async_trait]
pub trait StorageProvider: Send + Sync {
    async fn put(&self, tenant_id: Id, data: BoxStream<Bytes>) -> Result<String, Error>;
    async fn get(&self, location: &str) -> Result<BoxStream<Bytes>, Error>;
    async fn delete(&self, location: &str) -> Result<(), Error>;
}
```

### `FileHandler` Plugin
The interface for type-specific logic (Thumbnails, Metadata extraction).
```rust
pub trait FileHandler: Send + Sync {
    fn can_handle(&self, mime_type: &str) -> bool;
    async fn generate_derivatives(&self, source: &AssetBlob) -> Result<Vec<Derivative>, Error>;
    async fn extract_metadata(&self, source: &AssetBlob) -> Result<MetadataMap, Error>;
}
```

## 5. Validation & Quality Gates
- **Isolation Test:** Verify that Tenant A cannot resolve an AssetID belonging to Tenant B.
- **Concurrency Test:** Verify that two simultaneous updates to a `FileNode` result in a `Conflict` error for the second caller.
- **Atomic Ingestion:** Use SQL transactions to ensure `FileNode` and `AssetBlob` are never out of sync.
