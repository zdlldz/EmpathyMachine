---
title: "Planning: Metadata & Taxonomy Evolution"
id: DEV-5444
category: add
slug: dev-5444-add-metadata-collections
status: in-progress
icon: lucide:layout-template
tags: planning, architecture, metadata, taxonomy, ratings
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Refined architectural plan for unified taxonomies, star ratings, and collapsible metadata inspector.
---

# Phase 1: Planning (Refined)

## 1. Unified Taxonomy & Metadata Schema

### Taxonomies & Junctions
We will implement a unified many-to-many relationship for Tags and Collections to ensure the model is extendable for future taxonomies.
- **`taxonomies`**: `id`, `tenant_id`, `name`, `slug`, `kind` (`tag` | `collection`), `color`.
- **`node_taxonomies`**: `node_id`, `taxonomy_id`.
- **`system:rating`**: A specialized metadata key in the EAV `file_metadata` table to store 1-5 integer ratings.

## 2. Advanced UI Components (DRY)

### `TaxonomyInput` (Reusable Autocomplete)
- Based on the existing `Combobox` Bits UI primitive.
- Two variants: `TagInput` (pre-filtered for `kind: 'tag'`, shorthand `#`) and `CollectionInput` (pre-filtered for `kind: 'collection'`, shorthand `!`).
- Real-time backend filtering via `suggestTaxonomies` GraphQL query.

### `RatingStars` (Custom Taxonomy Proof)
- Uses `RatingGroup` primitive.
- Renders 5 whole stars.
- Interactive: Clicking updates the `system:rating` metadata for the selected item.

## 3. Media Library View Refactor (Collapsible)

### Layout Model
Refactor `MediaLibraryView.svelte` to a `SidebarLayout` with three main zones:
1. **Left Rail (Filters & Tree):**
   - Collapsible `FiltersPanel`.
   - Collapsible `FileTree`.
2. **Center Rail (Grid):**
   - The primary `ScrollableGrid`.
3. **Right Rail (Inspector):**
   - Collapsible `PropertyInspector`.
   - Shows full metadata, tags, collections, and ratings.

### Collapse/Expand Logic
- Rails are togglable via buttons in the header or keyboard shortcuts.
- State is persistent (persists to `SettingsState` or local state).

## 4. Selection Logic
- **Single Selection:** Shows full metadata and editable fields in the Inspector.
- **Multi-Selection:** Shows common tags/collections and allows for batch assignment.

## 5. Technical Decision Matrix
- **Shorthand:** `#` for tags, `!` for collections.
- **Storage:** Metadata is kept in the EAV table; Taxonomies are kept in indexed relational tables for grid performance.
- **Grid Filter:** `files` query extended with `taxonomyIds: [ID!]` input.

## 6. The "Golden Rule" Filter
- [x] **Accessible:** `RatingGroup` and `Combobox` are fully accessible Bits UI primitives.
- [x] **Durable:** Transactional integrity for junction table updates.
- [x] **DRY:** Unified taxonomy service handles both tags and collections.
- [x] **Minimal:** Leverage existing `filters-panel` and `view-shell` structures.
- [x] **Performant:** Indexed joins for taxonomy-based filtering.
