# Tauri + Svelte Debugging
Icon: tabler:bug
Tags: tauri, svelte, sqlite, debugging
Date: 2026-01-06
Summary: Quick debugging notes for Tauri + Svelte integration pitfalls.

- Svelte 5 component wrappers should forward `onclick`/`oninput` props via rest spread; use `createEventDispatcher()` only when you need `on:click` compatibility.
- In Svelte 5 runes mode, use `$state` for reactive locals and `$props`/`$bindable` for component props; avoid `$$restProps` and legacy `on:` handlers where possible.
- `$derived` must receive a function (e.g. `$derived(getAvatarSrc)`), not a computed value (`$derived(getAvatarSrc())`).
- Prefer avoiding `bind:this` in UI wrappers unless a consumer truly needs a ref; keep components lean and let Svelte attachments/actions handle edge cases.
- Tauri v2 runtime detection should use `window.isTauri` or `isTauri()`; `__TAURI__` is not available by default.
- SQLite UPSERT statements require spacing in multi-line SQL strings (e.g., `SET value = ...` not `SETvalue`).
- Settings window creation needs `core:webview:allow-create-webview-window` in `backend/capabilities/default.json` and `settings.html` in Vite inputs.
- Local file images loaded via `convertFileSrc` require `asset:` in `img-src` CSP and `assetProtocol` scoped to `$APPLOCALDATA/**` (`backend/tauri.conf.json`).
- If you see `effect_update_depth_exceeded`, look for `$effect` blocks that read and write the same state; avoid two-way sync loops by keeping a single source of truth.
