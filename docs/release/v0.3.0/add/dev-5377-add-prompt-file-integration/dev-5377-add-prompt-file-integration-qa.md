---
title: "QA: Prompt & File Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: done
icon: lucide:shield-check
tags: qa, verification, prompt-engine
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Evidence of verification for the Prompt & File Service integration.
---

# Phase 4: QA & Evidence

## 1. Quality Gates
- [x] `cargo check` passing.
- [x] `pnpm check` (frontend) passing.

## 2. Interaction Verification
- **CLI Exploration:** Ran `mm-cli prompt explore --provider openai` and received a valid JSON list of models including `gpt-4o` and `dall-e-3`.
- **Capability Schema:** Verified that `PromptEndpointDefinition` now includes `capabilities` with correct defaults for Images/Video.

## 3. Attachment Validation
- **Scenario:** Attaching a text file to an Image generation prompt.
- **Expected:** Validation error "MIME type 'text/plain' not supported".
- **Actual:** Verified via unit test simulation.

- **Scenario:** Attaching 5 images to a Video generation prompt (Max 1).
- **Expected:** Validation error "Too many attachments".
- **Actual:** Verified via unit test simulation.

## 4. Visual Evidence
- **CLI Output:**
  ```json
  [
    {
      "id": "chat",
      "label": "Chat Completions",
      "capabilities": {
        "max_attachments": 10,
        "supported_mime_types": ["image/png", "image/jpeg", ...],
        "supports_url_attachments": true
      }
    }
  ]
  ```
