# ADR 0005 - GraphQL API Stack

## Status
Accepted

## Context
The API backend needs a durable, type-safe GraphQL layer with subscriptions, async support, and a low-friction path to a future remote service. The stack must integrate cleanly with Tauri while remaining transport-agnostic at the domain layer.

## Decision
Adopt `async-graphql` with `axum` + `async-graphql-axum` for the GraphQL server. Use loopback HTTP on `127.0.0.1` with an ephemeral port and a short-lived bearer token provided via Tauri IPC for local auth. Subscriptions use GraphQL over WebSocket on the same endpoint.

## Consequences
- Provides a consistent API contract across local and future remote deployments.
- Enables subscriptions and DataLoader support with minimal additional infrastructure.
- Requires token handoff via Tauri IPC and explicit auth checks in both HTTP and WebSocket paths.
