---
title: "Knowledge: Media Library Engineering"
id: DEV-5440
category: add
slug: dev-5440-add-media-library-ui
status: done
icon: lucide:brain-circuit
tags: knowledge, ffmpeg, sidecar, performance
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Technical insights on FFmpeg sidecars, recursive ingestion, and the "Multiple of 4" strategy.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **Sidecar Suffixes:** Tauri v2 requires strict platform suffixes (e.g., `ffmpeg-aarch64-apple-darwin`) even for `bundle.externalBin`. We solved build errors by creating placeholders.
- **MIME Guessing:** The `mime_guess` crate is essential for distinguishing "Files" from "Media" before invoking expensive FFmpeg operations.

## 2. Gotchas & Pitfalls
- **Type Safety in Views:** `graphqlRequest` returns a typed response, but mapping it to UI components (like `GridCardMedia`) requires careful casting or DTOs to avoid `unknown` type errors in strict mode.
- **i18n Scaling:** Monolithic `messages.json` files break easily. We successfully migrated to a namespaced folder structure (`locales/en/media.json`) and refactored the check script.

## 3. Core Library Impact
- [x] `frontend/scripts/check-i18n.mjs` is now namespace-aware.
- [x] `api-client.ts` now supports generic return types for cleaner call sites.
