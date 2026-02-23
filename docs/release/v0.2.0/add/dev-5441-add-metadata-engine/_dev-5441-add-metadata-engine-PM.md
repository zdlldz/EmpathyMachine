---
title: "PM: Metadata Extraction & Proxy Lineage"
id: DEV-5441
category: add
slug: dev-5441-add-metadata-engine
status: pr-pending
icon: lucide:database-zap
tags: pm, metadata, lineage, ffprobe
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Macro-orchestrator for the media intelligence layer, populating EAV metadata and tracking proxy/thumbnail lineage.
---

# Task Orchestrator (PM)

## Status Board
| Phase | File | Status |
| :--- | :--- | :--- |
| **0. Discovery** | `dev-5441-add-metadata-engine-discovery.md` | ✅ complete |
| **1. Planning** | `dev-5441-add-metadata-engine-planning.md` | ✅ complete |
| **2. Implementation** | `dev-5441-add-metadata-engine-process.md` | ✅ complete |
| **3. Knowledge** | `dev-5441-add-metadata-engine-knowledge.md" | ✅ complete |
| **4. QA** | `dev-5441-add-metadata-engine-qa.md" | ✅ complete |
| **5. PR** | `dev-5441-add-metadata-engine-pr.md" | 🏗️ in-progress |

## Task Goal
Extract technical metadata (resolution, duration, etc.) via `ffprobe` and register generated thumbnails/proxies as official 'permutations' in the VFS.

## Critical Milestones
- [x] FFprobe EAV Bridge implemented
- [x] Proxy Registration Logic (closing the loop) functional
- [x] Metadata GraphQL Query established
- [x] Lineage API (File -> Permutations) verified
- [x] PR Drafted
