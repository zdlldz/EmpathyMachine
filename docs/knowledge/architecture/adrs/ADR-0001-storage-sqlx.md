# ADR 0001 - SQLite Access via SQLx

## Status
Accepted

## Context
The app needs high-throughput local persistence with a minimal, mainstream dependency set and a clear path to async execution.

## Decision
Use `sqlx` with SQLite and a small async connection pool. Configure WAL journaling and NORMAL sync for performance. Use embedded SQLx migrations for schema evolution.

## Consequences
- Async DB access integrates cleanly with Tauri's async runtime.
- WAL provides improved write concurrency for local-first workloads.
- Migrations are embedded via SQLx to keep packaging deterministic.
