# Titlebar tabs
Icon: tabler:tabs
Tags: ui, tabs, state, persistence
Date: 2026-01-15
Summary: Titlebar tabs are a per-window state system that preserve view instances, support reordering, and persist across relaunches when enabled.

## Key details
- Tabs are managed in `frontend/src/core/tabs.svelte.ts` and keyed per window label.
- Tab labels render as breadcrumbs; view metadata lives in `frontend/src/core/views.ts`.
- Persistence is controlled by `settings.persistTabs` and stored via the same settings backend (key prefix: `tabs_state.`).
- Each tab tracks scroll position; it is restored when switching tabs or relaunching.
- Views can access navigation helpers via `VIEW_NAVIGATION_CONTEXT` from `frontend/src/core/navigation.ts`.
