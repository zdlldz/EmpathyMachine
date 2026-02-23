# ADR 0003 - Window State Persistence

## Status
Accepted

## Context
We want a native-feeling desktop UX where the main window reopens at the last size and position. This requires storing window geometry between launches without adding new dependencies.

## Decision
Persist main-window size and position in SQLite using a `window_state` table. Update the record on move/resize events with a small throttle, and restore it on window creation.

## Consequences
- Adds a new SQLite table (`window_state`) and related read/write helpers.
- Window persistence is centralized in `backend/src/main.rs` and can be expanded to other window labels later.
- Future migrations should include this table if schema evolution tooling is introduced.
