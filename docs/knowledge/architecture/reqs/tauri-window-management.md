# Tauri window management
Icon: tabler:window-maximize
Tags: tauri, window, ux
Date: 2026-01-06
Summary: Overlay titlebars require drag regions and window state persistence is handled in Rust for the main window.

- Use `titleBarStyle: "Overlay"` in `backend/tauri.conf.json` and `titleBarStyle: 'overlay'` for JS-created windows.
- Use `transparent: true` for all JS-created windows (settings, utility, components, detached) so the window background toggle can reveal translucence.
- Enable `macOSPrivateApi` in `backend/tauri.conf.json` to allow transparent windows on macOS (required for translucence, not App Store safe).
- Keep `trafficLightPosition` in sync across main + JS-created windows (current inset: `x: 15`, `y: 20`).
- Titlebar layout uses CSS variables in `frontend/src/styles/app.scss` (`--titlebar-height`, `--titlebar-leading-inset`) to align content with macOS traffic lights.
- Titlebar visuals live with the components (`frontend/src/lib/components/window-titlebar.scss` and `frontend/src/lib/components/titlebar-tabs.scss`).
- Apply `app-drag` to header containers (and the main shell when using padded layouts) and `app-no-drag` to interactive controls.
- Force the native app theme to light with `setTheme('light')` so macOS renders light traffic lights regardless of in-app theme.
- Main shell layout uses `--gap-shell` plus the inline sidebar layout (`layout="inline"`) to keep titlebar + sidebar outside the scrollable view.
- Collapsed sidebar icon sizing is driven by CSS variables in `frontend/src/styles/app.scss` and tied to `--sidebar-width-icon`.
- Drag regions require `data-tauri-drag-region` on the clicked element and `core:window:allow-start-dragging` in `backend/capabilities/default.json`.
- Window presets rely on `setSize` + `center` and need `core:window:allow-set-size` + `core:window:allow-center`.
- Window state persistence lives in `backend/src/db.rs` + `backend/src/main.rs` (table: `window_state`).
- Window labels: `main` (dashboard), `settings` (settings.html), `utility` (window.html).
- Detached tab windows use the `detached-` label prefix; capabilities include `detached-*` to grant access.
- External docs links use `tauri-plugin-shell` (`@tauri-apps/plugin-shell`) with `shell:allow-open` in `backend/capabilities/default.json`.
- Menu events emit `open-settings` to the main window; the frontend opens the settings window and can emit `settings:navigate` to focus a section.
