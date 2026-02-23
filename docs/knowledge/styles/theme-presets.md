# Theme presets
Icon: tabler:palette
Tags: theme, presets, styling, scss
Date: 2026-01-17
Summary: Theme presets use OKLCH CSS variables plus a `data-theme` attribute on `:root`.

- Preset values live in `frontend/src/styles/themes/_presets.scss` under `:root[data-theme="..."]` and `:root.dark[data-theme="..."]`.
- Global transition speed uses `--transition-duration` in `frontend/src/styles/_tokens.scss` (default 200ms).
- The UI toggle list is defined in `frontend/src/core/theme.ts` (`THEME_PRESETS`).
- Persisted key: `theme_preset` in `frontend/src/core/settings.svelte.ts`.
- Initial paint avoids a light-mode flash by preloading theme + preset in `frontend/index.html`, `frontend/settings.html`, and `frontend/window.html`.
- To add a new preset: copy an existing light/dark block in `frontend/src/styles/themes/_presets.scss`, add the preset to `THEME_PRESETS`, and update docs if the list changes.
- Keep tokens complete (`--background`, `--foreground`, `--destructive-foreground`, `--sidebar-*`, `--chart-*`) so Bits UI wrappers remain consistent.
