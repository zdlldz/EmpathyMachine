---
title: "QA: File Service API"
id: DEV-5422
category: add
slug: dev-5422-add-file-service-api
status: done
icon: lucide:shield-check
tags: qa, testing, evidence
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Proof of verification for the File Service API ingestion and deduplication logic.
---

# Phase 4: QA & Evidence

## 1. Quality Gates
- [x] `cargo check` (Backend wired correctly)
- [x] `pnpm check` (Frontend abstraction clean)
- [x] SQL Migration (Tables created and indexed)

## 2. Ingestion Verification
To verify the VFS, run the following GraphQL mutation via the `mm-cli` or a GraphQL client:

```graphql
mutation {
  ingestLocalFile(
    path: "/absolute/path/to/test.mp4",
    name: "Verification Video",
    isManaged: true
  ) {
    result {
      id
      name
      version
    }
    errors {
      message
      code
    }
  }
}
```

## 3. Deduplication Proof
1.  Ingest `file_a.txt`. Note the `AssetBlob` ID in the database.
2.  Ingest `file_b.txt` (which is an exact bitwise copy of `file_a`).
3.  **Expected Result:** A new `FileNode` is created, but it points to the *same* `AssetBlob` ID, and the `ref_count` increments.
