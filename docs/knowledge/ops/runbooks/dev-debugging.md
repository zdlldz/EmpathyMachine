# Dev Debugging

Short checklists for the most common local dev issues.

## Settings window does not open
- Confirm dashboard console shows `Opening settings window` logs.
- If `isTauriRuntime()` is false, verify Tauri is running (`pnpm dev`) and rely on `window.isTauri` (global `__TAURI__` is disabled by default).
- Ensure `core:webview:allow-create-webview-window` exists in `backend/capabilities/default.json`.
- Confirm `frontend/settings.html` exists and is listed in `frontend/vite.config.ts` build inputs.

## Buttons do not respond
- For custom Svelte components, forward `onclick` props or re-dispatch DOM events with `createEventDispatcher()`.
- Keep button `type="button"` unless it is a form submit.

## Save fails / no DB writes
- Check SQLite SQL strings for missing spaces or syntax errors (UPSERT `SET` clause).
- Confirm the app data directory is created and writable.

## Logging
- Toggle “Verbose logging” in Settings; state persists in SQLite and localStorage.

## Grid performance sanity check
- Run `pnpm -C frontend test:e2e` and confirm `grid scroll stays responsive under load` passes (rAF sample).
- Use Cmd/Ctrl+Shift+F to enable the FPS overlay during manual scroll checks in the Grid view.
- Treat the FPS test as a regression guard, not a hard benchmark; compare relative drops before/after changes.
