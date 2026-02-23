---
title: "User: MM-R CLI Pro-Power"
id: DEV-5420
category: improve
slug: dev-5420-cli-expansion
status: complete
icon: lucide:user
tags: user-docs, editorial, cli, devops
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Power-user guide for managing media and metadata via the command line.
---

# CLI Pro-Power Guide

## Overview
The `mm-cli` tool is a first-class control surface for power users and automation. In v0.3.0, we've added full support for the Media Ecosystem.

## 1. Media Ingestion
Ingest files or full directories directly from your terminal.
```bash
# Ingest a single file
mm-cli vfs ingest ~/Photos/vacation.jpg --managed

# Ingest a full folder recursively
mm-cli vfs ingest-folder ~/Photos/2025 --managed --depth 0
```

## 2. Taxonomy Management
Manage your Tags (`#`) and Collections (`!`) without opening the UI.
```bash
# List all tags
mm-cli taxonomy list --kind tag

# Create a new collection
mm-cli taxonomy create collection "Project Alpha" --color "#FF0000"

# Link a file to a taxonomy
mm-cli taxonomy add <NODE_ID> <TAXONOMY_ID>
```

## 3. Metadata & Ratings
Inspect and evaluate assets via terminal.
```bash
# Get all metadata for an item
mm-cli metadata get <NODE_ID>

# Set a 5-star rating
mm-cli metadata set-rating <NODE_ID> 5
```

## 4. Automation
Use `--output json` to pipe data into other tools (like `jq`).
```bash
mm-cli vfs list --output json | jq '.[].name'
```
