---
title: "Process: Global Dropzone Implementation"
id: DEV-5442
category: add
slug: dev-5442-add-global-dropzone
status: done
icon: lucide:list-checks
tags: process, implementation, svelte5, ux
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Granular checklist for the full-view drag-and-drop ingestion overlay.
---

# Phase 2: Implementation

## Current Focus
Complete.

## Checklist

### 1. Overlay UI
- [x] Create `frontend/src/lib/components/blocks/global-dropzone.svelte`.
- [x] Implement full-screen blurred backdrop with `fixed inset-0`.
- [x] Use `fade` transition for smooth entry/exit.

### 2. Event Orchestration
- [x] Implement `dragCounter` to prevent flickering on child elements.
- [x] Attach listeners to `window` object on mount.
- [x] Clean up listeners on destroy.

### 3. Ingestion Bridge
- [x] Extract file paths from `DragEvent` (Tauri-specific handling).
- [x] Map dropped files to `ingestLocalFile` GraphQL mutation.
- [x] Implement batch progress logging and success callback.

### 4. Integration
- [x] Mount `GlobalDropzone` in `MediaLibraryView.svelte`.
- [x] Bind `onComplete` to `filesQuery.refetch()`.

## Technical Decisions (In Situ)
- **Counter Strategy:** Used a integer counter for drag events instead of a boolean to handle nested DOM elements reliably.
- **Pointer Events:** Set `pointer-events-none` on the overlay itself so it doesn't interfere with the drop event capture.
