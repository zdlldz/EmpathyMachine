# ADR 0004 - Titlebar Tabs Architecture

## Status
Accepted

## Context
The app needs a durable, performant tab system in the titlebar that can open any view in new tabs, preserve per-tab state, and persist tab order per window. The existing single-view layout was not designed for multiple live view instances or tab persistence.

## Decision
Introduce a tab manager in the frontend (`frontend/src/core/tabs.svelte.ts`) and a centralized view registry (`frontend/src/core/views.ts`). Render tabs in the titlebar (`frontend/src/lib/components/titlebar-tabs.svelte`) and keep inactive tabs mounted but hidden to preserve local component state. Persist tabs per window using the existing settings storage backend with a `tabs_state.<windowId>` key, controlled by a new `persistTabs` user setting.

## Consequences
- Tabs now maintain per-window order, active state, and scroll position, improving continuity across sessions when enabled.
- Memory usage increases because inactive tabs stay mounted; future virtualization can be added if needed.
- The settings surface gains a new toggle for tab restoration, and new i18n keys are required.
