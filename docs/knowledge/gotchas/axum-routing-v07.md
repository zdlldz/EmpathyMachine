---
title: "Axum v0.7+ Routing Syntax"
category: gotchas
tags: backend, rust, axum, routing
author: agent-codex
---

# Axum v0.7+ Routing Syntax

When upgrading to Axum v0.7 or later (including v0.8+), the syntax for path capture groups has changed.

## The Gotcha
Previously, Axum used the colon syntax for path parameters (e.g., `:id`). Starting with v0.7, this syntax is deprecated and will cause a runtime panic if not handled correctly.

**Error Message:**
`Path segments must not start with :. For capture groups, use {capture}.`

## The Fix
Replace all colon-prefixed parameters with curly-braced parameters.

**Old Syntax (v0.6 and below):**
```rust
.route("/v1/asset/:id", get(handler))
```

**New Syntax (v0.7+):**
```rust
.route("/v1/asset/{id}", get(handler))
```

## Exceptions
If you literally mean to match a segment starting with a colon, you must call `.without_v07_checks()` on the router, although this is rarely the desired behavior for capture groups.
