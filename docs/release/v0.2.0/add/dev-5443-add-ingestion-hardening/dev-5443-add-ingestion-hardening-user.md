---
title: "User: Ingestion Performance & Tuning"
id: DEV-5443
category: add
slug: dev-5443-add-ingestion-hardening
status: done
icon: lucide:user
tags: user-docs, editorial, performance
author: agent-codex
version: v0.2.0
date: 2026-02-17
description: Guide for tuning media ingestion performance and understanding background progress.
---

# Ingestion Performance & Tuning

## Overview
We've upgraded the Media Library's ingestion system to handle massive batches of files with ease. Whether you're dropping 5 files or 500, the system now manages background processing efficiently, ensuring the application remains responsive throughout.

## High-Performance Ingestion
When you drop files into the app, a background orchestrator takes over. 
- **Concurrent Processing:** The app processes multiple files simultaneously to speed up the import.
- **Smart Progress:** A progress notification in the bottom-right corner keeps you informed of the total progress and any errors that might occur.

## Tuning Performance
Power users can now tune exactly how many files the system processes at once.
1. Open **Settings** -> **Preferences**.
2. Locate the **Ingestion Concurrency** slider.
3. **Low (1-4):** Recommended for older hardware or unstable network connections (R2/S3).
4. **Medium (5-10):** The default "Sweet Spot" for modern workstations.
5. **High (11-32):** Use this on powerful machines with high-speed SSDs and fiber connections to maximize throughput.

## Frequently Asked Questions
- **Q: Why does the progress stay at 0% for a few seconds?**
- **A:** For very large files, the system may spend time hashing the file or preparing the cloud connection before the first progress update.
- **Q: What happens if an ingestion fails?**
- **A:** The system will finish the rest of the batch and then show a summary notification detailing how many files failed to import.
