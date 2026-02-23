# Svelte 5 + shadcn-svelte Best Practices Audit (Codex)
Date: 2026-01-06

Scope: frontend Svelte 5 + shadcn-svelte setup, plus relevant docs. No code changes were made.

## Executive summary
The starter is largely aligned with Svelte 5 and shadcn-svelte patterns: runes are used, shadcn defaults are preserved, and the UI is built from copied shadcn components with minimal custom styling. The primary gaps are configuration-level and dependency hygiene (dark-mode strategy, animation utilities, and runtime dependency placement). These changes are low-risk and would make the current implementation more “by the book” without altering layouts or behaviors.

## Key sources referenced
- Svelte 5 getting started + runes docs.
- SvelteKit introduction (official app framework, feature set).
- shadcn-svelte docs: manual installation, components.json, dark mode (Tailwind v3), about.
- Bits UI getting started (install and purpose).

## Findings and recommendations (prioritized)

### 1) Dark mode strategy mismatch (high)
**Observed**
- Theme toggling sets a `.dark` class on the root element (`frontend/src/core/theme.ts`).
- shadcn UI components use `dark:` variants in several places (example: dropdown menu item). See `frontend/src/lib/components/ui/dropdown-menu/dropdown-menu-item.svelte`.
- Tailwind config does not set `darkMode: ['class']` (`frontend/tailwind.config.cjs`).

**Why this matters**
shadcn-svelte’s Tailwind v3 docs state the class strategy is used for dark mode. If Tailwind remains in its default `media` strategy, any `dark:` classes won’t respond to `.dark`, which can lead to incomplete dark mode styling.

**Recommendation**
- Set `darkMode: ['class']` in `frontend/tailwind.config.cjs` to align with the class-based toggle you already implement.

### 2) Missing animation utility dependency (medium)
**Observed**
- shadcn components in `frontend/src/lib/components/ui/*` use classes like `animate-in`, `fade-in-0`, `zoom-in-95`, etc.
- No animation utility plugin is configured (Tailwind plugins list is empty in `frontend/tailwind.config.cjs`).

**Why this matters**
shadcn-svelte’s manual installation docs include `tw-animate-css` to provide these animation utilities. Without the plugin, those classes won’t emit CSS, so transitions silently drop.

**Recommendation**
Choose one of:
- Add the animation utility recommended by the shadcn docs (`tw-animate-css`) and configure it.
- If you want zero extra dependencies, remove/replace the `animate-*` utility classes in the copied components so the UI is consistent with what actually ships.

### 3) Runtime dependencies listed as devDependencies (medium)
**Observed**
- `bits-ui` and `@lucide/svelte` are in `devDependencies` in `frontend/package.json`.
- Both are used at runtime (Bits UI underpins many shadcn components; Lucide icons are used in `frontend/src/App.svelte` and `frontend/src/settings/SettingsApp.svelte`).

**Why this matters**
Bits UI is a runtime library for Svelte 5 components, and shadcn-svelte explicitly cites it as a core dependency. Packaging/runtime tooling can treat devDependencies differently in production builds.

**Recommendation**
- Move `bits-ui` and `@lucide/svelte` to `dependencies` in `frontend/package.json`.

### 4) svelte-check tsconfig path likely incorrect (medium)
**Observed**
- `frontend/package.json` script uses: `svelte-check --workspace src --tsconfig ../tsconfig.json`.
- There is no `tsconfig.json` at repo root; the frontend tsconfig is `frontend/tsconfig.json`.

**Why this matters**
`pnpm -C frontend check` could point to a non-existent tsconfig, which risks false positives/negatives or failing checks.

**Recommendation**
- Update the script to point at `frontend/tsconfig.json` (or remove the override to let `svelte-check` auto-detect).

## SvelteKit vs Svelte + Vite (decision guidance)
Svelte’s docs recommend SvelteKit as the official application framework with built-in routing and production features. Using Svelte directly with Vite is a valid alternative, but you’ll need to choose additional libraries (e.g., routing) if the app grows beyond a single page.

**Pros of adopting SvelteKit**
- Built-in routing, data loading, and optimized builds.
- Official framework with first-party tooling.

**Pros of staying on Svelte + Vite (current setup)**
- Lean dependency footprint and full control of build shape (good for a Tauri app with multiple windows).
- No SSR/adapter complexity for a local-first desktop app.

**Recommendation**
Stay on Vite unless you need SvelteKit features (file-based routing, SSR, server endpoints, etc.). If you do adopt SvelteKit, use `sv` to scaffold the project and add Tailwind per shadcn’s manual install instructions.

## Bits UI usage guidance
shadcn-svelte is powered by Bits UI. For the “single import source” goal, continue importing only your local shadcn components (`src/lib/components/ui/*`) in app code. Use Bits UI directly only when you need a new primitive that isn’t represented in shadcn-svelte yet, then wrap it in your own `ui/` component.

## components.json alignment
- `frontend/components.json` is valid and in the right shape for the CLI.
- The shadcn docs clarify the file is optional unless you use the CLI.
- If you plan to use the CLI, confirm path aliases in config are aligned with the docs (the CLI uses the aliases in `components.json` plus Svelte config).

## Confirmed good patterns
- Svelte 5 runes are used (`$state`, `$derived`, `$props`) and aligned with Svelte’s current reactivity model.
- shadcn tokens and layout patterns are used without extra custom styling.
- Reference submodule is read-only and copied into `src/` as intended.

## Optional upgrade path: Tailwind v4
If you decide to upgrade Tailwind, follow shadcn-svelte’s Tailwind v4 migration docs and update the global CSS to use the new `@import "tailwindcss"` + `@import "tw-animate-css"` pattern. This is optional and larger in scope.

## Documentation updates recommended (no edits made)
- `agents.md`: add notes on dark-mode class strategy and animation utility expectations.
- `README.md`: document shadcn-svelte CLI usage and the `components.json` purpose (CLI-only), plus dependency placement for Bits UI and Lucide.
- `docs/knowledge/`: add a short note on dark mode + animation utilities if you standardize those.

## Additional worthwhile recommendations (from parallel audit)
These are optional/low-risk refinements that align with best practices:

- **Remove unused `class-variance-authority`** if it is not referenced anywhere in `frontend/src/`. It is a React-oriented helper and not needed when using `tailwind-variants` in Svelte.
- **Document shadcn-svelte CLI usage** for adding/updating components (e.g., `pnpm dlx shadcn-svelte@latest add <component>`), since you already maintain `components.json`.
- **Performance/clarity optimizations only if needed**: consider `$state.raw` for large immutable objects, `{@const}` for computed values inside `{#each}`, and `untrack()` when you need to read state inside effects without reactivity. These are not required today.

## References
- https://svelte.dev/docs/svelte/getting-started
- https://svelte.dev/docs/svelte/what-are-runes
- https://svelte.dev/docs/kit/introduction
- https://www.shadcn-svelte.com/docs/about
- https://www.shadcn-svelte.com/docs/installation/manual
- https://www.shadcn-svelte.com/docs/components-json
- https://tw3.shadcn-svelte.com/docs/dark-mode/svelte
- https://bits-ui.com/docs/getting-started
