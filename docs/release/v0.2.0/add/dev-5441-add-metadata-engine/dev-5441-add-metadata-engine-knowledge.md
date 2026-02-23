---
title: "Knowledge: Metadata & Lineage"
id: DEV-5441
category: add
slug: dev-5441-add-metadata-engine
status: done
icon: lucide:brain-circuit
tags: knowledge, metadata, lineage, database
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Key learnings from implementing the EAV metadata store.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **EAV Flexibility:** The Entity-Attribute-Value model allows us to store arbitrary FFprobe keys without schema migrations. This is crucial as we add more exotic metadata (e.g., color space, HDR format).
- **Lineage Closing:** Registering the thumbnail as a "Permutation" with `intent='proxy'` effectively "closes the loop" initiated by the ingestion.

## 2. Gotchas
- **JSON Types:** FFprobe returns typed JSON (numbers, strings). We convert everything to strings for the simple `value_text` column. If we need range queries on duration later, we should populate `value_num`.
