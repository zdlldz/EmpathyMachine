# [DEV-1234] - Bits UI + SCSS refactor plan (v0.7)
Icon: tabler:layout
Tags: frontend, styling, refactor, bits-ui
Date: 2026-01-16
Summary: Plan for refactoring the starter UI stack from Tailwind + shadcn-svelte to Bits UI primitives with a SCSS-first styling pipeline, preserving current app behavior while expanding component coverage and block-level composition.

## Goal
- Replace Tailwind/shadcn styling with a clean Bits UI + SCSS approach.
- Keep the starter minimal, explicit, and extensible for future app work.
- Preserve current app behavior, window structure, settings, and theme toggling.

## Scope
- Frontend styling stack: remove Tailwind dependency and shadcn UI wrappers.
- Replace UI primitives with Bits UI + SCSS styling strategy.
- Update docs to reflect new architecture and usage.

## Changes (planned)
- Audit current component usage and map to Bits UI primitives.
- Define SCSS architecture (tokens + base + layout + components + overrides).
- Replace Tailwind utilities and `tailwind-variants` with SCSS classes.
- Remove Tailwind tooling from Vite/Svelte configs and dependencies.
- Remove shadcn CLI config and references (docs-only mentions OK).
- Rebuild UI wrappers to Bits UI patterns (`class`, `style`, `child` snippet usage).
- Introduce block-level components for DRY layout and view composition.
- Align theme tokens with the new SCSS layer while keeping current presets.

