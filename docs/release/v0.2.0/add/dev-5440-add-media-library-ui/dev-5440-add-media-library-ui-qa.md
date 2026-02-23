---
title: "QA: Media Library & FFmpeg"
id: DEV-5440
category: add
slug: dev-5440-add-media-library-ui
status: done
icon: lucide:shield-check
tags: qa, testing, evidence
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Proof of verification for the Media Library UI and transformation engine.
---

# Phase 4: QA & Evidence

## 1. Quality Gates
- [x] `cargo check` (Clean, no unused imports in final pass)
- [x] `pnpm check` (Clean, Svelte 5 runes verified)
- [x] `pnpm i18n:check` (Clean, 5 locales synchronized)

## 2. Ingestion Verification
Run the following mutation to verify recursive ingestion depth:

```graphql
mutation {
  ingestFolder(
    path: "/Users/demo/Pictures",
    isManaged: true,
    maxDepth: 1
  ) {
    count
    errors { message }
  }
}
```

## 3. Thumbnail Verification
Check the logs for `DerivativeWorker` success:
```text
INFO starter::jobs::derivative_worker: Processing derivative generation for blob: ...
INFO starter::domain::storage::ffmpeg: Generated thumbnail: .../storage/.../hash_thumb_160.webp
```

## 4. UI Stress Test
- **Virtualization:** `ScrollableGrid` should handle 10,000+ items without DOM bloat.
- **Resize:** Grid columns should adapt responsively (verified via `grid-cols-4` class).
