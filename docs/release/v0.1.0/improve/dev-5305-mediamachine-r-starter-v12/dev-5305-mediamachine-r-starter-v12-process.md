# [DEV-5305] - MediaMachine-R starter v1.2
Icon: tabler:layout-dashboard
Tags: scaffolding, ui, tauri, settings
Date: 2026-01-06
Summary: MVP scaffold update: minimal shadcn layouts, settings sidebar window, real-time persistence, and core IO wiring.

## Goal
- Align the starter UI to shadcn dashboard/sidebar patterns while wiring core Tauri inputs/outputs with minimal, durable styling.

## Confirmed direction
- Remove the gradient background; rely on default shadcn light/dark tokens.
- Keep only minimal layout motion (theme transition on toggle).
- Keep Inter variable font.
- Settings remain a standalone window but should use a sidebar layout like the shadcn sidebar dialog example.
- Reintroduce a minimal app menu with a Settings item that deep-links to the relevant settings section.
- Use Cmd+, as the Settings shortcut.
- Use a directory picker for Locations; export uses a save dialog defaulting to that folder.
- Theme setting should support Light/Dark/System and default to System.
- Settings sidebar order should be alphabetical: Account, Database, Locations, Preferences.
- Menu item should open Settings to Account by default; remembering last-viewed section is a nice-to-have.
- Settings persistence should start with current values only (snapshot/history later).
- Avatar storage should be file-first in app data dir with metadata/path in SQLite (no cached bytes in DB).
- Secondary nav should include a Dialog link (main window dialog) and a Window link (blank Tauri window), with Settings last.
- Revert to default shadcn-svelte tokens (no custom palette overrides).

## Open questions / follow-ups
- Cmd+M is reserved by macOS for minimize; we still listen for it, but the OS may intercept it.

## Expanded plan
### Phase 1 — Layout + style baseline
- Import or recreate shadcn dashboard/sidebar examples.
- Remove custom color token overrides; keep styling to shadcn defaults with minimal transitions.
- Update dashboard layout to the new sidebar + secondary nav structure.

### Phase 2 — Settings window + navigation
- Build Settings window with sidebar navigation (Account / Database / Locations / Preferences).
- Add deep-linking support so menu/shortcut routes to Account by default.
- Wire Settings open via sidebar link, app menu item, and Cmd+,.

### Phase 3 — Real-time settings persistence
- Implement a thin settings store with immediate UI updates and persistence.
- Evaluate localStorage caching for fast boot + SQLite durability.
- Add a shared inline “Saved” indicator component to avoid duplicated UX.

### Phase 4 — IO + integrations
- Account: avatar file picker, preview, and persistence.
- Preferences: theme toggle (light/dark/system) with smooth transitions, defaulting to System.
- Locations: directory picker + persist location.
- Database: export button -> save dialog defaulting to chosen location.
- Secondary nav: Settings (open sidebar), Dialog (main window dialog), Window (blank Tauri window).

### Phase 5 — Docs + agent workflow
- Document the shadcn import recipe (when to use `pnpm dlx` vs manual rebuild).
- Update agents docs with the new layout and settings conventions.
- Add a short knowledge entry on settings persistence + IO permissions.

## Progress update
- Dashboard rebuilt with shadcn sidebar layout and breadcrumb header (no legacy title).
- Shared header component introduced for consistent window chrome across views.
- Settings window moved to sidebar layout with Account/Database/Locations/Preferences.
- Real-time settings persistence added (local cache + SQLite) with shared save indicator and `settings-preview` events.
- IO wiring: avatar picker + stored file preview, output directory picker, database export, theme toggle.
- Utility window entrypoint added (`window.html`) and menu-driven settings navigation.
- Dialog UI component added; base tokens reset to default shadcn values (no gradients).

## Notes
- Reference repo added as submodule: `frontend/src/references/shadcn-svelte`.
- Example blocks live under `frontend/src/references/shadcn-svelte/docs/src/lib/registry/blocks/`.
- Reference configs dot-prefixed to keep `svelte-check` from loading subproject configs.