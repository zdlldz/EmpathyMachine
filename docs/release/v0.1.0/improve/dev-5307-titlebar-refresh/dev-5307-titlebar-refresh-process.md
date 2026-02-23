# [DEV-5307] - Titlebar refresh + window chrome
Icon: tabler:layout-navbar
Tags: ui, window, titlebar
Date: 2026-01-11
Summary: Replaced the legacy header with a reusable window titlebar that improves drag area, aligns with macOS traffic lights, and hosts the sidebar toggle + breadcrumb outside the scrollable main area.

## Goal
- Replace the current header/titlebar pattern with a reusable window chrome component for all windows.
- Improve draggable area on macOS overlay titlebars while preserving interactive controls.
- Move the breadcrumb and expand/collapse control into the titlebar surface.

## Discovery
- `frontend/src/lib/components/app-header.svelte` is the shared header with `app-drag`/`data-tauri-drag-region`, optional title, and action slots.
- Main window renders the breadcrumb inside `AppHeader` via the `leading` slot in `frontend/src/App.svelte`.
- Settings, Components, and Utility windows all use `AppHeader` with title + actions.
- Drag helpers live in `frontend/src/styles/app.scss` (`app-drag`/`app-no-drag`).
- Overlay titlebars are enabled in `backend/tauri.conf.json` and when creating auxiliary windows in `frontend/src/App.svelte`.

## Scope
- New titlebar component to replace `AppHeader` across windows.
- Configurable window-level API for title, breadcrumb items, and sidebar toggle.
- Standardized drag/no-drag behavior across windows.

## Changes
- Added a `WindowTitlebar` component with a config-driven API for title, breadcrumbs, and sidebar toggle.
- Moved the main window breadcrumb into the titlebar and added the sidebar expand/collapse control.
- Standardized titlebar sizing + inset with CSS variables aligned to macOS traffic lights.
- Added a `WindowInset` wrapper so titlebar chrome lives outside scrollable main content.
- Removed the legacy `app-header.svelte` component and offset titlebar usage.

## Files touched
- `frontend/src/core/window-chrome.ts`
- `frontend/src/lib/components/window-titlebar.svelte`
- `frontend/src/lib/components/window-inset.svelte`
- `frontend/src/styles/app.scss`
- `frontend/src/App.svelte`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/components/ComponentsApp.svelte`
- `frontend/src/window/WindowApp.svelte`
- `frontend/src/lib/components/app-header.svelte` (removed)
- `docs/knowledge/tauri-window-management.md`

## Validation
- Not run (UI change only).

## Notes
- Align drag region sizing with macOS overlay titlebar behavior.

## Decisions
- Sidebar expand/collapse control uses `Sidebar.Trigger` and only renders for windows with a sidebar.
- Breadcrumbs become the primary label in the titlebar; the final crumb represents the window title.
- Entire titlebar remains draggable; only explicit controls are marked `app-no-drag`.
- Keep the API simple but durable: a `WindowChromeConfig` object per window for titlebar config.
- Align titlebar height and left inset with macOS traffic lights so controls feel integrated.

## Plan v2 (executed)
1. Create a new `WindowTitlebar` component that accepts `WindowChromeConfig` (title, breadcrumbs, sidebar toggle) and supports an actions snippet.
2. Add titlebar CSS variables and utility classes in `app.scss` for height and traffic-light inset.
3. Migrate main, settings, components, and utility windows to the new titlebar and per-window config.
4. Remove `app-header.svelte` and any offset/legacy titlebar layout code.
5. Update docs/knowledge to capture the new titlebar conventions; update task status.
