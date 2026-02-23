---
title: "PM: Media Processor Plugins & First-Class Utilities"
id: DEV-5447
category: improve
slug: dev-5447-media-processor-plugins
status: done
icon: lucide:cpu
tags: pm, architecture, plugins, vfs, ffmpeg, metadata
author: agent-codex
version: v0.3.0
date: 2026-02-18
description: Orchestrator for pluggable file processing and first-class thumbnail utility.
---

# Task Orchestrator (PM)

## Status Board
| Phase | File | Status |
| :--- | :--- | :--- |
| **0. Discovery** | `dev-5447-media-processor-plugins-discovery.md` | ✅ done |
| **1. Planning** | `dev-5447-media-processor-plugins-planning.md` | ✅ done |
| **2. Implementation** | `dev-5447-media-processor-plugins-process.md` | ✅ done |
| **3. Knowledge** | `dev-5447-media-processor-plugins-knowledge.md` | ✅ done |
| **4. QA** | `dev-5447-media-processor-plugins-qa.md" | ✅ done |
| **5. PR** | `dev-5447-media-processor-plugins-pr.md` | ✅ done |
| **6. Post-Mortem** | `dev-5447-media-processor-plugins-post-mortem.md` | ✅ done |
| **7. To-Do Next** | `dev-5447-media-processor-plugins-todo-next.md` | ✅ done |
| **8. User Docs** | `dev-5447-media-processor-plugins-user.md` | ✅ done |

## Task Goal
Transition from a hardcoded media processing pipeline to a scalable, trait-based plugin architecture. Deliver a first-class utility for thumbnail regeneration with robust job batching and guardrails.

## Critical Milestones
- [x] **Trait Definition:** Defined the `MediaProcessor` Rust trait for agnostic file handling.
- [x] **Regeneration Utility:** Implemented the `rebuildThumbnails` job and GraphQL mutation.
- [x] **Plugin Registry:** Implemented a prioritized discovery mechanism for processors.
- [x] **UI Integration:** Added "Rebuild Thumbnails" to settings with real-time feedback.
- [x] **State-First Verification:** Confirmed metadata presence via CLI after batch rebuild.

## Audit Conclusion
The processor service is now fully pluggable and verified. Standalone mode in the CLI allows for robust backend-only QA.
