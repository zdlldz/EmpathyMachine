---
title: "Process: Metadata & Taxonomy Evolution"
id: DEV-5444
category: add
slug: dev-5444-add-metadata-collections
status: in-progress
icon: lucide:list-checks
tags: process, implementation, metadata, taxonomy
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Checklist and technical process for metadata, virtual collections, and ratings.
---

# Phase 2: Implementation

## Current Focus
Backend schema and taxonomy service initialization.

## Checklist

### 1. Backend: Data Layer
- [ ] Create migration `0005_taxonomy_ratings.sql` (`taxonomies`, `node_taxonomies`).
- [ ] Implement `TaxonomyService` in Rust.
- [ ] Extend `FilesQuery` with `taxonomyIds` filtering.
- [ ] Add `FilesMutation` for `addTaxonomyToNode`, `removeTaxonomyFromNode`, and `setNodeRating`.

### 2. Frontend: Components
- [ ] Create `frontend/src/lib/components/blocks/rating-stars.svelte` (5-star, whole only).
- [ ] Create `frontend/src/lib/components/blocks/taxonomy-input.svelte` (Autocomplete based on Combobox).
- [ ] Create `frontend/src/lib/components/blocks/property-inspector.svelte`.

### 3. Frontend: Layout & View
- [ ] Refactor `MediaLibraryView.svelte` to use `SidebarLayout`.
- [ ] Implement collapsible state for Left (Filters/Tree) and Right (Inspector) rails.
- [ ] Wire up single/multi-selection to the Inspector.

### 4. Integration
- [ ] Implement `#` and `!` shorthand detection in taxonomy inputs.
- [ ] Verify real-time metadata updates when rating or tagging.
- [ ] Add grid filtering based on sidebar taxonomy selection.

## Technical Decisions (In Situ)
- **Rating Storage:** Storing ratings as `system:rating` in `file_metadata` to maintain metadata flexibility.
- **Unified Taxonomy:** Using a single `Taxonomy` GraphQL type with a `kind` discriminator.

## Boundary Cases
- [ ] **Empty Selection:** Hide inspector or show "No item selected" state.
- [ ] **Taxonomy Name Collision:** Ensure slugification handles duplicates gracefully.
- [ ] **Large Taxonomy List:** Verify `suggestTaxonomies` performance with 1000+ tags.
