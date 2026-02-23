# [DEV-5422] - Frontend Hardening & Orchestration
Icon: tabler:shield-check
Tags: frontend, orchestration, performance, scaling
Date: 2026-02-16
Summary: Final comprehensive hardening of the frontend architecture focusing on centralized window management, lightweight data caching, i18n optimization, and form validation.

## Goal
- Centralize Tauri window management to remove boilerplate from `App.svelte`.
- Implement a lightweight, rune-based data fetching and caching layer.
- Transition i18n to a namespaced loading model for better scaling.
- Standardize form validation logic using a consistent internal pattern.
- Implement media asset pre-fetching for the library grid.

## Approach
1. **Window Orchestration:** Create a `useWindowManager` rune and registry to handle Settings, Utility, and custom windows.
2. **Data Caching:** Build a `useQuery` rune that manages GraphQL loading states, errors, and background refreshes.
3. **i18n Scaling:** Split the monolithic `messages.json` into namespaces (e.g., `core`, `settings`, `prompts`).
4. **Validation:** Implement a lightweight schema validator for forms to remove manual checks from views.
5. **Asset Optimization:** Add approach-based pre-fetching to the `useLibrary` rune.

## Implementation Plan

### Phase 1: Window Management
- [x] Create `frontend/src/core/windows.svelte.ts` service.
- [x] Centralize window configs (width, height, transparency).
- [x] Refactor `App.svelte` to use the new window service.

### Phase 2: i18n Namespacing
- [x] Split `messages.json` into directory-based structure.
- [x] Update `i18n.svelte.ts` to support dynamic namespace loading.
- [x] Update build/check scripts to account for multiple files.

### Phase 3: Query & Cache Layer
- [x] Implement `core/query.svelte.ts`.
- [x] Refactor `ConnectionsView` and `PromptsPanel` to use `useQuery`.

### Phase 4: Standardized Validation
- [x] Implement a lightweight internal validator (Zod-like API).
- [x] Standardize error states in `FormInput` and other form components.

### Phase 5: Media Pre-fetching
- [x] Enhance `useLibrary` with a priority pre-fetch queue for images/metadata.

## Status
- [x] Phase 1: Complete
- [x] Phase 2: Complete
- [x] Phase 3: Complete
- [x] Phase 4: Complete
- [x] Phase 5: Complete

## Files touched
- `frontend/src/App.svelte`
- `frontend/src/core/windows.svelte.ts`
- `frontend/src/core/i18n.svelte.ts`
- `frontend/src/core/query.svelte.ts`
- `frontend/src/core/validation.ts`
- `frontend/src/core/library.svelte.ts`
- `frontend/src/views/connections-view.svelte`
- `frontend/scripts/split-i18n.js`

## Validation
- [x] Verify all auxiliary windows open with correct dimensions and focus logic.
- [x] Verify memory footprint reduction with namespaced i18n.
- [x] Verify background data refreshing in grid/table views.
