# [DEV-5305] - Components Godmode polish
Icon: tabler:layout-dashboard
Tags: frontend, components, ux
Date: 2026-01-08
Summary: Polished the Components Godmode window layout, standardized badge and code block styling, and wired docs links + live theme updates.

## Goal
- Align the Components Godmode layout with the inset shell and reduce unintended padding.
- Use standard shadcn-svelte badge styles for install state.
- Ensure docs links open reliably and theme settings apply live.
- Tighten code block padding/line height without changing number/code spacing.

## Scope
- Components window layout, docs link behavior, and live theme sync.
- Code block padding and line-height tweaks.
- Add shell plugin for external link opening.

## Changes
- Removed extra horizontal padding in the Components window main region and header.
- Replaced custom green badge styling with stock Badge variants.
- Added `settings-preview` listener to apply live theme changes in the Components window.
- Open docs links via `@tauri-apps/plugin-shell` when running in Tauri.
- Reduced left padding and line height in code blocks for tighter alignment.

## Files touched
- `frontend/src/components/ComponentsApp.svelte`
- `frontend/src/lib/components/code-block.svelte`
- `frontend/package.json`
- `backend/Cargo.toml`
- `backend/src/main.rs`
- `backend/capabilities/default.json`
- `docs/knowledge/tauri-window-management.md`
- `agents.md`
- `frontend/agents.md`
- `backend/agents.md`

## Validation
- Not run (UI polish changes; requires app runtime for visual verification).

## Notes
- External link opening now depends on `tauri-plugin-shell` + `shell:allow-open` capability.
