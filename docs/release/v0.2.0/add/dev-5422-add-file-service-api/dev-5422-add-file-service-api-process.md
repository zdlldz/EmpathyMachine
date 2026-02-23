---
title: "Process: File Service API Implementation"
id: DEV-5422
category: add
slug: dev-5422-add-file-service-api
status: done
icon: lucide:list-checks
tags: process, implementation, rust, sqlx
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Granular, itemized checklist tracking the implementation of the Virtual File System and storage providers.
---

# Phase 2: Implementation

## Current Focus
Complete.

## Checklist

### 1. Database & Schema
- [x] Create `backend/migrations/0004_vfs_core.sql`.
- [x] Define `file_nodes`, `asset_blobs`, `permutations`, and `file_metadata`.
- [x] Verify migration runs cleanly.(`pnpm dev`).

### 2. Domain Layer (Rust)
- [x] Define `StorageProvider` trait.in `backend/src/domain/storage/mod.rs`.
- [x] Define `FileHandler` trait.for plugin-based previews.
- [x] Implement `LocalFileSystemProvider`.(Managed + Symlink support).
- [x] Implement Hashing engine.(SHA-256) with deduplication logic.

### 3. API Layer (GraphQL)
- [x] Create `backend/src/api/schema/files.rs` module.
- [x] Register `FilesQuery` and `FilesMutation` in the root schema.
- [x] Implement `registerLocalFile` and `resolveAssetUrl` handlers (implemented as `ingestLocalFile` and `files` list).

### 4. Background Workers
- [x] Create `DerivativeWorker`.to handle thumbnail/proxy generation.
- [x] Register worker in `backend/src/jobs/mod.rs`.

### 5. Frontend Integration
- [x] Create `frontend/src/core/platform.svelte.ts`.
- [x] Implement `useFileSystem` abstraction for Tauri vs. Web.

## Technical Decisions (In Situ)
- **Hash sharding:** Implemented 2-char directory sharding in `local.rs` to prevent FS performance degradation with many blobs.
- **Unified Interface:** Standardized on `BoxStream<Bytes>` for all storage operations to support large files without memory exhaustion.

---

## Technical Notes
- **Hashing:** Use the `sha2` crate for content-addressable storage.
- **Symlinks:** Use `std::os::unix::fs::symlink` or `std::os::windows::fs::symlink_file`.
- **GraphQL:** Use `async_graphql::ID` mapped to our `Id` struct.
- **Verification:** `pnpm check` and `cargo check` verified clean.
