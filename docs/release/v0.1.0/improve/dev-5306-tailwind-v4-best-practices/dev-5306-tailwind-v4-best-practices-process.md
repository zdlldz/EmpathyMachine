# [DEV-5306] - Tailwind v4 + shadcn best-practices alignment
Icon: tabler:brand-tailwind
Tags: frontend, tailwind, shadcn, docs
Date: 2026-01-06
Summary: Applied best-practices updates, upgraded Tailwind to v4, and refreshed shadcn-svelte wiring and docs.

## Goal
- Align the frontend with current Svelte/shadcn best practices and modern Tailwind v4 setup.

## Scope
- Tailwind v4 migration and Vite plugin wiring.
- Dependency cleanup and shadcn registry updates.
- Documentation updates for new workflow and guidance.

## Changes
- Migrated Tailwind entrypoint to v4 `@import` + `@custom-variant dark` style and added `tw-animate-css`.
- Added `@tailwindcss/vite` plugin and removed PostCSS config.
- Updated shadcn `components.json` registry and removed the deprecated Tailwind config entry for v4.
- Cleaned dependencies and moved runtime deps out of devDependencies.
- Updated README and agent/knowledge docs.

## Files touched
- `frontend/package.json`
- `frontend/vite.config.ts`
- `frontend/src/styles/tailwind.css`
- `frontend/components.json`
- `frontend/postcss.config.cjs`
- `README.md`
- `agents.md`
- `frontend/agents.md`
- `docs/knowledge/tailwind-v4-shadcn-svelte.md`
- `docs/knowledge/README.md`
- `docs/AUDIT_best-practices-codex.md`

## Validation
- Not run (dependency changes pending install).

## Notes
- Run `pnpm install` to refresh the lockfile and ensure Tailwind v4 deps are installed.
