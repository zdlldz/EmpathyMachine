# [DEV-5376] - Rippable tabs QA + window translucence
Icon: tabler:arrows-diagonal
Tags: ux, tabs, windowing, logging
Date: 2026-02-01
Summary: Stabilize tab detaching with duplicate guards and CLI-friendly logging, ensure detached windows respect transparency, and outline the reattach plan.

## Goal
- Make tab detaching more reliable and observable.
- Ensure window translucence can show through when app backgrounds are disabled.
- Capture a concrete reattach plan for follow-up work.

## Scope
- Improve detachment guardrails and logging.
- Apply transparent window options to detached windows.
- Document reattach planning notes.

## Changes
- Added detaching guards + timeout cleanup to prevent duplicate window spawns.
- Logged detach lifecycle (start, created, ready, source close).
- Ensured detached windows use transparent window settings.
- Updated window management knowledge doc.

## Files touched
- `frontend/src/lib/components/titlebar-tabs.svelte`
- `frontend/src/App.svelte`
- `docs/knowledge/tauri-window-management.md`
- `docs/process/DEV-5376-rippable-tabs-qa.md`
- `docs/tasks.md`

## Validation
- Not run (manual QA recommended).

## Notes
### Reattach plan (scaffold)
- Add a drop target on the tab strip that can accept a dragged tab from another window.
- Emit a `tabs:reattach-request` event from the source window with tab payload + origin window id.
- On drop, the target window opens the tab (new id or preserve id) and emits `tabs:reattach-ready` back.
- Source window closes the tab only after `tabs:reattach-ready` ack.
- Add a short timeout + logging similar to detach to avoid orphaned tabs.
- Consider a visual affordance when hovering over a window to indicate it can accept a reattached tab.
