---
title: "User: Streaming Media"
id: DEV-5441
category: add
slug: dev-5441-add-asset-resolver
status: done
icon: lucide:user
tags: user-docs, editorial, guide
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Guide for developers on how to securely stream assets from the VFS.
---

# Streaming Media Assets

The Asset Resolver allows you to stream video and display images from the Virtual File System.

## URL Structure
`GET /v1/asset/:id`

## Authentication
You must provide a valid session token.
- **Header:** `Authorization: Bearer <token>` (Recommended for API calls)
- **Query:** `?token=<token>` (Recommended for `<img>` and `<video>` tags)

## Video Scrubbing
The endpoint supports standard HTTP `Range` requests. You can seek to any point in a video file, and the server will return only the requested bytes.
