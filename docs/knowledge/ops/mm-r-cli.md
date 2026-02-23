# MM-R CLI Architecture
Tags: cli, backend, graphql, ratatui, docs

- CLI entrypoint is `backend/src/bin/mm_cli.rs`; command model lives in `backend/src/cli/args.rs`.
- Shared runtime/context lives in `backend/src/cli/context.rs` and reuses backend modules from `backend/src/lib.rs` (no duplicated business logic across bins).
- GraphQL command parity is implemented through direct schema execution (`ApiState::execute_request` / `execute_stream_request`) in `backend/src/api/mod.rs`, so query/mutation/subscription surfaces stay aligned with backend schema.
- Operation documentation is introspection-driven (`graphql operations` + `docs generate`), avoiding manual operation lists.
- Ratatui dashboard command is `mm-cli dashboard`; it polls health/jobs/events and supports keyboard controls (`q` quit, `r` refresh).

## Extension checklist
- Add/modify CLI arguments in `backend/src/cli/args.rs`.
- Implement behavior in a focused module under `backend/src/cli/`.
- If backend operation surface changes, regenerate docs:
  - `pnpm cli:docs`
- Update process/task docs and add knowledge notes when extension patterns change.
