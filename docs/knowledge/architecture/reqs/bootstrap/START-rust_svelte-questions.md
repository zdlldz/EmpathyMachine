# Agent <> Human in loop - Questions + Answers

## via gpt-5.2-codex-high

> Before I start scaffolding the repo, a few clarifications so I can match your expectations exactly:

1. Do you want Tauri v2 (current) or Tauri v1 for maximum stability?
2. Preferred frontend tooling: SvelteKit or Svelte 5 + Vite (non-SvelteKit)?
3. Package manager preference: pnpm, npm, or bun?
4. App name/identifier (for Tauri bundle ID, Rust crate name, and database filename)?
5. Should we include CI config (GitHub Actions) out of the gate, and if so, target macOS only for now?
6. Any specific testing stack preference (e.g., Playwright vs. WebdriverIO), or should I pick Playwright as the default?

---

We want to optimize for **most modern + most performant + fewest core dependencies**:

1. **Tauri v2 vs v1**

* **Tauri v2**. It’s the forward path and the better fit for a “starter that will be forked for years.”
* Stability is good enough for a starter, and we can keep surface area small by sticking to core APIs and avoiding plugin sprawl.

2. **SvelteKit vs Svelte 5 + Vite**

* **Svelte 5 + Vite (non-SvelteKit)**.
* Rationale: SvelteKit adds routing/server concepts you don’t need for a local-first Tauri app, plus extra conventions and dependencies. Vite is the leanest, fastest dev loop.

3. **Package manager**

* **pnpm**.
* Fast, deterministic, great monorepo ergonomics if we later add packages, and widely adopted. Keeps node_modules lean.
* (If “fewest moving parts” beats “best tooling,” npm is the simplest default—but for modern DX/perf, pnpm wins.)

4. **App name/identifier**

* Best default without overthinking:

  * **App name (human):** `Starter`
  * **Rust crate:** `starter`
  * **Bundle ID:** `com.yourorg.starter` (placeholder)
  * **DB file:** `starter.sqlite`
* If you want a “fork-friendly” approach: make these **single-source-of-truth** via one config file (e.g., `app.config.ts` or `./config/app.toml`) and generate/consume where needed.

5. **CI (GitHub Actions)**

* **Yes**, include it out of the gate.
* Target **macOS (Apple Silicon)** only for now:

  * Lint/format + unit tests (Rust + frontend)
  * Playwright smoke test (headless) if feasible in CI
  * Optional: build artifact (unsigned) to validate packaging pipeline
* Keep the workflow minimal and fast; expand to Windows later.

6. **Testing stack**

* **Playwright** by default.
* It’s the best “few dependencies / maximum reliability” E2E option right now, works well with Vite/Svelte, and is straightforward to run via CLI and CI.

If you want the absolute leanest baseline, we can start with:

* Rust unit/integration tests (`cargo test`)
* Frontend unit tests only if needed
* Add Playwright as the single E2E layer (no extra runner complexity)

But if we’re going “dream pipeline,” Playwright as the one E2E tool is the cleanest choice.

---

## Follow-up clarifications

1. **Repo layout**
   * Use agent defaults. Prefer a real `backend/` crate with Tauri config pointed at it.

2. **Single-source config**
   * Use a single config file + sync script (agent default). No extra dependencies.

3. **SQLite crate choice**
   * Use the best long-term, high-throughput option with minimal dependencies.
   * Selected: `sqlx` (async pool) with WAL + NORMAL sync defaults.

4. **Frontend styling**
   * Tailwind is desired; also include an SCSS pipeline for custom styles.

5. **License**
   * None (private repo).

6. **Rust toolchain**
   * Request: use latest stable (noted as 1.9.2).
   * Decision: pin to `1.92.0` in `rust-toolchain.toml`.

7. **Typography**
   * Use Inter variable everywhere via `@fontsource-variable/inter`.
   * Import in the Svelte entrypoints and apply globally in `tailwind.css`.

8. **Frontend logging**
   * Provide a persistent “Verbose logging” toggle in Settings.
   * Defaults to enabled in dev, stored in local storage.

9. **Settings access**
   * Settings open in a standalone window from the dashboard button.
   * Menu bar removed by default (DEV-5301); no Preferences item.

10. **Window management**
   * macOS titlebar set to overlay with drag/no-drag regions for edge-to-edge windows.
   * Window presets (Cmd/Ctrl+1/2/3) and persisted main-window size/position via SQLite.

11. **Feature flags**
   * Config-driven flags live in `config/features.json`, generated to frontend/backend modules.

12. **Domain scaffolds**
   * Backend domain modules live in `backend/src/domain/`.
   * Frontend core modules live in `frontend/src/core/`.

---

## Debug learnings (Jan 2026)

* Svelte 5 custom components must forward DOM events (e.g., `click`) via `createEventDispatcher()` or `on:click` will silently fail.
* Tauri v2 does not expose `window.__TAURI__` by default; use `window.isTauri`/`isTauri()` or `__TAURI_INTERNALS__` for runtime detection.
* SQLite UPSERT strings must preserve whitespace (e.g., `SET value = ...`); missing spaces cause `SETvalue` syntax errors.
* Settings window creation requires `core:webview:allow-create-webview-window` and a `settings.html` entry in Vite inputs.
