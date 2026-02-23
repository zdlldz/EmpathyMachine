---
title: "User: Cloud Storage (R2)"
id: DEV-5441
category: add
slug: dev-5441-add-r2-provider
status: done
icon: lucide:user
tags: user-docs, editorial, guide
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Guide to configuring Cloudflare R2 for hybrid storage.
---

# Cloud Storage

You can configure the application to store assets in Cloudflare R2. This allows you to access your media library from multiple devices and keeps your local disk space free.

## Configuration
Set the following environment variables or app settings:
- `STORAGE_R2_BUCKET`: Your bucket name.
- `STORAGE_R2_ACCESS_KEY_ID`: Your R2 Access Key.
- `STORAGE_R2_SECRET_ACCESS_KEY`: Your R2 Secret Key.
- `STORAGE_R2_ENDPOINT`: Your R2 API Endpoint.

## Hybrid Mode
The system handles "Hybrid" storage automatically. You can ingest files locally for speed, or push them to R2 for archival.
