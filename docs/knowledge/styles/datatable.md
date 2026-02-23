# Datatable component
Tags: ui, datatable, performance, virtualization
Date: 2026-01-30
Summary: Dependency-free datatable model + UI with virtualization, selection, and inline edit hooks.

Purpose: high-performance, dependency-free data grid with virtualization, selection, and inline edit hooks.

Key capabilities
- Row + column virtualization with pinned columns and sticky header.
- Cell + row selection with range/multi-select.
- Sort + filter state managed locally (no external table dependency).
- Inline edit states with lightweight visual cues (pending/confirm/saved/error).
- Clipboard range copy/paste with staged apply/discard controls.
- Header filter input expands from the filter icon and auto-dismisses on idle/outside/Escape.

Usage sketch
```ts
import DataTable from '$lib/components/blocks/datatable.svelte';
import { createDataTableModel } from '$lib/components/blocks/datatable-model.svelte';

const model = createDataTableModel({
  data,
  columns,
  getRowId: (row) => row.id
});
```

Notes
- Column metadata lives on `column.meta` (align, pin, size, editable).
- Sorting/filtering are opt-in per column (`sortable`, `filterable`).
- Virtualization defaults on; disable for tiny tables in previews.
