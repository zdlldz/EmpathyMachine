---
title: "Discovery: CLI Application Expansion"
id: DEV-5420
category: improve
slug: dev-5420-cli-expansion
status: complete
icon: lucide:search
tags: discovery, research, cli
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Gap analysis between CLI capability and current backend features.
---

# Phase 0: Discovery

## 1. Context Gathering
- **Current State:** CLI covers Settings, Avatar, Database export, and raw GraphQL.
- **Missing Coverage:**
  - VFS Listing & Navigation.
  - Media Ingestion (Local & Folder).
  - Taxonomy Management (Tags/Collections).
  - Metadata inspection & Rating updates.

## 2. Intent vs. Reality
- **Intent:** CLI should be a first-class control surface for all backend operations.
- **Reality:** Feature drift in v0.2.0 and v0.3.0 has left the CLI behind.

## 3. Findings & Risks
- **[ARCHITECTURE]** `ApiState` fields are private; need public accessors for CLI use.
- **[DURABILITY]** Migration checksums must be managed carefully when using the CLI in dev environments.
