---
title: "QA: Metadata Engine"
id: DEV-5441
category: add
slug: dev-5441-add-metadata-engine
status: done
icon: lucide:shield-check
tags: qa, testing, evidence
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Evidence of verification for the metadata extraction and lineage logic.
---

# Phase 4: QA & Evidence

## 1. Quality Gates
- [x] `cargo check`

## 2. Metadata Verification
**Query:**
```graphql
query {
  files {
    name
    metadata {
      key
      value
    }
  }
}
```

**Expected Result:**
```json
{
  "key": "media.resolution",
  "value": "1920x1080"
}
```

## 3. Lineage Verification
**SQL Check:**
```sql
SELECT * FROM permutations WHERE intent = 'proxy';
```
**Expected:** Should return rows linking the original Node ID to the new WebP Blob ID.
