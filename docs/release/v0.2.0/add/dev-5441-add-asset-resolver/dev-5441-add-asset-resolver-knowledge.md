---
title: "Knowledge: Axum Streaming"
id: DEV-5441
category: add
slug: dev-5441-add-asset-resolver
status: done
icon: lucide:brain-circuit
tags: knowledge, axum, rust, streaming
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Key learnings from implementing the streaming asset resolver.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **ReaderStream:** `tokio_util::io::ReaderStream` is the most efficient way to convert a `tokio::fs::File` into an Axum `Body` without loading the file into RAM.
- **Range Math:** Inclusive ranges (start-end) require careful +1 logic for `Content-Length`.

## 2. Gotchas
- **Browser Caching:** `immutable` headers are powerful but require unique URLs. We rely on the `AssetID` being stable. If the content changes, the ID should theoretically change (or we bump version).
- **Token Passing:** `<img>` tags can't send headers easily. We supported `?token=` query params for this specific use case.
