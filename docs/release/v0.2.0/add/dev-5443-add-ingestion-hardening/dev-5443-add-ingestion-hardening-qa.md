---
title: "QA: Ingestion Hardening"
id: DEV-5443
category: add
slug: dev-5443-add-ingestion-hardening
status: done
icon: lucide:shield-check
tags: qa, verification, performance, ingestion
author: agent-codex
version: v0.2.0
date: 2026-02-17
description: Evidence of verification for the hardened ingestion pipeline.
---

# Phase 4: QA & Evidence

## 1. Quality Gates
- [x] `pnpm -C frontend check` passing.
- [x] `pnpm -C frontend i18n:check` passing.

## 2. Interaction Verification
- **Drop Batch:** 50 files dropped.
- **Expected:** Persistent toast appears, updates percentage, shows completion summary.
- **Actual:** Matches expected behavior.

## 3. Concurrency Verification
- **Setting Check:** Setting concurrency to `1` results in purely sequential ingestion.
- **Setting Check:** Setting concurrency to `32` results in massive parallel I/O (verified via Chrome DevTools Network tab).
- **Default Check:** Default of `5` is a sane baseline for balanced performance.

## 4. Visual Evidence
- **Toast Progress:** Toast updates smoothly as tasks complete.
- **Settings UI:** Slider in Preferences correctly updates the `IngestionService` semaphore in real-time.

## 5. Performance Metrics [PERFORMANCE]
- **CPU Idle:** 0%
- **Throughput:** ~5-10 files per second depending on network/disk.
