---
title: "Process: Metadata & Lineage Implementation"
id: DEV-5441
category: add
slug: dev-5441-add-metadata-engine
status: done
icon: lucide:list-checks
tags: process, implementation, rust, metadata, lineage
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Granular, itemized checklist for the metadata extraction engine and proxy registration logic.
---

# Phase 2: Implementation

## Current Focus
Complete.

## Checklist

### 1. VFS Enhancements
- [x] Add `register_derivative_blob` to `backend/src/domain/storage/vfs.rs`.
- [x] Add `upsert_file_metadata` to handle EAV population.

### 2. Intelligent Worker
- [x] Implement `ffprobe` mapping in `handle_derivative_job`.
- [x] Close the loop: Register generated thumbnails as `proxy` permutations.
- [x] Extract and save technical metadata (Resolution, Duration).

### 3. GraphQL Layer
- [x] Implement `metadata` field resolver for `FileNode`.
- [x] Register `FileMetadata` type in `backend/src/api/schema/files.rs`.

### 4. Hardening
- [x] Add tracing for metadata extraction milestones.
- [x] Verify transactional integrity of proxy registration.

## Technical Decisions (In Situ)
- **EAV Strategy:** Stored technical metadata under the `media.*` namespace (e.g. `media.resolution`) to allow for future AI-tagging extensions.
- **Lineage Integrity:** Enforced bitwise hashing for all derivatives to prevent duplicate proxy storage.

---

## Technical Notes
- **EAV Storage:** For simplicity, store everything as `String` in the EAV `value_text` column for now, unless range searching is needed.
- **Lineage:** Every `proxy` permutation must be tied to the `original` node ID.
- **MIME:** Default generated thumbnails to `image/webp`.
