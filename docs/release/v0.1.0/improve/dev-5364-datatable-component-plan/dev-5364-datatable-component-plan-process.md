# [DEV-5364] - Datatable component (plan)
Icon: tabler:table
Tags: ui, data, table, perf, planning
Date: 2026-01-30
Summary: Plan a minimal, high-performance Datatable component with keyboard navigation, inline editing hooks, and scalable sorting/filtering/search UX aligned with existing grid patterns.

## Goal
- Define a durable UI/UX and API shape for a database-oriented datatable that remains fast at scale.
- Align with existing ScrollableGrid performance patterns, styling tokens, and settings persistence.
- Provide a clear, staged path for later backend wiring (SQLite + view config) without refactors.

## Scope
- UI/UX and component architecture only (no DB wiring in this phase).
- Header sorting/filtering/search affordances, row/cell navigation, and inline edit affordances.
- Performance strategy (virtualization, row measurement, input handling) for large datasets.
- Mobile-friendly, keyboard-first, mouse/touch parity, and accessible semantics.

## Research notes
- `ScrollableGrid` already provides row-based virtualization + focus APIs; reuse patterns where possible.
- `ui/table` provides base table styling; `ui/scroll-area` offers scroll shell.
- View state persistence uses `createViewState` + `settings.svelte.ts` keys.

## Approach
- **Structure:** New block component (`blocks/datatable`) that composes
  - a thin layout shell (header + toolbar + body),
  - a table rendering layer (CSS grid + `role="grid"`),
  - a virtualization controller (row-based, variable height),
  - a keyboard navigation controller (roving cell focus).
- **Data model:** Use TanStack Table for columns, sorting, filtering, and row models;
  keep UI independent of data source via adapters.
- **Rendering:** Default to CSS grid + ARIA grid semantics for flexibility; ensure A11y parity with native tables.
- **Performance:** Row virtualization similar to `ScrollableGrid` (overscan + measured row heights + anchor correction), variable heights from day one.
- **Editing:** Enter-to-edit for MVP; configurable friction layer (e.g., double-enter + staged save states) as a first-class option.

## Decisions locked in
- **Rendering:** CSS grid with `role="grid"` (not native `<table>`), for maximal flexibility and future extensions.
- **Row heights:** Variable height support from day one.
- **Selection model:** Cell + row selection, with multi-select (shift/cmd), range select, and header checkbox for select-all.
- **Inline editing:** Enter-to-edit MVP; support optional confirmation friction states (e.g., pending/confirm/saved).
- **Sorting/filtering UI:** Per-header controls are the core UX; toolbar can optionally reflect active filters/search.
- **Column virtualization:** Yes (support massive, wide datasets); enable horizontal virtualization for performance.
- **Sticky + pinned:** Sticky header and pinned columns are required; expose easy on/off toggles.
- **Resize + reorder:** Column resize and reorder are in v1.
- **Selection UI:** Checkbox column renders only when selection is enabled.
- **Edit state affordances:** Use lightweight color tokens (new CSS vars) for pending/confirm/saved states.
- **Pinning defaults:** Selection checkbox column (and optional row index) are pinned left by default.
- **Reorder constraints:** Follow best-practice UX; pinned columns reorder within pinned region only.
- **Resize behavior:** Drag-only in v1 (auto-fit on double-click deferred).
- **Input parity:** First-class keyboard + mouse/tap UX; mobile-friendly + accessible by default.

## API sketch (v1)
- `DataTable` props (draft):
  - `rows`: data array
  - `columns`: TanStack `ColumnDef<TData, TValue>[]`
  - `getRowId`: row id getter
  - `density`: `'compact' | 'standard' | 'comfortable'`
  - `sortable`, `filterable`, `searchable`: global toggles
  - `selectionMode`: `'none' | 'cell' | 'row' | 'both'`
  - `enableColumnResize`, `enableColumnReorder`, `enableColumnPinning`
  - `enableVirtualization` (row + column)
  - `enableStickyHeader`, `enablePinnedColumns`
  - `overscanRows`, `overscanColumns`
  - `editMode`: `'enter' | 'double-enter' | 'off'` (extendable)
  - `editStateColors`: css var tokens (pending/confirm/saved)
- Events:
  - `onCellFocus`, `onCellActivate`, `onCellEditStart`, `onCellEditCommit`, `onCellEditCancel`
  - `onSelectionChange`, `onSortChange`, `onFilterChange`, `onSearchChange`
  - `onColumnResize`, `onColumnReorder`, `onColumnPin`

## State model (v1)
- **Table state (TanStack)**: sorting, filtering, column order, column sizing.
- **Selection state**: row ids + cell keys, range anchor, last active.
- **Edit state**: active cell, pending value, status (`idle | pending | confirm | saved | error`).
- **Virtualization state**: row heights, row offsets, column widths, scroll positions.
- **Pinned columns**: left pinned ids; right pinned optional (future-ready).

