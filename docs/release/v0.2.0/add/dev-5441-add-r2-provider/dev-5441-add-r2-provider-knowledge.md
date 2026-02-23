---
title: "Knowledge: R2 & AWS SDK"
id: DEV-5441
category: add
slug: dev-5441-add-r2-provider
status: done
icon: lucide:brain-circuit
tags: knowledge, aws-sdk, r2, rust
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Key learnings from integrating the AWS SDK for Rust with Cloudflare R2.
---

# Phase 3: Knowledge Capture

## 1. Discovered Patterns
- **Region Auto:** Cloudflare R2 requires the region to be set (often `auto` or `us-east-1` works best with the AWS SDK) to avoid signing errors.
- **Endpoint URL:** The `endpoint_url` must be the full account-specific R2 URL (e.g., `https://<accountid>.r2.cloudflarestorage.com`).

## 2. Gotchas
- **Hyper Versions:** `aws-sdk-s3` uses a specific version of `hyper` that can conflict with `axum`. We successfully navigated this by isolating the provider logic and using `ByteStream` adapters.
