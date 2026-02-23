# [DEV-5373] - Connections view audit + freeze fix
Icon: tabler:bug
Tags: frontend, backend, audit, connections, tauri
Date: 2026-01-31
Summary: Audit recent connections work for the view freeze and stabilize navigation + app responsiveness.

## Goal
- Identify the root cause of the connections view freeze and resolve it with minimal, durable changes.

## Scope
- Frontend connections view, related GraphQL calls, and view routing behavior.
- Explicitly excludes new features or dependency upgrades.

## Plan
- Review recent commits and connections view integration points.
- Reproduce and isolate the freeze path.
- Implement minimal fixes and add targeted debug logging.
- Update docs/tasks.md with status and findings.

## Tracker
- [x] Review recent connections changes and logs.
- [x] Identify freeze trigger and fix.
- [x] Verify navigation responsiveness after fix.
- [x] Record findings and follow-ups.

## Changes
- Added connection-view debug logging around init + GraphQL actions.
- Stabilized connection row IDs in the datatable model.
- Aligned connections view layout with app-view utilities.
- Guarded form rendering until select defaults are ready to avoid undefined binds.
- Added lifecycle and state-change debug logs with session IDs.
- Removed selectValues state to avoid bind loops; use formConfig binding directly.
- Trimmed debug logs to action-level events and failures.
- Added macOS "Edit" menu to `backend/src/main.rs` to enable standard keyboard shortcuts (`Cmd+V`, etc.).
- Updated Cloudflare R2 connection type fields in `backend/src/domain/connections.rs` to include API Token ID/Value, Public Base URL, and Custom Domain.

## Files touched
- `docs/process/DEV-5373-connections-view-audit.md`
- `frontend/src/views/connections-view.svelte`
- `backend/src/main.rs`
- `backend/src/domain/connections.rs`

## Validation
- Manual: opened Connections view, verified no freeze after fix.

## Notes
- Process doc created and task index updated.
- Root cause: Svelte `effect_update_depth_exceeded` loop from select state syncing.
