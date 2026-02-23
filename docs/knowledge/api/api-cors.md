# GraphQL API CORS Configuration

## Overview

The GraphQL API server requires CORS (Cross-Origin Resource Sharing) middleware to handle browser preflight requests. Without it, browser fetch requests will fail with "Preflight response is not successful" errors.

## The Issue

When the frontend makes GraphQL requests using `fetch()` with custom headers (like `Authorization: Bearer <token>`), the browser sends an OPTIONS preflight request first. If the server doesn't handle OPTIONS requests properly, the browser blocks the actual request.

**Error symptoms:**
```
Preflight response is not successful. Status code: 405
Fetch API cannot load http://127.0.0.1:XXXXX/graphql due to access control checks.
```

## The Solution

Add CORS middleware using `tower-http` to the Axum router:

```rust
use tower_http::cors::{Any, CorsLayer};

let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);

let router = Router::new()
    .route("/graphql", post(graphql_handler).get(graphql_ws_handler))
    .layer(cors)
    .with_state(state);
```

## Why `Any` is Acceptable

Allowing all origins, methods, and headers is safe for this local-first app because:

1. **Local-only binding**: The API server only binds to `127.0.0.1` (localhost), not exposed to the network
2. **Local-first architecture**: This is a desktop app, not a web service exposed to the internet
3. **Browser requirements**: Even same-origin requests require CORS headers when using `fetch()` with custom headers

## Dependencies

Add to `backend/Cargo.toml`:

```toml
tower-http = { version = "0.6", features = ["cors"] }
```

## Related Files

- `backend/src/api/mod.rs` - API server setup with CORS middleware
- `backend/Cargo.toml` - Dependencies including `tower-http`
- `frontend/src/views/api-lab-view.svelte` - Frontend GraphQL client using `fetch()`

## See Also

- Axum CORS: https://docs.rs/tower-http/latest/tower_http/cors/
- MDN CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
