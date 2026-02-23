# Tauri Command Permissions

## Overview

Tauri v2 uses a two-step permission system for commands:
1. **Define permissions** in `backend/permissions/app.toml`
2. **Grant permissions** in `backend/capabilities/default.json`

Both steps are required for commands to work.

## The Two-Step Process

### Step 1: Define Permission (`backend/permissions/app.toml`)

Define the permission identifier and which commands it allows:

```toml
[[permission]]
identifier = "allow-get-api-endpoint"
description = "Allow reading the local GraphQL API endpoint."
commands.allow = ["get_api_endpoint"]
```

### Step 2: Grant Permission (`backend/capabilities/default.json`)

Add the permission identifier to the capabilities file so windows can use it:

```json
{
  "identifier": "default",
  "permissions": [
    "allow-get-api-endpoint",
    "allow-get-api-token"
  ]
}
```

## Common Error

**Error message:**
```
get_api_endpoint not allowed. Permissions associated with this command: allow-get-api-endpoint, default.
```

**Cause:** Permission is defined in `permissions/app.toml` but missing from `capabilities/default.json`.

**Fix:** Add the permission identifier to the `permissions` array in `capabilities/default.json`.

## Workflow Checklist

When adding a new Tauri command:

1. ✅ Define the command in `backend/src/commands.rs` with `#[tauri::command]`
2. ✅ Register the command in `backend/src/main.rs` with `tauri::generate_handler![]`
3. ✅ **Define permission** in `backend/permissions/app.toml`:
   - Add permission identifier to `[default]` permissions list
   - Create `[[permission]]` block with identifier, description, and `commands.allow`
4. ✅ **Grant permission** in `backend/capabilities/default.json`:
   - Add permission identifier to the `permissions` array

## Example: Adding a New Command

### 1. Define Command
```rust
// backend/src/commands.rs
#[tauri::command]
pub async fn my_new_command() -> Result<String, String> {
    Ok("Hello".to_string())
}
```

### 2. Register Command
```rust
// backend/src/main.rs
tauri::generate_handler![
    // ... other commands
    my_new_command
]
```

### 3. Define Permission
```toml
# backend/permissions/app.toml
[default]
permissions = [
    # ... other permissions
    "allow-my-new-command"
]

[[permission]]
identifier = "allow-my-new-command"
description = "Allow calling my new command."
commands.allow = ["my_new_command"]
```

### 4. Grant Permission
```json
// backend/capabilities/default.json
{
  "permissions": [
    // ... other permissions
    "allow-my-new-command"
  ]
}
```

## Related Files

- `backend/permissions/app.toml` - Permission definitions
- `backend/capabilities/default.json` - Permission grants for windows
- `backend/src/commands.rs` - Command implementations
- `backend/src/main.rs` - Command registration
- `backend/agents.md` - Backend workflow guide

## See Also

- Tauri v2 Security: https://v2.tauri.app/security/
- Tauri Capabilities: https://v2.tauri.app/guides/security/capabilities/
