# DEV-1234 - Bits UI + SCSS styling stack

## Status
Accepted

## Context
We want a clean, durable starter UI stack aligned with Svelte 5 and Tauri 2. The previous Tailwind + shadcn-svelte setup added utility noise and a heavier dependency surface. The team prefers SCSS for clearer markup, predictable overrides, and long-term maintainability while still leveraging Bits UI primitives.

## Decision
Adopt Bits UI primitives with a SCSS-first styling pipeline. Remove Tailwind tooling and shadcn CLI wiring, centralize tokens in `frontend/src/styles/_tokens.scss`, split theme presets to `frontend/src/styles/themes/_presets.scss`, and keep global base/app utilities in `frontend/src/styles/`. Component and block styles are co-located with their wrappers (e.g. `frontend/src/lib/components/ui/button/button.scss`). Introduce block-level layout components in `frontend/src/lib/components/blocks/` (sidebar shells/layouts, titlebar tabs, settings panels, card grids). Use `BitsConfig` for shared portal and locale defaults.

## Consequences
- Styling now flows through SCSS layers + co-located component styles; utility-class usage is discouraged.
- UI wrappers and block components rely on data attributes + semantic classes for styling hooks.
- Docs and agent guidance must reference the SCSS pipeline and Bits UI wrappers instead of Tailwind/shadcn.
