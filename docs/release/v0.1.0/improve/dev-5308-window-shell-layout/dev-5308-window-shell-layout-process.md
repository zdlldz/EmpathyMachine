# [DEV-5308] - Window shell layout refactor plan
Icon: tabler:layout-navbar
Tags: ui, window, layout
Date: 2026-01-15
Summary: Split the app into a blank default shell (titlebar + sidebar only) and moved the dashboard content into a dedicated view rendered via the sidebar.

## Goal
- Make the default window view a minimal shell (titlebar + sidebar only).
- Move the current dashboard content into a separate page/view and add a sidebar link.
- Define a precise, scalable layout structure for titlebar + main body with independent scrolling.

## Discovery
- Current layout couples titlebar + content within the same container, which makes the titlebar feel inside the scrollable region.
- Sidebar variant uses "inset" styling; we need a clean shell layout that sits outside the scroll region.
- The existing "New" action is in the titlebar and will become icon-only with a background style.

## Scope
- Refactor window shell structure (outer window container, titlebar row, main row with sidebar + content).
- Move current dashboard content into a new view/page and wire into the main nav entry.
- Update the titlebar element ordering and alignment to match macOS traffic lights.
- Keep the default view empty (titlebar + sidebar only).

## Changes
- Introduced a top-level window shell layout with an 8px gap, a draggable titlebar row, and a main row for sidebar + content.
- Moved the dashboard content into `frontend/src/views/dashboard-view.svelte` and wired it to the main nav entry.
- Made the default shell view blank while keeping the titlebar + sidebar visible.
- Updated titlebar actions (sidebar toggle, breadcrumb, icon-only secondary action button).
- Drove breadcrumbs from the active view and reduced the separator icon size.
- Added an inline sidebar layout option so the sidebar stays in-flow with the shell layout.
- Wrapped the titlebar and main row in `Sidebar.Provider` so the toggle remains connected to sidebar state.
- Made the titlebar full-width within the padded shell and shifted shell layout to CSS helpers.
- Wired workspace/title clicks to return to the blank home view.
- Removed default sidebar padding to keep layout spacing controlled by flex containers.
- Marked the shell root as draggable and excluded the main row with `app-no-drag`.
- Reduced titlebar height and aligned collapsed sidebar item sizing with `--sidebar-width-icon`.
- Standardized collapsed sidebar widths for inline inset variant.
- Removed shell padding/background styling so content containers are layout-only, including the sidebar provider wrapper.
- Forced native app theme to light so macOS renders light traffic lights regardless of in-app theme.
- Reworked settings/components/utility windows to use the shared window shell layout.

## Files touched
- `frontend/src/App.svelte` (shell layout + route integration)
- `frontend/src/core/theme.ts`
- `frontend/src/core/window-chrome.ts`
- `frontend/src/lib/components/window-titlebar.svelte`
- `frontend/src/lib/components/window-inset.svelte`
- `frontend/src/lib/components/ui/breadcrumb/breadcrumb-separator.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-provider.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-footer.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-group-label.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-header.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-menu-badge.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-menu-button.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-menu-skeleton.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-menu-sub-button.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-menu-sub.svelte`
- `frontend/src/styles/app.scss`
- `frontend/src/components/ComponentsApp.svelte`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/window/WindowApp.svelte`
- `frontend/src/views/dashboard-view.svelte`
- `docs/process/DEV-5308-window-shell-layout.md`
- `docs/tasks.md`
- `docs/knowledge/tauri-window-management.md`

## Validation
- Not run (UI change only).

## Questions
None.
## Decisions
- Move the current dashboard into a dedicated view/page and keep the default shell blank.
- Breadcrumbs should be driven by active view selection; final crumb represents the page title.
- Titlebar action button uses `secondary` variant and is icon-only.
- Sidebar and content live in the main row and can scroll independently if content overflows.
- Use `--gap-shell` for shell spacing and avoid padding on shell containers.

## Plan v2 (executed)
1. Implement a new window shell layout: outer flex column (padding + gap), titlebar row, and main row.
2. Update titlebar layout ordering and spacing; reduce breadcrumb separator icon size.
3. Create a new dashboard view and wire it into the main nav entry.
4. Make the default shell view empty (sidebar + titlebar only).
5. Drive breadcrumb state from the active page/view selection.

## Notes
- Once the shell layout is in place, a styleguide view can be added as a follow-up (fast-follow).
