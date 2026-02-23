# [DEV-5393] - File tree folder viewer
Icon: tabler:folder
Tags: ui, ux, svelte, views
Date: 2026-02-04
Summary: Added a reusable file tree component and a new folder viewer view that pairs the hierarchy with a grid of items. Wired the view into navigation, Core UI, and Components Godmode, plus localized new labels.

## Goal
- Deliver a minimal, extensible file tree hierarchy and folder viewer view using existing grid/card primitives.

## Scope
- Add a file tree block component with expandable folders and file-type aware icons.
- Create a new Folder Viewer view combining the tree and a contents grid.
- Register the view in navigation and surface the tree in Core UI and Components Godmode.

## Changes
- Added `file-tree` core data + helpers and shared icon mapping utilities.
- Built the file tree component and wired it into the new folder viewer view.
- Registered view + i18n strings and updated Core UI + Components Godmode.
- Tuned tree ARIA semantics and reduced repeated date formatter work.

## Files touched
- `frontend/src/core/file-tree.svelte.ts`
- `frontend/src/lib/components/blocks/file-tree.svelte`
- `frontend/src/lib/components/blocks/file-tree-item.svelte`
- `frontend/src/lib/components/blocks/file-tree.scss`
- `frontend/src/lib/components/blocks/file-tree-icons.ts`
- `frontend/src/views/folder-viewer-view.svelte`
- `frontend/src/views/folder-viewer-view.scss`
- `frontend/src/core/views.ts`
- `frontend/src/App.svelte`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/views/core-ui-view.svelte`
- `frontend/src/views/core-ui-view.scss`
- `frontend/src/components/components-data.ts`
- `frontend/src/components/component-preview.svelte`
- `frontend/src/components/component-preview.scss`
- `docs/tasks.md`

## Validation
- Not run (UI-only changes).

## Notes
- The file tree auto-expands the selected path while preserving manual expansions.
