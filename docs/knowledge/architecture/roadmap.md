# Starter Roadmap

Living plan for evolving this starter into a durable app framework. Keep it practical and concise.

## Now (baseline hardening)
- Validate window presets + persisted state across macOS sizing scenarios.
- Add an in-app diagnostics panel (version info, DB path, migration status).
- Keep build + dev flow clean and predictable for new forks.

## Next (core platform capabilities)
- Search indexing (FTS5)
  - Define a minimal search service boundary.
  - Use SQLite FTS5 for local-first, fast queries when needed.
- Connections security
  - Move connection secrets to OS keychain (store references in SQLite).
  - Add opt-in redaction/masking for sensitive config fields in UI/API.
- Settings persistence enhancements
  - Remember last-viewed settings section.
  - Add optional settings snapshots/history.
- Structured migrations strategy with rollback metadata.
- App telemetry hooks (opt-in) for performance timing and error capture.
- Components view conditional rendering
  - Add logic to conditionally show/hide Components window based on environment or user permissions
  - Options: dev-only, superadmin-level access, or feature flag gating
  - Ensures component library reference is available in development but can be hidden in production builds

## Later (scalable defaults)
- Shared design tokens + theme system for multi-app reuse.
- Sync/replication strategy for multi-device use.

## Done
- Remove app menu bars for a clean, edge-to-edge window surface.
- Stabilize frontend <-> backend state flow (Settings -> dashboard refresh, logging).
- Feature flags + core domain modules.
- Window sizing presets + shortcuts + persistence.
