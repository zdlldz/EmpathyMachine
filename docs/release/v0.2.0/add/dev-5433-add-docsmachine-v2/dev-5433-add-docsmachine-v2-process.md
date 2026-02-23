---
title: "Add: Docs Implementation"
id: DEV-5433
category: add
slug: dev-5433-add-docsmachine-v2
status: in-progress
icon: lucide:books
tags: docs, infrastructure, agentic-workflow, automation
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Formalizing and implementing the Docs documentation framework to ensure repeatable, high-quality, agent-driven documentation across all projects.
---

## Goal
- Standardize the documentation structure for high-density, enterprise-grade agentic development.
- Establish a repeatable "9-file payload" for every material task.
- Create robust templates for sequential task progression (Discovery -> PR -> Post-Mortem).
- Re-organize historical project documentation into the new categorical hierarchy.

## Approach
1. **Bootstrap Templates:** Create the core task templates in `docs/templates/` to allow for automatic scaffolding.
2. **Knowledge Resettlement:** Migrate archived `knowledge` and `decisions` into the new structured folders.
3. **Dogfooding:** Move current "Hardening" tasks into the `v0.2.0` release structure.
4. **Agentic Integration:** Prepare instructions for "PM" and "Linear" skills (P2).

---

## Implementation Plan

### Phase 1: Core Template Hardening
- [x] Create `docs/knowledge/architecture/docs.md`.
- [x] Create `docs/templates/task-bundle/` structure with standard 10-file payload.
- [x] Implement `_PM.md` (The Orchestrator's Master Plan).
- [x] Implement `discovery.md`, `planning.md`, `process.md`.
- [x] Implement `knowledge.md`, `qa.md`, `pr.md`.
- [x] Implement `post-mortem.md`, `todo-next.md`, `user.md`.

### Phase 2: Knowledge Migration
- [x] Map `docs/_archive/knowledge/*.md` to `docs/knowledge/[category]/*.md`.
- [x] Move `docs/_archive/decisions/*.md` to `docs/knowledge/architecture/adrs/`.
- [x] Create `index.md` for every knowledge subcategory.

### Phase 3: Project v0.2.0 Initialization
- [x] Backfill current task (DEV-5433) into the 10-file payload structure.
- [x] Move recent hardening tasks (DEV-5421, DEV-5422, DEV-5423) from `_archive/process` to `docs/release/v0.1.0/improve/`.
- [x] Standardize all v0.1.0 tasks with qualified `[slug]-process.md` filenames.

### Phase 4: Skill Spec & Automation (P2)
- [ ] Draft spec for `Skill: PM` (Kickoff, Generate, Next, Report).
- [ ] Draft spec for `Skill: Linear` (Update comments/threads per phase).
- [ ] Draft spec for `Skill: Notion` (Push user-docs to external platform).

# Phase 2: Implementation

## Current Focus
Mission Complete. Docs framework is fully transitioned and tidied.

## Checklist

### 1. Preparation
- [x] Verify environment
- [x] Sync configs (`pnpm sync:config`)

### 2. Implementation
- [x] Bootstrap Templates (Phase 1)
- [x] Migrate Knowledge (Phase 2)
- [x] Backfill v0.2.0 (Phase 3)

### 3. Polish & Cleanup
- [x] Refactor root documentation
- [x] Final Sanity Audit

## Technical Decisions (In Situ)
- **10-File Payload:** Officially added `todo-next.md` to the core task bundle to ensure roadmap continuity.
- **Bundle Model:** Grouped templates into `task-bundle` and `release-bundle` for easier scaffolding.
- **Resettlement Rule:** Mandated moving permanent findings from release history to global library.

---

## Technical Notes
- **Frontmatter Rule:** Mandatory for all files. Use `lucide:[icon]` for icons.
- **Slug Fallback:** If no Linear ID is available, use `YYYYMMDD-[category]-[slug]`.
- **Naming Convention:** `[slug]-[phase].md` (e.g. `dev-5433-add-docsmachine-v2-discovery.md`).
- **Release Source:** Use the version defined in `backend/Cargo.toml` as the folder name.

## Validation
- [x] All 10 templates exist and are documented.
- [x] `docs/knowledge` is fully populated from `_archive`.
- [x] A new task can be scaffolded in < 10 seconds using the templates.