## Virtualization design (detail)
- **Rows**:
  - Measure row heights via `ResizeObserver`.
  - Maintain prefix-sum offsets + binary search for visible range.
  - Anchor row correction to prevent scroll jumps.
- **Columns**:
  - Track column widths via column sizing state.
  - Compute visible column window from `scrollLeft`, plus overscan.
  - Always render pinned columns; virtualize only the center region.

## Keyboard + input UX (detail)
- Arrow keys move across cells; Home/End jump row ends; PageUp/PageDown page by viewport.
- Enter toggles edit; Escape cancels; Enter commits when editing.
- Shift+Arrow expands selection range; Cmd/Ctrl toggles selection.
- Mouse/touch: click to focus, shift-click range select, drag select (optional phase 2 if needed).

## Accessibility (detail)
- `role="grid"` on root with `aria-rowcount`, `aria-colcount`.
- `role="row"` per row, `role="columnheader"` for headers, `role="gridcell"` for data.
- `aria-selected` on selected rows/cells; `aria-sort` on sortable headers.
- Keyboard focus ring + visible selection states; honors `prefers-reduced-motion`.

## Styling + tokens
- Reuse core tokens from `frontend/src/styles/_tokens.scss`.
- Add CSS vars for edit state hints (pending/confirm/saved) in tokens.
- Use `contain`, `content-visibility`, and `will-change` to minimize layout cost.

## Plan
1. **Define the API contract**
   - Props: rows, columns, rowKey, density, isEditable, selection mode, column config (sortable/filterable), etc.
   - Events: onCellFocus, onCellEditStart/Commit/Cancel, onSortChange, onFilterChange, onSearch.
2. **Decide on render strategy**
   - Use CSS grid + ARIA grid semantics as the baseline; document accessibility requirements and DOM structure.
3. **Virtualization design**
   - Reuse `ScrollableGrid` row measurement + anchor correction logic.
   - Variable row heights from day one; measure rows with `ResizeObserver`.
   - Add horizontal virtualization for columns; coordinate with pinned columns.
4. **Navigation + A11y**
   - Roving tabindex per cell, arrow-key navigation, Home/End, PageUp/PageDown.
   - ARIA roles: `grid`, `row`, `gridcell` with column/row headers.
5. **Header UX**
   - Sort toggles, filter affordance (popover placeholder), column resize handles, drag-to-reorder.
   - Sticky header; pinned columns with shadow separators.
6. **Inline editing UX**
   - Enter-to-edit; commit/escape semantics, optional confirm step, and visual states.
7. **View integration demo**
   - Add a `Datatable` preview in `core-ui` or a new view using mock data to validate UX.
8. **Docs + samples**
   - Component usage example and update Components Godmode data.

## Tracker
- [x] Finalize component API + types.
- [x] Build virtualization utilities (row + column).
- [x] Implement `DataTable` block (render, a11y, input, selection).
- [x] Add resize + reorder + pinning UX.
- [x] Implement edit mode + state hints.
- [x] Add demo usage + sample data.
- [x] Update docs + component registry.
- [ ] Verify keyboard + mouse/touch UX + perf pass.

## Open questions
- None (implementation ready).

## Changes
- Added `DataTable` block with row + column virtualization, selection, sorting, filtering, resize, reorder, and editing hooks.
- Removed TanStack Table dependency in favor of a minimal local table model.
- Added demo usage in Core UI view with mock data.
- Added datatable tokens + styles and Components Godmode entry.

## Files touched
- `frontend/src/lib/components/blocks/datatable.svelte`
- `frontend/src/lib/components/blocks/datatable.scss`
- `frontend/src/lib/components/blocks/datatable-virtualization.ts`
- `frontend/src/lib/components/blocks/datatable-model.svelte.ts`
- `frontend/src/lib/components/blocks/datatable-render.svelte`
- `frontend/src/lib/components/blocks/datatable-render.ts`
- `frontend/src/components/component-preview.svelte`
- `frontend/src/components/component-preview.scss`
- `frontend/src/components/README.md`
- `frontend/src/styles/_tokens.scss`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/core-ui-view.scss`
- `frontend/src/components/components-data.ts`
- `frontend/install-components.sh`
- `docs/knowledge/datatable.md`
- `docs/knowledge/README.md`
- `docs/process/DEV-5364-datatable-component-plan.md`

## Validation
- Not run (UI-only changes).
- Manual perf + keyboard/touch pass pending.

## Notes
- Keep dependency surface flat; datatable logic stays dependency-free.
- Align styles with existing tokens and `ScrollableGrid` interaction patterns.
  - Prioritize measurable FPS stability with large row/column counts.
- Column filters currently render a lightweight inline input; future iterations can swap to popover filters.
  - Dependencies trimmed to allow bespoke tuning without external table state.

## Learnings
- Column virtualization is handled via offset tracks plus pinned columns to avoid full-width DOM rendering.
- Row virtualization mirrors `ScrollableGrid` with measured heights and anchor-corrected scroll.
- Minimal table state (sort/filter/order/size) can live locally without vendor lock-in.
