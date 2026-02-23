# Prompt connection routing
Icon: tabler:route
Tags: prompt-engine, connections, routing, defaults
Date: 2026-02-12
Summary: Deterministic connection selection and defaulting rules for Prompt Engine provider execution.

## Selection precedence
- Use explicit `connection_id` from prompt input when provided.
- Otherwise resolve endpoint-scoped default (`provider_id` + `endpoint_id`).
- Otherwise resolve provider-wide default (`provider_id`, no endpoint).
- Otherwise optionally allow env fallback only when setting `prompt_engine_allow_env_fallback` is enabled.
- Otherwise reject prompt creation with validation error.

## Runtime policy
- Production behavior requires resolved connection from Connections API.
- Env credentials are fallback-only, disabled by default, and lower-priority than Connections.

## OpenAI compatibility rule
- OpenAI prompts require an OpenAI connection (`connection_type = openai`).
- OpenAI connection config supports:
  - `api_key` (shared)
  - `image_api_key` (optional override)
  - `video_api_key` (optional override)
- Validation requires at least one of these key fields.

## Storage contract
- Defaults are stored in `prompt_connection_defaults`.
- Provider-wide defaults are stored with empty endpoint key (`endpoint_id = ''`).
- Endpoint-specific defaults use concrete endpoint IDs.

## Notes
- Batch runs inherit the resolved parent prompt connection.
- Per-variant connection overrides are intentionally deferred.
