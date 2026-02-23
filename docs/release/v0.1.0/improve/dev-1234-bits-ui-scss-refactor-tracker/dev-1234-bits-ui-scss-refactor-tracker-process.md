# [DEV-1234] Refactor Coverage Tracker
Date: 2026-01-16

## Foundations
- [x] Remove Tailwind toolchain + config
- [x] Add portal roots per entrypoint
- [x] Wire BitsConfig defaults (portal + locale)
- [x] SCSS tokens
- [x] SCSS base/reset/typography
- [x] SCSS layout primitives
- [x] SCSS component layer
- [x] Theme transition + light/dark baseline
- [x] i18n locale sync with BitsConfig
- [x] Update `cn` helper + shared utilities

## Entry points
- [x] frontend/index.html
- [x] frontend/settings.html
- [x] frontend/window.html
- [x] frontend/components.html
- [x] frontend/src/main.ts
- [x] frontend/src/settings/main.ts
- [x] frontend/src/window/main.ts
- [x] frontend/src/components/main.ts

## Core components (non-UI wrappers)
- [x] frontend/src/lib/components/window-titlebar.svelte
- [x] frontend/src/lib/components/titlebar-tabs.svelte
- [x] frontend/src/lib/components/window-inset.svelte
- [x] frontend/src/lib/components/close-button.svelte
- [x] frontend/src/lib/components/save-indicator.svelte
- [x] frontend/src/lib/components/code-block.svelte

## Views + apps
- [x] frontend/src/App.svelte
- [x] frontend/src/settings/SettingsApp.svelte
- [x] frontend/src/window/WindowApp.svelte
- [x] frontend/src/components/ComponentsApp.svelte
- [x] frontend/src/components/component-preview.svelte
- [x] frontend/src/views/dashboard-view.svelte
- [x] frontend/src/views/hello-world-view.svelte

## Polish (2026-01-18)
- [x] Normalize sidebar label markup to `.sidebar-item__label` across app + settings for consistent icon-collapse
- [x] Titlebar tabs drag affordance + non-selectable text polish
- [x] Titlebar breadcrumb text non-selectable override
- [x] Global non-selectable text (inputs excluded) + tab drop indicator
- [x] Titlebar tab drag polish (drop highlight + scroller overflow tweak)
- [x] Swap typography stack to Inter Variable
- [x] Restore JetBrains Mono Variable for code/mono typography
- [x] Style audit: menu typography + tokenized spacing refinements
- [x] Style audit: base font sizing + menu/command sizing polish
- [x] Components Godmode previews: trigger child snippets + keyed loops cleanup
- [x] Components Godmode examples: align calendar/select/slider with Bits UI discriminated unions
- [x] Components Godmode examples: remove Tailwind-only badge snippet
- [x] Components Godmode sidebar preview: add trigger + menu icons for icon-collapse pattern
- [x] Components Godmode examples: add required accordion type
- [x] Components Godmode examples: use Button trigger snippets for popovers/menus/dialogs
- [x] Components Godmode carousel preview: rely on Bits UI track spacing (no overflow clip)
- [x] Components Godmode code blocks: shared Shiki highlighter + reactive updates
- [x] Components Godmode styles: accordion height transition + input-otp layout
- [x] Docs: register Bits UI LLM reference + update typography note
- [x] UI wrapper cleanup: remove remaining Tailwind class strings + add data-slot styles (calendar layout, select/menubar content, drawer overlay, navigation menu, tabs/radio/resizable)
- [x] Components polish: menu font sizing, select placeholder state, drawer header/title/footer example, base list reset
- [x] UX polish: titlebar tab drag ghost + sidebar collapse state synced via cookie defaults
- [x] UX polish: lenient tab reorder + inline sidebar width collapse consistency
- [x] UX polish: drag anchor offset to prevent gaps while reordering

## UI components (full coverage)
- [x] accordion
- [x] alert
- [x] alert-dialog
- [x] aspect-ratio
- [x] avatar
- [x] badge.svelte
- [x] breadcrumb
- [x] button
- [x] calendar
- [x] card.svelte + card-* parts
- [x] carousel
- [x] chart
- [x] checkbox
- [x] collapsible
- [x] command
- [x] context-menu
- [x] data-table
- [x] dialog
- [x] drawer
- [x] dropdown-menu
- [x] hover-card
- [x] input
- [x] input-otp
- [x] label.svelte
- [x] menubar
- [x] navigation-menu
- [x] pagination
- [x] popover
- [x] progress
- [x] radio-group
- [x] range-calendar
- [x] resizable
- [x] scroll-area
- [x] select
- [x] separator.svelte + separator
- [x] sheet
- [x] sidebar
- [x] skeleton
- [x] slider
- [x] sonner
- [x] switch
- [x] table
- [x] tabs
- [x] textarea
- [x] toggle
- [x] toggle-group
- [x] tooltip

## Components viewer visual QA checklist (pending)
- [ ] accordion
- [ ] alert
- [ ] alert-dialog
- [ ] aspect-ratio
- [ ] avatar
- [ ] badge
- [ ] breadcrumb
- [ ] button
- [ ] calendar
- [ ] card
- [ ] carousel
- [ ] chart
- [ ] checkbox
- [ ] collapsible
- [ ] command
- [ ] context-menu
- [ ] data-table
- [ ] dialog
- [ ] drawer
- [ ] dropdown-menu
- [ ] hover-card
- [ ] input
- [ ] input-otp
- [ ] label
- [ ] menubar
- [ ] navigation-menu
- [ ] pagination
- [ ] popover
- [ ] progress
- [ ] radio-group
- [ ] range-calendar
- [ ] resizable
- [ ] scroll-area
- [ ] select
- [ ] separator
- [ ] sheet
- [ ] sidebar
- [ ] skeleton
- [ ] slider
- [ ] sonner
- [ ] switch
- [ ] table
- [ ] tabs
- [ ] textarea
- [ ] toggle
- [ ] toggle-group
- [ ] tooltip

## Blocks (to be created)
- [x] Sidebar shells + layouts
- [x] Titlebar + tab strip blocks
- [x] Settings panels + sections
- [x] Card groups + grid layouts

## Docs + ADR
- [x] Update docs for Bits UI + SCSS workflow
- [x] Add ADR: docs/decisions/DEV-1234-bits-ui-scss.md

## Verification
- [x] cargo fmt --manifest-path backend/Cargo.toml
- [x] cargo test --manifest-path backend/Cargo.toml (2 ignored: Wry EventLoop main-thread)
- [x] pnpm -C frontend check
- [x] pnpm -C frontend i18n:check
- [ ] pnpm -C frontend test:e2e (blocked in sandbox: `chrome-headless-shell` MachPortRendezvousServer permission error)
