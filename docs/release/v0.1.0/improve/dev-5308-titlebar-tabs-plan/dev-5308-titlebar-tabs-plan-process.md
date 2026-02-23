# [DEV-5308] - Titlebar tabs architecture plan
Icon: tabler:tabs
Tags: ui, titlebar, tabs, state
Date: 2026-01-15
Summary: Define a durable, DRY tab system for the titlebar that supports multiple view instances, preserves state across tab switches, and enables reordering with drag-and-drop.

## Goal
- Replace the single breadcrumb in the titlebar with a tab strip that uses breadcrumbs as the tab label.
- Support opening any view in a new tab (context menu + command-click).
- Preserve per-tab view state when switching tabs and returning.
- Allow horizontal drag-and-drop to reorder tabs.
- Keep the solution performant and extensible for many tabs.

## Discovery
- Current window shell centralizes the titlebar and sidebar, so a tab strip can be introduced without affecting main layout.
- Views are currently represented by `viewConfigs` with a single active view; tabs require multiple active view instances and preserved state.
- There is no existing tab state manager or persistence layer beyond settings and window state persistence.
- Existing breadcrumb component can be reused as a tab label with minor API additions if needed (e.g., compact mode).

## Scope
- Tab system architecture (data model, state manager, lifecycle).
- Titlebar UI for tabs (rendering, selection, drag ordering).
- Integration points for opening views as tabs (context menu + command-click).
- State preservation strategy for inactive tabs, with a path to virtualization.

## Out of scope (for now)
- Cross-window tab syncing.
- Pinning, tab groups, or split views.

## Proposed architecture (draft)
- Tab model: `{ id, viewId, labelCrumbs, params, stateKey, isDirty? }`.
- Tab manager store: handles create/close/select/reorder; exposes active tab + ordered list.
- View instancing: each tab renders a view component keyed by `tab.id`.
- State preservation:
  - Phase 1: Keep inactive tabs mounted but hidden to preserve local state (lowest risk).
  - Phase 2: Optional virtualization via view-level state adapters (serialize/restore) and LRU eviction.
- UI:
  - Titlebar renders a tab strip in place of the breadcrumb.
  - Each tab uses breadcrumb component to display label.
  - Drag reorder via pointer events and transform (no new deps).

## Open questions (updated)
None.

## Plan
1. Define the tab data model and manager store API (create/select/reorder/close/persist).
2. Add a new settings flag to persist tabs on reload (default on), stored alongside existing settings.
3. Replace titlebar breadcrumb rendering with a tab strip that consumes the manager and uses breadcrumbs for tab labels.
4. Implement horizontally scrollable tab strip with hover-visible close controls and a context-menu action to close.
5. Update navigation interactions (sidebar + in-view links + context menus + cmd-click) to open views in new tabs where applicable.
6. Implement drag-and-drop reordering for tabs without new dependencies; persist order per window.
7. Preserve per-tab state across switches; keep inactive tabs mounted initially, then add optional serialization hooks for future virtualization.
8. Implement persistence per window (tab list + active tab + order + scroll positions).
9. Add guardrails for large tab counts (overflow scrolling + lightweight rendering strategy).

## Accepted decisions
- Persist tabs on reload with a user setting toggle (default on).
- Tabs are closable (hover affordance + context menu).
- All navigable items can open in a new tab (where the destination is a view).
- Tab order and state persist per window.
- Tab strip uses horizontal scroll, and closing the last tab returns to the blank home.

## Files touched
- `frontend/src/App.svelte`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/core/navigation.ts`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/core/tabs.svelte.ts`
- `frontend/src/core/views.ts`
- `frontend/src/lib/components/titlebar-tabs.svelte`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/styles/app.scss`
- `frontend/src/views/dashboard-view.svelte`
- `frontend/src/views/hello-world-view.svelte`
- `docs/decisions/ADR-0004-titlebar-tabs.md`
- `docs/knowledge/tabs.md`

## Validation
- Not run (not requested).

## Notes
- This plan assumes no new dependencies unless drag-and-drop complexity forces it.
