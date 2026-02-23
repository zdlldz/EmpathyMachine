# ADR 0002 - Rust Toolchain Pin

## Status
Accepted

## Context
Tauri v2 and its transitive dependencies may require newer Cargo features. The starter should avoid build failures caused by outdated Cargo versions.

## Decision
Pin the Rust toolchain to `1.92.0` via `rust-toolchain.toml`.

## Consequences
- Developers using rustup automatically install the pinned toolchain.
- CI stays aligned with local builds.
- When upgrading, update this ADR and the toolchain file together.
