---
title: "Discovery: Global Drag & Drop Ingestion"
id: DEV-5442
category: add
slug: dev-5442-add-global-dropzone
status: in-progress
icon: lucide:search
tags: discovery, research
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Initial research, historical context, and tech stack fingerprinting for the task.
---

# Phase 0: Discovery

## 1. Context Gathering
- **Release History:** Previously, ingestion was limited to a manual "Import Folder" dialog in `MediaLibraryView.svelte`.
- **Fingerprint:** Svelte 5 (Runes), Tauri 2.0 (IPC), Bits UI (Primitives).
- **Archived Docs:** `docs/_archive/dev-5422-file-service-api.md` (Basis for `ingestLocalFile` mutation).

## 2. Intent vs. Reality
- **Claimed Intent:** Users want a modern drag-and-drop experience similar to web-based DAMs (Digital Asset Managers) or Slack.
- **Current State:** Only manual path entry or folder pickers exist. No visual feedback for drag events over the window.

## 3. Findings & Risks
- **Window vs. Dropzone:** Listening to the window ensures the user doesn't have to hit a specific 200x200px target.
- **Flicker Risk:** Standard `dragleave` events fire when entering child elements (icons, text), causing the overlay to flicker.
- **Tauri Pathing:** Standard `File` objects in the browser don't provide the absolute path required by the backend `ingestLocalFile`. Tauri's internal drag-and-drop system provides this via the `.path` property.
