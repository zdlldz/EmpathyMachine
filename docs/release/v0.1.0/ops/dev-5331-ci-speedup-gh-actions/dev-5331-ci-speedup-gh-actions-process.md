# DEV-5331 - CI speedups (GitHub Actions)
Icon: tabler:rocket
Tags: ci, performance, github-actions
Date: 2026-01-28
Summary: Reduce CI wall-clock time with caching and E2E scoping. Adds Playwright browser caching, Chromium-only installs, and PR-based E2E gating while keeping manual runs intact.

## Goal
- Cut CI time for Rust builds and Playwright setup without changing runtime behavior.

## Scope
- GitHub Actions workflow changes only.
- Cache Rust artifacts and Playwright browsers.
- Run E2E only on main, manual runs, or relevant PR changes.

## Changes
- Added cargo registry/target caching and Playwright browser caching.
- Switched Playwright install to Chromium-only and set a stable browser cache path.
- Ensured Chromium headless shell is installed for Playwright runs.
- Set an absolute Playwright browser cache path to avoid CWD mismatches.
- Added PR path-based E2E gating and basic timing markers.

## Files touched
- `.github/workflows/ci.yml`
- `.gitignore`
- `docs/process/DEV-5331-ci-speedup-gh-actions.md`

## Validation
- Not run (workflow-only changes).

## Notes
- Playwright headless runs require the chromium-headless-shell binary.
- Use an absolute PLAYWRIGHT_BROWSERS_PATH to keep install and test steps aligned.
- Follow-up: consider Playwright sharding and sccache if CI remains slow.
