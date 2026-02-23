---
title: "Knowledge: Global Drag & Drop Ingestion"
id: DEV-5442
category: add
slug: dev-5442-add-global-dropzone
status: in-progress
icon: lucide:brain-circuit
tags: knowledge, gotchas, learnings
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Specific knowledge, "gotchas," and new patterns discovered during implementation.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **The `dragCounter` Pattern:** When creating a full-page overlay, a simple boolean `isDragging` is insufficient because entering a child element (like an icon or text label) triggers a `dragleave` on the parent, causing flickering. Incrementing a counter on `dragenter` and decrementing on `dragleave` (showing when > 0) is the most robust solution.

## 2. Gotchas & Pitfalls
- **Tauri `.path` Property:** Standard browser `File` objects do not have a `.path` property for security reasons. However, when running inside a Tauri application, the drag-and-drop event includes the absolute file path on the `File` object itself. This must be accessed via a cast (e.g., `(file as any).path`) to avoid TypeScript errors while still providing the path to the `ingestLocalFile` mutation.

## 3. Core Library Impact
- [x] Should `docs/knowledge/` be updated? Yes, added `i18n-scaling.md`.
- [x] Should `agents.md` rules be refined? Yes, finalized the DocsMachine v2 standards.
