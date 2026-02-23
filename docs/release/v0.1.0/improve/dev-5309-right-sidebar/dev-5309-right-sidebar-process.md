# [DEV-5309] - Right sidebar
Icon: tabler:layout-sidebar-right
Tags: ui, layout, sidebar
Date: 2026-01-16
Summary: Add an independent right sidebar that mirrors the left sidebar behavior and provide a titlebar toggle. Document the worktree workflow expectation in the agent guide.

## Goal
- Introduce a right sidebar that can expand/collapse independently of the left sidebar.

## Scope
- Right sidebar UI matching the existing left sidebar content and behavior.
- Titlebar toggle for the right sidebar.
- Agent guide note about worktree hygiene.

## Changes
- Added a scoped sidebar context helper for independent sidebars.
- Added a right sidebar toggle in the titlebar actions.
- Mirrored the left sidebar layout into a right sidebar container.
- Documented worktree workflow expectations in `agents.md`.

## Files touched
- `frontend/src/App.svelte`
- `frontend/src/lib/components/ui/sidebar/context.svelte.ts`
- `frontend/src/lib/components/ui/sidebar/sidebar-scope.svelte`
- `frontend/src/lib/components/ui/sidebar/index.ts`
- `agents.md`
- `docs/tasks.md`

## Validation
- Not run (manual review only).

## Notes
- Right sidebar state is independent and does not persist to the left sidebar cookie.
