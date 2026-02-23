---
title: "PM: Prompt & File Service Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: done
icon: lucide:paperclip
tags: pm, prompt-engine, vfs, ai, integration
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Macro-orchestrator for connecting the Prompts API with the VFS, enabling file attachments, capabilities schemas, and dynamic model discovery.
---

# Task Orchestrator (PM)

## Status Board
| Phase | File | Status |
| :--- | :--- | :--- |
| **0. Discovery** | `dev-5377-add-prompt-file-integration-discovery.md` | ✅ complete |
| **1. Planning** | `dev-5377-add-prompt-file-integration-planning.md` | ✅ complete |
| **2. Implementation** | `dev-5377-add-prompt-file-integration-process.md` | ✅ complete |
| **3. Knowledge** | `dev-5377-add-prompt-file-integration-knowledge.md` | ✅ complete |
| **4. QA** | `dev-5377-add-prompt-file-integration-qa.md` | ✅ complete |
| **5. PR** | `dev-5377-add-prompt-file-integration-pr.md` | ✅ complete |
| **6. Post-Mortem** | `dev-5377-add-prompt-file-integration-post-mortem.md` | ✅ complete |
| **7. To-Do Next** | `dev-5377-add-prompt-file-integration-todo-next.md` | ✅ complete |
| **8. User Docs** | `dev-5377-add-prompt-file-integration-user.md` | ✅ complete |

## Task Goal
Bridge the `Prompts API` and `File Service` (VFS) to enable attaching arbitrary files (images, docs, code) to AI prompts. Implement a "Capabilities Schema" to manage model-specific constraints (e.g., max images, dimensions) and a "Dynamic API Explorer" to validate provider capabilities.

## Critical Milestones
- [x] **Discovery:** Map OpenAI capabilities (Chat, Vision, Video) and reference legacy TS implementation.
- [x] **Architecture:** Define the `ModelCapability` and `ConnectionSchema` structs.
- [x] **Tooling:** Build the `ApiExplorer` utility for dynamic endpoint mapping.
- [x] **Backend:** Implement file attachment logic in `PromptEngine`.
- [x] **Integration:** Wire VFS blobs to OpenAI multipart/JSON payloads.
- [x] **Verification:** Prove end-to-end flow with an Image-to-Text or Text-to-Video prompt using a VFS asset.

## Comms & Linear Sync
- [ ] Linear Ticket Linked: [DEV-5377]
- [ ] Phase 0 Report Posted
- [ ] Implementation Report Posted
- [ ] Completion Report Posted
