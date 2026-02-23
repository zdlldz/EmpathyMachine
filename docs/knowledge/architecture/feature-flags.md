# Feature flags
Icon: tabler:flag-2
Tags: config, tooling
Date: 2026-01-06
Summary: Feature flags are config-driven and generated for both frontend and backend via the sync script.

- Source-of-truth: `config/features.json` with boolean values under `flags`.
- Run `pnpm sync:config` to regenerate `frontend/src/lib/feature-flags.ts` and `backend/src/feature_flags.rs`.
- Use flags to gate experimental UI or backend behavior without branching the codebase.