## Files touched (planned)
- frontend/vite.config.ts
- frontend/svelte.config.js
- frontend/src/styles/app.scss
- frontend/src/styles/** (new SCSS structure)
- frontend/src/lib/components/ui/**
- frontend/src/lib/components/blocks/** (new)
- frontend/src/lib/utils.ts
- frontend/components.json (remove)
- frontend/package.json
- docs/decisions/DEV-1234-bits-ui-scss.md (new)
- docs/ (updates TBD)
- docs/process/DEV-1234-bits-ui-scss-refactor-tracker.md

## Validation (planned)
- pnpm -C frontend check
- pnpm -C frontend test:e2e
- pnpm -C frontend i18n:check

## Discovery (current state)
- Multi-window frontend with four entrypoints (index/settings/window/components) configured in `frontend/vite.config.ts`; each entrypoint imports `tailwind.css` and `app.scss`.
- Tailwind is the primary styling system: `@tailwindcss/vite`, `tailwind.config.cjs`, and `frontend/src/styles/tailwind.css` (theme tokens, `@custom-variant dark`, `@theme inline`, `@apply` base styles).
- Shadcn layer is extensive: `frontend/src/lib/components/ui/**` wraps Bits UI primitives with Tailwind variants; `frontend/components.json` configures the shadcn CLI; `frontend/src/references/shadcn-svelte` is a large reference subtree.
- App usage is smaller: `App.svelte`, `SettingsApp.svelte`, `WindowApp.svelte`, titlebar components, and the dashboard/hello views use a subset (Button, Dialog, ContextMenu, DropdownMenu, Sidebar, Avatar, Breadcrumb, Card, Separator, Input).
- “Components Godmode” window imports many UI components and references shadcn docs/registry data.
- `frontend/src/lib/utils.ts` uses `tailwind-merge` + `clsx` (`cn` helper), and many UI components rely on `tailwind-variants`.
- Theme system is centralized in `frontend/src/core/theme.ts`; tokens live in `frontend/src/styles/tailwind.css`.

## Bits UI notes
- Headless; no default styles. Styling via `class`/`style` props, data-attributes, or `child` snippet.
- Uses `forceMount` and `wrapperProps` for portals/positioned components; `child` snippet for custom rendering.
- Supports bindable props via standard Svelte `bind:`.

## Bits UI nuances (from docs) + implications
- `BitsConfig` provides scoped defaults (portal target, locale) with inheritance and fallback resolution. This suggests a root wrapper per entrypoint to centralize `defaultPortalTo`/`defaultLocale` and reduce repeated props.
- `Portal` defaults to `document.body`, can target custom elements, or be disabled. We should choose a per-window portal strategy (body vs. explicit portal root).
- `mergeProps` chains event handlers (stops after `preventDefault`), merges class names, and merges style strings/objects. This should be the standard for wrapper prop composition.
- `child` snippet is the preferred path for custom markup, transitions, actions, and scoped styles; it must spread `props` and optionally `wrapperProps` for floating content.
- Floating content components require a two-level structure: unstyled wrapper with `wrapperProps`, styled inner element with `props`. This applies to Combobox, DatePicker, DateRangePicker, DropdownMenu, LinkPreview, Menubar, Popover, Select, and Tooltip content components.
- `ref` bindings rely on internal IDs; custom IDs must be passed to the parent component so the ref wiring stays intact.
- `useId` is available for unique IDs in wrapper components when needed.
- Type helpers (`WithElementRef`, `WithoutChild`, `WithoutChildren`, `WithoutChildrenOrChild`) are intended for shaping wrapper prop surfaces to prevent exposing unsupported `child`/`children` usage.
- `IsUsingKeyboard` is used internally and can support keyboard-first focus styling if we want a shared focus mode signal.
 - Transitions in Svelte 5 are handled via `child` snippet + `forceMount` for components that need explicit control; Bits UI recommends a reusable wrapper when applying this pattern broadly.

## Portal strategy (planning)
- Option A: Default to `document.body` using `BitsConfig` (no extra DOM node). Simple and stable per window, but harder to isolate overlay z-index stacks if we later split layout regions.
- Option B: Dedicated portal root per window (`#portal-root` sibling to app root). More explicit layering control and avoids issues if app root or tab containers ever apply transforms/overflow; best for future tab virtualization/tear-out windows.
- Option C: Multiple portal roots via nested `BitsConfig` to scope overlays to specific UI regions.
- Recommendation: Option B with `BitsConfig` at each entrypoint to set `defaultPortalTo` and `defaultLocale`.

## i18n integration (planning)
- Use `BitsConfig defaultLocale` wired to the resolved locale from `frontend/src/core/i18n.svelte.ts` (not the raw `settings.language` string) so Bits UI reflects system and user language selections immediately.
- Keep locale updates reactive (settings changes should update `defaultLocale` for Bits UI components in the same window).

## Codebase alignment notes
- Many existing UI wrappers already follow Bits UI patterns (child snippet, bindable `ref`, portal subcomponents).
- `mergeProps` is already used in `sidebar-menu-button.svelte`; a consistent wrapper pattern can expand this.
- Several wrappers depend on `WithoutChildren/WithoutChild` types and will benefit from formalizing the prop surfaces when we re-author them.
- Floating content wrappers (popover/dropdown/tooltip/dialog/etc) already use portal components; when reworking transitions we must preserve the required wrapper structure.
- `Command` usage already calls `useId` for stable IDs; likely reusable in the refactor.

## Decisions (captured)
- Remove all Tailwind tooling (`tailwindcss`, `@tailwindcss/vite`, `tailwind-variants`, `tailwind-merge`, `tw-animate-css`).
- Keep Bits UI default patterns; styling via component-level classes, `child` snippet, and a durable SCSS framework with clean override DX.
- Components Godmode stays, rebuilt on the new component system as a primary debug surface.
- Delete shadcn references (`frontend/src/references/shadcn-svelte`, `frontend/components.json`), except docs mentions.
- Use a stable base SCSS system with naming conventions; allow component/child scoped overrides.
- Keep theme presets but rebuild token names/structure; focus on one solid light/dark theme first, then expand presets.
- Full UI component coverage plus block-level components for DRY layouts and view composition.
- Use Space Grotesk Variable + JetBrains Mono Variable for base typography.
- Add a single ADR covering this whole refactor thread.
- Use a dedicated portal root per window (`#portal-root`) and set `BitsConfig defaultPortalTo` for each entrypoint.
- Keep first-class keyboard support as a core direction; consider `IsUsingKeyboard` integration later.

## Plan (refined)
- Phase 1: Remove Tailwind stack
  - Strip Tailwind plugin/config and dependencies; replace `tailwind.css` with SCSS entry.
  - Update entrypoints to import the new SCSS base.
  - Simplify `cn` helper to remove `tailwind-merge` (keep `clsx` if needed).
- Phase 2: SCSS foundation
  - Establish token schema + base reset + layout primitives + component layers.
  - Define theme variables for light/dark; keep preset scaffold but only ship one solid theme initially.
  - Document how per-app overrides are layered (core → component → app overrides).
  - Decide default locale + portal target for each entrypoint (BitsConfig).
  - Add portal root per entrypoint (`#portal-root`) and wire `BitsConfig defaultPortalTo`.
- Phase 3: UI primitives (full coverage)
  - Replace each `lib/components/ui/**` wrapper with Bits UI + SCSS classes.
  - Prefer `child` snippet for composition and pass-through props for styling hooks.
  - Audit and normalize data-attributes to keep styling consistent.
  - Standardize `mergeProps` usage when composing props and children.
  - Create a reusable pattern for floating content `child` wrappers (with `wrapperProps`).
  - Audit each floating content component to ensure wrapper structure is preserved.
  - Build a reusable transition wrapper pattern for `forceMount` + `child` usage.
  - Wire `BitsConfig` defaults (portal + locale) for each entrypoint.
- Phase 4: Block components + app refactor
  - Introduce block-level components (sidebar shells, titlebar, settings panels, card groups).
  - Split views into focused components and update App/Settings/Window layouts.
- Phase 5: Components Godmode
  - Rebuild the showcase to use the new primitives + blocks.
  - Use it as the canonical visual/debug surface for components.
- Phase 6: Docs + ADR
  - Update docs to reflect Bits UI + SCSS workflow.
  - Add ADR in `docs/decisions/DEV-1234-bits-ui-scss.md`.

## Notes
- This doc is v0.7; portal root decision confirmed and keyboard-first direction captured.
