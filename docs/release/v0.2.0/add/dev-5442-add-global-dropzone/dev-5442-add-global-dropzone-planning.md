---
title: "Planning: Global Drag & Drop Ingestion"
id: DEV-5442
category: add
slug: dev-5442-add-global-dropzone
status: planning
icon: lucide:layout-template
tags: planning, architecture
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Architectural planning, solution comparison, and final implementation strategy.
---

# Phase 1: Planning

## 1. Solution Comparison

### Solution A: Component-Specific Dropzones
- **Pros:** Precise control over what gets dropped where.
- **Cons:** High friction for users; requires "finding" the target.

### Solution B: Global Overlay (Selected)
- **Pros:** Maximum ease of use. Matches industry standards (Linear, Slack, Discord).
- **Cons:** Complex event orchestration to prevent flickering and interference with other UI.

## 2. Selected Strategy
Implement a `GlobalDropzone.svelte` component that mounts once in the `MediaLibraryView`. It listens to window-level events and displays a high-z-index overlay using Svelte 5 transitions.

## 3. High-Level Architecture
- **Data Flow:** `window` (events) -> `GlobalDropzone` (state) -> `graphqlRequest` (mutation) -> `filesQuery` (refetch).
- **Key Symbols:** `dragCounter` (Rune-backed state), `handleDrop` (Async orchestrator).
- **Standards:** Svelte 5 Runes for state management. `ViewShell` integration.

## 4. The "Golden Rule" Filter
- [x] Is it Accessible? Overlay is declarative and has appropriate headings.
- [x] Is it Durable? Handles drag-and-drop cancellation and empty drops.
- [x] Is it DRY? Centralizes ingestion logic for drag-and-drop.
- [x] Is it Minimal? No external dependencies beyond Lucide icons and Svelte transitions.
- [x] Is it Performant? Passive listeners; 0% CPU when idle.
- [x] Is it Testable? Can be verified via Playwright by simulating drag events.
