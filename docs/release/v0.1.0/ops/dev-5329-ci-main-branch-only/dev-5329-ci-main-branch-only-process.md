# [DEV-5329] - CI main-branch triggers only
Icon: tabler:cloud-check
Tags: ci, github-actions
Date: 2026-01-28
Summary: Limit CI to runs for pushes to main and PRs targeting main to reduce background automation load while preserving coverage on the default branch.

## Goal
- Reduce CI churn from non-main branches while keeping validation on main-bound changes.

## Scope
- Update GitHub Actions triggers for the CI workflow.
- No changes to the actual test steps or tooling.

## Changes
- Restrict CI workflow triggers to pushes on `main` and PRs targeting `main`.

## Files touched
- `.github/workflows/ci.yml`

## Validation
- Not run (CI configuration change only).

## Notes
- Consider branch protection on `main` to ensure CI coverage before merges.
- Optional follow-up: add `workflow_dispatch` for manual CI runs.
- Optional follow-up: add path filters to skip frontend/backend checks on unrelated changes.
- Optional follow-up: split e2e into a separate workflow triggered by label or on a nightly schedule.
