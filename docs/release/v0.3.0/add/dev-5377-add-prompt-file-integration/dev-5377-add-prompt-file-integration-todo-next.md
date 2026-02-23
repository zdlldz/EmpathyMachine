---
title: "To-Do Next: Prompt & File Service Integration"
id: DEV-5377
category: add
slug: dev-5377-add-prompt-file-integration
status: done
icon: lucide:fast-forward
tags: roadmap, todo, next-steps
author: agent-codex
version: v0.3.0
date: 2026-02-17
description: Actionable follow-up tasks for prompt capabilities, file integration, and architectural refinement.
---

# Phase 7: To-Do Next

## Immediate Follow-ups
- [ ] **[UX]** Add a "Capabilities" badge in the Prompt Editor UI showing supported file types/limits for the selected model.
- [ ] **[PERFORMANCE]** Cache `ApiExplorer` results in SQLite for 24 hours.

## Architectural Hardening (Code Hygiene)
- [ ] **[MAINTAINABILITY] Decompose `prompt_engine/mod.rs`:** The file has reached ~2500 lines. Split into `engine.rs` (core logic), `types.rs` (structs/enums), and `validation.rs` (merging current validator/deep_validator).
- [ ] **[MAINTAINABILITY] Refactor `storage/vfs.rs`:** Extract provider-specific logic and specialized queries (like Taxonomy) into a `backend/src/domain/storage/vfs/` directory structure.
- [ ] **[MAINTAINABILITY] Modularize GraphQL Schema:** Split `api/schema/files.rs` and `prompts.rs` into logical sub-modules (e.g., `files/queries.rs`, `files/mutations.rs`) to keep file sizes under 500 lines.

## Future Roadmap
- [ ] **Image Resizing:** Automatically resize images that exceed `max_image_dimensions` during the job execution phase (before sending to OpenAI).
- [ ] **Multipart Uploads:** Implement the `Files API` adapter for OpenAI to support PDF/Doc attachments for Retrieval-Augmented Generation (RAG).
