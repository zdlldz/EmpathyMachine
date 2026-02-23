---
title: "User: Prompt Attachments & Discovery"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: done
icon: lucide:user
tags: user-docs, editorial, prompt-engine
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Guide for attaching files to AI prompts and exploring model capabilities.
---

# Prompt Attachments

## Overview
You can now attach files from your Media Library directly to AI prompts. Whether you're sending an image to ChatGPT for analysis or providing a seed image for a video generation, the system handles the heavy lifting of formatting and uploading your assets.

## Attaching Files
1. **Select File:** In the Prompt Editor, click the "Attach" button.
2. **Choose from Library:** Select any asset from your VFS (Local or Cloud).
3. **Validation:** The system automatically checks if the model supports your file type and size. If not, you'll get an immediate warning.

## Supported Models
- **OpenAI Chat:** Supports images (PNG, JPEG, WEBP, GIF) and text documents.
- **OpenAI Images (DALL-E):** Supports 1 seed image for edits/variations.
- **OpenAI Video (Sora):** Supports 1 source image for image-to-video generation.

## Power User: Model Exploration
Want to see what models are available and what they support? Use the CLI:
```bash
mm-cli prompt explore --provider openai
```
This command queries the provider in real-time and dumps a JSON map of all available models and their capabilities.
