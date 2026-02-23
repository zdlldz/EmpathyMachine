# [DEV-5305] - i18n foundation
Icon: tabler:language
Tags: frontend, i18n, settings
Date: 2026-01-07
Summary: Added a lightweight, dependency-free i18n layer with Settings integration, translations for all UI text, and automated parity checks + tests.

## Goal
- Provide a durable, low-complexity localization system for all user-facing text.
- Default to system language when supported, fall back to English.

## Scope
- Frontend translation catalog and runtime helper.
- Settings integration + UI language selector.
- Playwright coverage for all supported locales.

## Changes
- Added `messages.json` + typed helpers to store translations and locale options.
- Implemented `i18n.svelte.ts` for locale resolution and `t()` interpolation.
- Added `language` setting with persistence + Settings UI controls.
- Replaced all user-facing strings with translation keys.
- Added `i18n:check` script and a dynamic Playwright locale test.

## Files touched
- `frontend/src/core/i18n/messages.json`
- `frontend/src/core/i18n/messages.ts`
- `frontend/src/core/i18n.svelte.ts`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/core/theme.ts`
- `frontend/src/lib/window-presets.ts`
- `frontend/src/App.svelte`
- `frontend/src/settings/SettingsApp.svelte`
- `frontend/src/window/WindowApp.svelte`
- `frontend/src/lib/components/close-button.svelte`
- `frontend/src/lib/components/save-indicator.svelte`
- `frontend/src/lib/components/ui/breadcrumb/breadcrumb.svelte`
- `frontend/src/lib/components/ui/breadcrumb/breadcrumb-ellipsis.svelte`
- `frontend/src/lib/components/ui/dialog/dialog-content.svelte`
- `frontend/src/lib/components/ui/sheet/sheet-content.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-rail.svelte`
- `frontend/src/lib/components/ui/sidebar/sidebar-trigger.svelte`
- `frontend/tests/dashboard.spec.ts`
- `frontend/tests/i18n.spec.ts`
- `frontend/scripts/check-i18n.mjs`
- `frontend/package.json`
- `docs/knowledge/i18n.md`
- `docs/knowledge/testing.md`
- `docs/knowledge/settings-persistence.md`
- `docs/knowledge/README.md`
- `docs/tasks.md`
- `README.md`
- `agents.md`
- `frontend/agents.md`

## Validation
- Not run (structural changes only).

## Notes
- Chose a JSON-based catalog + tiny helper over `sv add paraglide` to avoid extra dependencies.
- If new languages are added, update `LANGUAGE_OPTIONS` so Settings exposes them.
