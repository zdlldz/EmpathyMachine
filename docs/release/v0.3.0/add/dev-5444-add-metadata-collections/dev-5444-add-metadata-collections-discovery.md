---
title: "Discovery: Metadata & Taxonomy Evolution"
id: DEV-5444
category: add
slug: dev-5444-add-metadata-collections
status: complete
icon: lucide:search
tags: discovery, research, metadata, taxonomy
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Research into the current VFS metadata structure and the plan for unified collections/tags.
---

# Phase 0: Discovery

## 1. Context Gathering
- **Current Schema:** `file_metadata` table exists as an EAV (Entity-Attribute-Value) store with `value_text`, `value_num`, and `value_json`.
- **Collection Nodes:** `file_nodes` already has a `kind` check for `collection`, but no logic exists to link files to collections yet.
- **Metadata Flow:** `VfsService::get_metadata` is implemented but only returns a `Vec<(String, Option<String>)>`.

## 2. Intent vs. Reality
- **Intent:** A many-to-many relationship where files belong to multiple collections and tags.
- **Reality:** Only hierarchical folders exist. Collections are defined in the enum but unused.

## 3. Findings & Risks
- **[ARCHITECTURE]** Collections and Tags should be unified in a `taxonomies` table to stay DRY, but they need a `type` discriminator.
- **[UX]** We need a shorthand syntax for fast entry:
  - **Tags:** `#` (e.g., `#nature`, `#work`)
  - **Collections:** `!` (e.g., `!ProjectX`, `!Archive`)
- **[PERFORMANCE]** Querying the grid by complex many-to-many joins can be slow if not indexed correctly.

## 4. Technical Hurdles
- **Autocomplete:** Needs a new GraphQL query `suggestTaxonomies(prefix: String, type: String)` for real-time results.
- **Grid Filter:** The `files` query needs to support filtering by taxonomy IDs.
- **UI Integration:** Updating `GridCardMedia` to display these tags without clutter.
