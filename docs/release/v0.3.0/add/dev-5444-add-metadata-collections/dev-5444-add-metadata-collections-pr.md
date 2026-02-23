---
title: "PR: Metadata & Taxonomy Evolution"
id: DEV-5444
category: add
slug: dev-5444-add-metadata-collections
status: pr-pending
icon: lucide:git-pull-request
tags: pr, documentation, comms, taxonomy, ratings
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Pull Request for unified virtual collections, tags, and 5-star ratings with a collapsible three-column UI.
---

# Phase 5: Pull Request Prep

## 1. Summary
Introduced a comprehensive Metadata and Taxonomy system. This release enables Virtual Collections (`!`), Tags (`#`), and a 5-star Rating system. The Media Library UI has been refactored into a professional three-column layout with collapsible rails for Filters, File Tree, and Item Details, significantly enhancing asset management capabilities.

## 2. Commit History (Draft)
```text
add: Unified Taxonomy schema (tags/collections) and VFS junction (DEV-5444)
add: Ingestion support for system:rating metadata (DEV-5444)
add: RatingStars component with Bits UI RatingGroup (DEV-5444)
add: TaxonomyInput autocomplete with shorthand triggers (#, !) (DEV-5444)
ui: Three-column Media Library with collapsible rails (DEV-5444)
ui: PropertyInspector for granular metadata management (DEV-5444)
```

## 3. QA & Verification (Handoff)

### Evidence of Proof
- **Detailed QA Report:** `dev-5444-add-metadata-collections-qa.md`
- **Quality Gates:** `pnpm check` and `i18n:check` passing. Backend compilation verified.

### Reproduction Steps
1. Navigate to Media Library.
2. Toggle the Left Sidebar (Tree/Filter icons) and Right Sidebar (Inspector icon).
3. Select an item; observe the metadata and rating stars in the Inspector.
4. Add a tag using the `#` autocomplete or a collection using `!`.
5. Filter the grid by clicking a taxonomy in the Filter Panel.

### Risk Map (Blast Radius)
- **Primary:** `MediaLibraryView.svelte`, `VfsService`, GraphQL `files` query.
- **Secondary:** All views using the `files` query (extended signature).

## 4. QA Checklist
- [x] **Functionality:** Taxonomies and ratings persist correctly in SQLite.
- [x] **Edge Cases:** Multiple selection handled by the Inspector.
- [x] **UI/UX:** Rails are collapsible and non-obtrusive by default.
- [x] **A11y:** Accessible components (Bits UI) used throughout.
- [x] **Persistence:** Taxonomy relationships survive application restart.
