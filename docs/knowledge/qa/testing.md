# Testing (Playwright + Rust)
Icon: tabler:test-pipe
Tags: testing, playwright, rust, tauri
Date: 2026-01-17
Summary: Test structure and recommended coverage for the starter.

## Playwright (frontend)
- Location: `frontend/tests/`
- Config: `frontend/playwright.config.ts` (dev server + baseURL)
- Run: `pnpm -C frontend test:e2e` (auto-sets Apple Silicon override)
- First-time setup: `pnpm -C frontend exec playwright install` (downloads browsers).
- Current tests:
  - `frontend/tests/dashboard.spec.ts`
    - `dashboard renders` (smoke)
    - `sidebar can collapse to icons` (desktop toggle)
    - `settings opens in a new window` (popup flow)
    - `settings theme controls update the document` (mode + preset)
    - `hello message persists across reload` (local storage)
    - Uses `data-testid="open-settings"` for the Settings trigger.
  - `frontend/tests/i18n.spec.ts`
    - `settings localizes labels for all supported locales`
    - Iterates `SUPPORTED_LOCALES` from `frontend/src/core/i18n/messages.ts`.
  - `frontend/tests/grid.spec.ts`
    - `grid virtualizes large datasets` (DOM stays small with 1k+ items)
    - `grid column count persists after reload`
    - `grid search updates result count`
    - `grid scroll stays responsive under load` (samples rAF FPS during scroll)
  - `frontend/tests/styles-wiring.spec.ts`
    - `styles wiring (main + settings)` (asserts a few computed styles to catch missing SCSS imports)

### Adding new Playwright tests
- Prefer `data-testid` for stable selectors.
- Cover critical flows first (settings, window presets, dialog flows).
- Keep tests fast; avoid network or file system dependencies when possible.

Recommended next tests:
- Settings persistence: change Hello message, reload, verify persisted value.
- Sidebar: verify tooltip behavior when collapsed.
- Window presets: trigger shortcut and confirm size state (web-only with a stub).
- Settings navigation: verify active section highlights and URL section query.
- i18n smoke: ensure language options are present in Settings > Preferences (covered by `i18n.spec.ts`).
- Styles wiring: assert a few critical components render with expected computed styles per entrypoint (e.g. Button background, Sidebar item state, Dialog content padding) to catch missing SCSS imports.

### Playwright troubleshooting (macOS)
- `pnpm -C frontend test:e2e` now applies a best-effort Apple Silicon override automatically via `frontend/scripts/playwright-run.mjs`.
- If Playwright still looks for `chrome-headless-shell-mac-x64`, set `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=mac15-arm64` manually (replace `mac15` with your macOS major version from `sw_vers -productVersion`).
- If `chrome-headless-shell` fails with `MachPortRendezvousServer` permission errors, run E2E on a full macOS host or switch the Playwright config to use `channel: "chromium"` for the test project (slower but avoids headless shell).

## API lab checks (manual)
- Source: `frontend/src/views/api-lab-view.svelte`.
- Current checks: health, viewer, auth guard, connection types, connection lifecycle (create → validate → archive).
- Add plugin-specific checks as new connection types land (e.g., CDN browse, DB list).

## Rust / backend tests
- Unit tests: co-locate in `backend/src/` modules for domain logic.
- Integration tests: add under `backend/tests/` for DB + command wiring.
- Run: `cargo test --manifest-path backend/Cargo.toml`
- CLI docs/regression gate: `pnpm cli:docs` (regenerates `docs/knowledge/cli-commands.md` from live command tree + schema).
- Tauri IPC tests require the `tauri` crate `test` feature (enabled via dev-dependencies).
- Manual Wry smoke (macOS-friendly): `cargo run --manifest-path backend/Cargo.toml --bin wry_smoke`
  - Uses a unique app identifier per run and cleans up temp/app data directories.
  - Requires `default-run = "starter"` in `backend/Cargo.toml` so `tauri dev` still works when multiple bins exist.

### Backend testing strategy
- Commands that need `AppHandle` should delegate to helper functions that accept `app_dir`/`Path`.
- Unit-test those helpers with temp dirs to avoid Wry runtime integration.
- Use `tauri::test` (MockRuntime) for IPC tests on commands that only require `State`.
- Wry runtime smoke tests exist but are ignored on macOS due to main-thread event loop requirements.
- Use `wry_smoke` on macOS to validate AppHandle flows on the main thread.
- Add Wry runtime integration tests only when a real window/runtime is required.
- Current tests:
  - `backend/src/db.rs`
    - `settings_roundtrip` (settings insert + filter)
    - `settings_empty_and_update` (empty set + update)
    - `window_state_roundtrip` (window state insert + lookup)
  - `backend/src/commands.rs`
    - `normalize_extension_accepts_supported` (allowed avatar extensions)
    - `normalize_extension_rejects_missing_extension`
    - `normalize_extension_rejects_unknown_extension`
    - `ipc_get_settings_empty` (invoke get_settings via IPC)
    - `ipc_set_get_settings_roundtrip` (invoke set + get via IPC)
    - `save_avatar_impl_copies_file` (avatar copy via helper)
    - `export_database_impl_copies_file` (export happy path)
    - `export_database_impl_rejects_empty_path` (validation)
    - `export_database_impl_requires_source_db` (missing db)
    - `wry_save_avatar_uses_app_dir` (Wry AppHandle smoke test)
    - `wry_export_database_writes_file` (Wry AppHandle smoke test)
  - `backend/src/cli/mod.rs`
    - `parse_settings_entries_accepts_key_value_pairs`
    - `parse_settings_entries_rejects_missing_separator`
  - `backend/src/cli/graphql.rs`
    - `render_type_signature_handles_non_null_list`

Recommended next tests:
- Settings serialization (boolean/string handling).
- Command wiring for settings + window state (integration tests using a temp DB).

## Test hygiene
- Keep reference submodules out of test discovery.
- Prefer minimal, deterministic datasets.
- Run `pnpm -C frontend i18n:check` (or `pnpm -C frontend build`) to validate translation key parity.

## Macro testing
- Include API lab checks (including connections lifecycle) in the macro smoke suite.
- Add a standard connection plugin checklist to the macro runbook as new plugins land.
