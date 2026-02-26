---
title: "Reviewer Run Sheet: EmpathyMachine V1"
id: 20260223
category: add
slug: 20260223-add-empathy-machine-bluesky-letta-bot-discovery
status: qa
icon: lucide:clipboard-check
tags: reviewer, qa, runbook, release
author: codex
version: v0.1.0
date: 2026-02-23
description: Fast, deterministic 10-minute reviewer checklist for validating EmpathyMachine V1 scaffold and hardening changes.
---

# 10-Minute Reviewer Run Sheet

## Goal
Validate architecture integrity, runtime safety, and release readiness with minimal setup.

## Prerequisites
- Node.js installed.
- Repository checked out locally.
- No credentials required for baseline local safety validation.

## 1) Install and Baseline (2 min)
```bash
npm install
cp .env.example .env
```

Expected:
- install succeeds
- `.env` exists

## 2) Quality Gates (2 min)
```bash
npm run typecheck
npm test
```

Expected:
- typecheck passes
- tests pass (`5/5`)

## 3) Runtime Safety Smoke (2 min)
```bash
npm run dev:cli -- run-once
npm run dev:cli -- status
```

Expected:
- no crash
- no-credentials mode reports safe no-op behavior
- status command returns valid summary

## 4) Observability Surface (2 min)
```bash
npm run dev:web
```

Open:
- `http://localhost:4173`
- `http://localhost:4173/health`

Expected:
- dashboard loads
- health endpoint returns `{ "ok": true }`
- page renders recent events safely

## 5) Architecture and Risk Checklist (2 min)
- [ ] Package boundaries are clear (`network`, `policy`, `sentiment`, `core-agent`, `event-log`).
- [ ] Worker has bounded behavior (`MAX_REPLIES_PER_TICK`) and idempotent skip logic.
- [ ] Retry/backoff exists for Bluesky network operations.
- [ ] Dead-letter/error events are present for per-event fault isolation.
- [ ] README matches actual commands and runtime flags.
- [ ] Process/planning/QA/PR docs are aligned.

## Optional Credentialed Validation (Extended)
Set in `.env`:
- `BLUESKY_IDENTIFIER`
- `BLUESKY_PASSWORD`
- optional: `LETTA_ENABLED=true` (+ Letta vars)

Then run:
```bash
npm run dev:cli -- run-once
npm run dev:cli -- tail-events 50
```

Expected:
- credentialed ingestion/publish paths execute without runtime errors
- audit events capture network, policy, and publish outcomes

## Reviewer Verdict
- **Approve now** if baseline checks pass and no design concerns remain.
- **Request changes** if any gate fails or docs do not match runtime behavior.
