# DEV-5375 - Rippable tabs feasibility
Icon: tabler:arrows-diagonal
Tags: discovery, tauri, windowing, ux
Date: 2026-01-31
Summary: Assessed whether tab tear-off to new windows is feasible in Tauri 2 and what it would require for smooth UX. Implemented a detach-only flow with a global preference, per-view opt-out support, and window capability scoping.

## Goal
- Decide if rippable tabs are feasible in Tauri 2 without degrading UX or performance.
- Align on an implementation plan for detach now and reattach later.

## Scope
- Review Tauri 2 multi-window APIs and permissions.
- Outline a minimal, DRY approach for a detach-to-new-window flow.
- Capture product decisions for macOS-only implementation.
- Implement detach-only flow (drag-out + context menu) with a global preference.

## Plan
- Confirm window creation and capability scoping for detached windows.
- Map a minimal detach flow that reuses existing view routing/state.
- Add a global preference + per-view opt-out for detach.
- Implement detach-only on macOS with a path toward reattach.

## Tracker
- [x] Define detached window label prefix + capability scope (`detached-*`).
- [x] Add global preference for tab detaching.
- [x] Add per-view opt-out hook (`allowDetach`).
- [x] Implement detach gesture + context menu action.
- [x] Wire detached window bootstrapping + tab handoff event.

## Changes
- Added detach-only window spawn flow with query bootstrap + event handshake.
- Added global preference to enable/disable tab detaching.
- Added per-view detachment opt-out hook (default enabled).
- Scoped capabilities for dynamic detached windows and documented window labels.

## Files touched
- `frontend/src/lib/components/titlebar-tabs.svelte`
- `frontend/src/App.svelte`
- `frontend/src/core/tabs.svelte.ts`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/core/views.ts`
- `frontend/src/core/i18n/messages.json`
- `frontend/src/lib/components/blocks/titlebar-tabs.svelte`
- `backend/capabilities/default.json`
- `docs/knowledge/tauri-window-management.md`
- `docs/process/DEV-5375-rippable-tabs-feasibility.md`
- `docs/tasks.md`

## Validation
- Not run (docs + UI changes only).

## Notes
### Updated requirements
- macOS-only focus for this phase.
- Detached windows should keep the full shell (titlebar tabs + sidebars).
- Detached windows operate independently; no live data sync between tabs.
- Settings + theme should continue to sync in real time (existing model).
- Detach enabled for all tabs by default, but allow per-view opt-out.
- Add a global preference to enable/disable detach.
- Reattach is part of the long-term spec; detach-only is acceptable for now if it keeps complexity low.

### Findings
- Tauri 2 can create new windows at runtime from the frontend and backend, so spawning a new window per detached tab is technically supported.
- Creating windows from the frontend requires the `core:webview:allow-create-webview-window` permission to be granted in capabilities.
- A smooth UX depends on front-end drag handling and state transfer, not on a built-in "tear-off" primitive.

### UX/Perf risks
- Window creation is fast but not instant; a poor drag threshold or blocking UI could make detach feel laggy.
- If each window spins up a full webview with heavy state, resource use can spike with many windows.

### Implementation notes
- Detached windows use `index.html` with query bootstrapping for `window` + `detached` payload.
- Source window closes the tab after receiving `tabs:detach-ready` from the new window.
- Drag-out threshold uses vertical distance from the tab strip + a minimum pointer delta.
- Context menu includes a detach action for accessibility.

### Decisions
- Detached window label prefix: `detached-` (capabilities allow `detached-*`).
- Include both drag-out and context-menu detach triggers.
