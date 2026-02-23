---
title: "User: Hybrid Media Library Core"
id: DEV-5422
category: add
slug: dev-5422-add-file-service-api
status: done
icon: lucide:user
tags: user-docs, editorial, storage
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Editorial overview of the new Virtual File System and its "Sacred Source" architecture.
---

# Your Hybrid Media Library

The new **Virtual File System (VFS)** is the engine behind our non-destructive media workflow. It allows you to manage massive media libraries across your local machine and the cloud without ever worrying about losing an original file.

## Key Concepts

### 1. The Sacred Source
We follow an **Immutability Law**. When you import a file, the original bytes are kept sacred. Every edit or version you create becomes a "Permutation" in the file's lineage, allowing you to go back in time to any previous state.

### 2. Managed vs. External Storage
You have complete control over where your files live:
- **Managed:** The app copies the file into its own optimized storage. Great for portable projects.
- **External:** The app creates a "Symlink" to your file's current location. Great for large external drives where you don't want to duplicate data.

### 3. Smart Deduplication
If you import the same file twice, or if multiple projects share the same asset, the app is smart enough to store only one copy of the physical bytes while maintaining separate logical references. This saves massive amounts of disk space.

## Frequently Asked Questions
- **Q: Does this work with my external NAS?**
- **A:** Yes. Use the "External" ingestion policy to reference files on your network drive without copying them.
- **Q: Is it safe to delete the original file?**
- **A:** If you used "Managed" mode, yes. If you used "External" mode, the app needs that original file to remain at its path.
