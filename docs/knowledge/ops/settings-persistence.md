# Settings persistence
Icon: tabler:database-cog
Tags: settings, storage, tauri, svelte
Date: 2026-01-06
Summary: Settings are cached locally and persisted via SQLite, with cross-window updates via events.

- Source of truth: `frontend/src/core/settings.svelte.ts` (`settings`, `updateSetting`, `saveStatus`).
- Persistence uses `get_settings`/`set_settings` in `backend/src/commands.rs`.
- Save flow: update localStorage, emit `settings-preview` for immediate cross-window UI, debounce writes, emit `settings-updated` on success.
- Theme application lives in `frontend/src/core/theme.ts` (mode + preset).
- Stored keys: `hello_message`, `theme`, `theme_preset`, `language`, `logs_enabled`, `avatar_path`, `output_directory`.
