---
title: "PR: Metadata & Lineage Engine"
id: DEV-5441
category: add
slug: dev-5441-add-metadata-engine
status: pr-pending
icon: lucide:git-pull-request
tags: pr, documentation, comms
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Pull Request metadata for the EAV metadata engine and proxy registration logic.
---

# Phase 5: Pull Request Prep

## 1. Summary
Implemented an intelligent Metadata Engine that extracts technical properties (Resolution, Duration, Codec) via FFprobe and persists them in an EAV store. Also closed the "Lineage Loop" by registering generated thumbnails as official VFS permutations.

## 2. Commit History (Draft)
```text
add: Metadata Engine and Lineage registration (DEV-5441)
- Added `upsert_file_metadata` to VfsService
- Added `register_derivative_blob` to VfsService
- Updated `DerivativeWorker` to probe assets and register proxies
- Exposed `metadata` field on `FileNode` GraphQL type
```

## 3. QA & Verification (Handoff)

### Evidence of Proof
- **Detailed QA Report:** `dev-5441-add-metadata-engine-qa.md`
- **Build Status:** `cargo check` passing.

### Reproduction Steps
1.  Ingest a video.
2.  Wait for the worker to finish.
3.  Query GraphQL: `{ files { metadata { key value } } }`
4.  Verify `media.resolution` and `media.duration` are present.

## 4. QA Checklist
- [x] **Functionality:** Metadata is correctly extracted and saved.
- [x] **Lineage:** Thumbnails appear as `proxy` permutations in the DB.
- [x] **API:** GraphQL correctly returns the EAV map.
