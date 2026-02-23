# [DEV-5305] - Sidebar collapse polish (round 2)
Icon: tabler:layout-sidebar
Tags: frontend, sidebar, ui
Date: 2026-01-07
Summary: Tightened collapsed inset spacing, removed collapsed footer padding, and bumped the utility header offset.

## Goal
- Remove extra inset margin and footer padding in the collapsed sidebar.
- Push the utility window header further below the traffic lights.

## Scope
- Sidebar inset/footer spacing and AppHeader offset only.

## Changes
- Removed collapsed inset left margin for the main content area.
- Dropped horizontal padding in the sidebar footer when collapsed.
- Increased `AppHeader` offset to 24px and applied to the utility window.

## Files touched
- `frontend/src/lib/components/ui/sidebar/sidebar-inset.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-footer.svelte`
- `frontend/src/lib/components/app-header.svelte`
- `docs/tasks.md`

## Validation
- Not run (UI polish).
