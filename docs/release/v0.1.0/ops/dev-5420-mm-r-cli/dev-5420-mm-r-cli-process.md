# [DEV-5420] - MM-R CLI
Icon: tabler:terminal-2
Tags: backend, cli, ratatui, dx
Date: 2026-02-13
Summary: Add a first-class CLI with backend/frontend parity for settings and GraphQL operations, plus a ratatui dashboard and generated command documentation pipeline.

## Goal
- Provide a durable, high-DX CLI that can drive all backend operations and settings with a clean, extensible command model.
- Establish a documentation pipeline that derives command/operation references from the source of truth.

## Scope
- In scope:
- New Rust CLI binary with shared backend runtime and modular command handlers.
- Settings/file parity commands (settings, avatar, database export).
- Full GraphQL operation access via CLI (query/mutation/subscription execution path).
- Ratatui real-time dashboard for health/jobs/events.
- Generated CLI command documentation and operation catalog.
- Process/task/knowledge docs.
- Out of scope:
- Frontend wiring for CLI entrypoints.
- New backend business features unrelated to CLI parity.

## Plan
1. Create a shared backend module surface so app, smoke, and CLI binaries reuse core logic.
2. Add modular CLI architecture (`args`, `context`, `graphql`, `dashboard`, `docs`, `output`).
3. Implement parity commands for settings and filesystem operations.
4. Implement complete GraphQL execution surface and introspection-based operation catalog.
5. Add ratatui dashboard and command-doc generation pipeline.
6. Run quality gates and finalize docs.

## Lightweight Tracker
- [x] Process doc + task index entry
- [x] Shared backend refactor for multi-bin reuse
- [x] CLI command model + parity operations
- [x] Ratatui dashboard
- [x] Ratatui dashboard polish + screenshot evidence
- [x] Command docs generator + generated artifact
- [x] Validation gates

## Changes
- Added shared backend library surface in `backend/src/lib.rs` so app, smoke binary, and CLI reuse one module graph.
- Added shared app operations module `backend/src/app_ops.rs` for avatar/database filesystem behavior reused by Tauri commands and CLI.
- Added reusable DB init entrypoint `db::connect_at_dir` to support non-Tauri runtimes.
- Added direct GraphQL execution/stream support on `ApiState` for CLI parity across queries, mutations, and subscriptions.
- Added first-class CLI binary `mm-cli` with modular architecture:
- `backend/src/cli/args.rs` command and flag model.
- `backend/src/cli/context.rs` runtime/bootstrap model.
- `backend/src/cli/graphql.rs` generic operation execution + introspection catalog.
- `backend/src/cli/dashboard.rs` ratatui real-time dashboard.
- `backend/src/cli/docs.rs` generated markdown pipeline.
- `backend/src/cli/output.rs` shared output renderer.
- Added `api serve` command to expose authenticated local GraphQL endpoint/token for automation/dev tooling.
- Added generated command reference artifact: `docs/knowledge/cli-commands.md`.
- Added durable knowledge note: `docs/knowledge/mm-r-cli.md`.
- Polished ratatui dashboard UX in `backend/src/cli/dashboard.rs`:
- color-coded status badges for health/job/event states;
- clearer empty-state rendering for jobs/events;
- adaptive event list density based on viewport height;
- unicode-safe string truncation to avoid slicing panics in terminal rendering.
- Updated root scripts with `pnpm cli:docs`.
- Refined CLI DX:
- split `graphql execute` vs `graphql subscribe` argument surfaces so execute no longer exposes subscription-only flags.
- fixed `graphql operations --with-args` to behave as a true boolean flag.
- Added CLI unit tests for settings parse and GraphQL type-signature rendering.
- Updated app binary command wiring via thin wrapper commands in `backend/src/main.rs` (preserves Tauri macro compatibility).
- Refactored `backend/src/bin/wry_smoke.rs` to consume shared library modules (removed path-based module duplication).
- Added `Default` for `Id` in `backend/src/shared/ids.rs` (required for `clippy -D warnings` gate).
- Updated root and agent docs with CLI usage + maintenance guidance.
- Added CLI testing/doc-gen guidance to `docs/knowledge/testing.md`.
- Rehydrated workspace dependencies (`pnpm install --frozen-lockfile --force`) to restore missing frontend font symlink and revalidated frontend e2e.
- Removed stale frontend reference-submodule residue from local git metadata and workspace (`frontend/src/references` plus stale `.git/config` and `.git/modules/frontend/*` entries), keeping only active `references/MediaMachine`.

## Files touched
- `docs/process/DEV-5420-mm-r-cli.md`
- `docs/tasks.md`
- `backend/Cargo.toml`
- `backend/src/lib.rs`
- `backend/src/main.rs`
- `backend/src/app_ops.rs`
- `backend/src/db.rs`
- `backend/src/api/mod.rs`
- `backend/src/commands.rs`
- `backend/src/shared/ids.rs`
- `backend/src/bin/wry_smoke.rs`
- `backend/src/bin/mm_cli.rs`
- `backend/src/cli/mod.rs`
- `backend/src/cli/args.rs`
- `backend/src/cli/context.rs`
- `backend/src/cli/output.rs`
- `backend/src/cli/graphql.rs`
- `backend/src/cli/dashboard.rs`
- `backend/src/cli/docs.rs`
- `package.json`
- `README.md`
- `agents.md`
- `backend/agents.md`
- `.gitignore`
- `docs/knowledge/cli-commands.md`
- `docs/knowledge/mm-r-cli.md`
- `docs/knowledge/README.md`
- `docs/knowledge/testing.md`

## Validation
- `cargo fmt --manifest-path backend/Cargo.toml`
- `cargo test --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `cargo run --manifest-path backend/Cargo.toml --bin mm-cli -- --help`
- CLI smoke on temp app dir:
- `settings set/get`
- `graphql operations --with-args`
- `api serve --timeout-secs 1`
- `docs generate --out docs/knowledge/cli-commands.md`
- `pnpm cli:docs` (clears and recreates `.tmp/mm-cli-docs` before generation for deterministic migration state)
- `pnpm -C frontend check` (passes `svelte-check`)
- `pnpm -C frontend test:e2e` (12/12 passed)
- Backend test summary after CLI additions: `46 passed, 0 failed, 2 ignored`.
- Post-cleanup frontend verification: `pnpm -C frontend check` runs clean with no stale reference-config warnings.
- Final CLI smoke (temp app dir):
- `graphql operations --with-args --output json`
- `graphql execute --query "query { health { queueDepth at } }" --output json`
- `settings set/get` roundtrip.
- Dashboard polish validation:
- `cargo build --manifest-path backend/Cargo.toml --bin mm-cli`
- `backend/target/debug/mm-cli --app-dir /tmp/cli-shot-idle3 dashboard --refresh-ms 1200 --limit 8`
- `backend/target/debug/mm-cli --app-dir /tmp/cli-shot-loaded2 dashboard --refresh-ms 1200 --limit 8`
- `backend/target/debug/mm-cli --app-dir /tmp/cli-shot-ops2 graphql operations --with-args --output json`

## Screenshot Evidence
- `/tmp/cli-dashboard-idle-v3.png` (idle dashboard state)
- `/tmp/cli-dashboard-loaded-v2.png` (active jobs/events with status colors)
- `/tmp/cli-operations-output-v3.png` (CLI GraphQL operations output slice)

## Notes
- Keep implementation DRY and minimal: one shared runtime model, reusable output formatting, and generated docs to reduce drift.
- Command/operation docs should be regenerated with `pnpm cli:docs` whenever command model or GraphQL surface changes.
