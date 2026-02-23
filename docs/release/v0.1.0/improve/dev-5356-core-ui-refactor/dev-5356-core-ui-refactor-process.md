# [DEV-5356] - Core UI Refactor & Standardization
Icon: tabler:layout-grid
Tags: frontend, components, DRY, refactor
Date: 2026-02-16
Summary: Comprehensive refactor of core UI components and view patterns to improve maintainability, reduce boilerplate, and standardize the UX/UI across the application.

## Goal
- Standardize view layouts and property displays.
- Reduce boilerplate in forms and command palette.
- Implement a robust "Nested Sidebar" / "Panel" architecture for auxiliary tools like the Prompt Engine.
- Ensure all components are DRY and follow enterprise-grade patterns.

## Scope
- View Layouts (`ViewShell`, standard padding/spacing).
- Property Display (`PropertyRow` for consistent label-value pairs).
- Form Components (`FormInput`, `FormSelect`, `FormSwitch` wrappers).
- Global Search / Command Palette abstraction.
- Content Grid sharing logic (refactoring `GridView` complexity).
- Nested Sidebar/Panel architecture fix.

## Approach
1. **Fix & Standardize Panels:** Fix the broken Prompts panel by implementing a proper nested sidebar architecture.
2. **Layout Components:** Create `ViewShell` and `PropertyRow` to unify display patterns.
3. **Form Refactor:** Create high-level form wrappers to reduce boilerplate.
4. **Logic Extraction:** Move complex view logic (search/sort/filter) into Svelte 5 runes.
5. **Boilerplate Cleanup:** Extract command palette and other shell-level logic from `App.svelte`.

## Implementation Plan

### Phase 1: Panel Architecture Fix (Current)
- [x] Fix `PromptsPanel` visibility by ensuring it mounts correctly in `App.svelte`.
- [x] Align `NestedRightRail` and `SidebarShell` to support "Double Sidebar" UX.
- [x] Verify "Prompts" drawer opens and closes next to the right rail.

### Phase 2: Core Components
- [x] Implement `PropertyRow` component.
- [x] Implement `ViewShell` component.
- [x] Update `DashboardView` and `ConnectionsView` to use new components.

### Phase 3: Form Hardening
- [x] Implement `FormInput`, `FormSelect`, `FormSwitch`.
- [x] Refactor `PromptsPanel` and `ConnectionsView` to use them.

### Phase 4: View Logic Consolidation
- [x] Extract `useLibrary` rune for grid/table logic.
- [x] Clean up `GridView.svelte`.

### Phase 5: Shell Cleanup
- [x] Extract `CommandPalette` component from `App.svelte`.

## Status
- [x] Phase 1: Complete
- [x] Phase 2: Complete
- [x] Phase 3: Complete
- [x] Phase 4: Complete
- [x] Phase 5: Complete

## Files touched
- `frontend/src/App.svelte`
- `frontend/src/lib/components/blocks/nested-right-rail.svelte`
- `frontend/src/views/prompts-panel.svelte`
- `frontend/src/lib/components/ui/view-shell.svelte`
- `frontend/src/lib/components/ui/property-row.svelte`
- `frontend/src/lib/components/ui/form-field/index.ts`
- `frontend/src/core/library.svelte.ts`
- `frontend/src/lib/components/blocks/command-palette.svelte`

## Validation
- [x] Prompts panel opens correctly.
- [x] Layout matches "Double Sidebar" UX.
- [x] `i18n:check` remains passing.
- [x] `pnpm check` remains passing.
