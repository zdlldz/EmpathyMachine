# [DEV-5314] - Grid Performance & Component Standardization
Icon: tabler:layout-grid
Tags: frontend, components, performance, virtualization
Date: 2026-02-16
Summary: Refactor the content grid system to support massive datasets with high performance, leveraging CSS-first layouts and optimized Svelte 5 virtualization.

## Goal
- Eliminate "dragging" and "hanging" in grid views with large datasets.
- Standardize card components into a DRY hierarchy (Media vs Data).
- Implement high-efficiency virtualization using a "measured-once" row height model.

## Approach
1. **Logic Extraction:** Move heavy filtering/sorting/packing into non-blocking runes.
2. **Standardized Components:** Split the monolithic `ScrollableCard` into specialized variants.
3. **CSS-First Virtualization:** Leverage native CSS Grid for layout and JS only for data windowing.
4. **Resilient Measurement:** Measure a "sample" card to drive virtualization math instead of observing every row.

## Implementation Plan

### Phase 1: Logic Hardening (`useLibrary` Rune)
- [x] Implement debounced search query.
- [x] Implement async/deferred item "packing" into rows.
- [x] Optimize derivation chain for large-set performance.

### Phase 2: Specialized DRY Card Components
- [x] Create `GridCardBase.svelte` (primitive shell).
- [x] Create `GridCardMedia.svelte` (aspect-ratio & video focus).
- [x] Create `GridCardData.svelte` (list & metadata focus).

### Phase 3: High-Performance `ScrollableGrid`
- [x] Refactor to use real CSS Grid engine.
- [x] Implement single-pass height measurement on mount/resize.
- [x] Remove `ResizeObserver` from every row.

### Phase 4: Integration
- [x] Refactor `GridView.svelte` to use the new logic and components.
- [x] Standardize "Column Zero" list pattern.

## Status
- [x] Phase 1: Complete
- [x] Phase 2: Complete
- [x] Phase 3: Complete
- [x] Phase 4: Complete

## Files touched
- `frontend/src/core/library.svelte.ts`
- `frontend/src/lib/components/blocks/scrollable-grid.svelte`
- `frontend/src/lib/components/blocks/scrollable-card.svelte`
- `frontend/src/views/grid-view.svelte`
- (New files for card variants)

## Validation
- Verify "instant" search feedback on large datasets.
- Verify 60fps scrolling with 5,000+ items.
- Verify correct layout on window resize.
