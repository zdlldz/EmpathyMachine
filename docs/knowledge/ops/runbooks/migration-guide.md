---
title: "Runbook: Migration to DocsMachine v2"
id: 20260216
category: ops
slug: 20260216-ops-migration-runbook
status: done
icon: lucide:arrow-right-left
tags: ops, migration, standards
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Operational guide for transitioning historical project documentation into the DocsMachine v2 framework.
---

# Runbook: Documentation Migration

Use this guide to normalize a legacy documentation folder into the DocsMachine v2 categorical hierarchy.

## 1. Preparation
1.  **Backup:** Move all current docs to `docs/_archive/`.
2.  **Initialize:** Copy the `release-bundle` to create the current version structure (e.g., `docs/release/v0.1.0/`).
3.  **Library Setup:** Ensure `docs/knowledge/` subfolders exist (`architecture`, `api`, `styles`, `ops`, `gotchas`, `qa`).

## 2. The Move Protocol

### A. Permanent Knowledge
**Rule:** If it defines *how* the system works (ADRs, Specs, Guidelines), move it to the **Library**.
- **ADRs:** `docs/_archive/decisions/*.md` -> `docs/knowledge/architecture/adrs/`
- **Specs:** `docs/_archive/REQS_*.md` -> `docs/knowledge/architecture/reqs/`
- **Runbooks:** `docs/_archive/runbooks/*.md` -> `docs/knowledge/ops/runbooks/`

### B. Historical Process
**Rule:** If it tracks a *task* (DEV-1234, Fix X), move it to the **Audit Trail**.
- `docs/_archive/process/[ID]-[task].md` -> `docs/release/[version]/[category]/[id]-[task]/[id]-[task]-process.md`

## 3. Standardization (Hydration)
For every moved file:
1.  **Prepend Frontmatter:** Add the mandatory YAML block (see `docs/knowledge/architecture/docs.md`).
2.  **Qualified Naming:** Ensure the filename is prefixed with the task slug.
3.  **Cross-Linking:** Update internal links to point to the new relative paths.

## 4. Cleanup
- Once the migration is verified, delete `docs/_archive/`.
- Regenerate indices using the standard `index.md` templates.
