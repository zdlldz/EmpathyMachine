---
title: "Architecture: Documentation Specification"
id: 20260216
category: ops
slug: 20260216-ops-docs-spec
status: done
icon: lucide:blueprint
tags: architecture, docs, standards
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: The definitive specification for the project's documentation framework, ensuring repeatable, high-quality, agent-driven documentation.
---

# Documentation Specification

Docs is an opinionated documentation framework designed for enterprise-grade, agent-driven software development. It prioritizes historical auditability, structured knowledge retrieval, and machine-readable metadata.

## 1. Core Principles
- **Release-First Audit Trail:** All task documentation is nested under the release version where the task was completed.
- **Categorical Knowledge:** Permanent project knowledge is organized by domain, not by the task that generated it.
- **Mandatory Metadata:** Every file starts with a standardized YAML frontmatter block for indexing and automation.
- **Template Discipline:** Agents must use official templates to ensure consistency across the codebase.

## 2. Structural Hierarchy

### `docs/templates/`
The "Armory" containing the canonical templates for tasks and releases.

### `docs/knowledge/`
The "Library" organized by domain:
- `architecture/`: High-level system design and ADRs.
- `api/`: GraphQL schemas, endpoints, and authentication.
- `styles/`: CSS/SCSS patterns and UI tokens.
- `ops/`: CLI tools, deployment, and developer workflows.
- `gotchas/`: Common pitfalls and their resolutions.
- `qa/`: Testing strategies and quality gates.

### `docs/release/[version]/[category]/[slug]/`
The "Audit Trail." Every material task must produce a folder containing the **10-File Payload**.
Categories: `add`, `improve`, `fix`, `ops`, `qa`.

## 3. The 10-File Payload
Every task folder contains these specific files, named using the format `[slug]-[phase].md`:

1.  **`_PM.md`**: The master orchestrator (e.g., `_dev-1234-add-feature-PM.md`).
2.  **`discovery.md`**: Research and context gathering.
3.  **`planning.md`**: Architecture and solution comparisons.
4.  **`process.md`**: Granular implementation checklist.
5.  **`knowledge.md`**: Specific "Gotchas" or patterns discovered.
6.  **`qa.md`**: Testing evidence and proof of success.
7.  **`pr.md`**: PR description and commit drafts.
8.  **`post-mortem.md`**: Process reflection and process debt.
9.  **`todo-next.md`**: Actionable roadmap items and follow-ups.
10. **`user.md`**: Prosumer-style documentation.

## 4. Metadata (Frontmatter)
Standardized YAML block mandatory for all `.md` files:

```yaml
---
title: "[Task Title]"
id: [DEV-ID or YYYYMMDD]
category: [add | improve | fix | ops | qa]
slug: [full-slug]
status: [planning | in-progress | qa | pr-pending | done]
icon: lucide:[icon-slug]
tags: [comma, separated, tags]
author: [agent-id]
version: [target-release]
date: [YYYY-MM-DD]
description: [1-2 sentence overview]
---
```

## 5. Naming Conventions
- **Linear Fallback:** If no Linear ID is available, use the date: `YYYYMMDD`.
- **Full Slug:** `[id]-[category]-[task-slug]` (e.g., `dev-1234-add-new-feature`).
- **Filenames:** `[slug]-[phase].md` (e.g., `dev-1234-add-new-feature-discovery.md`).
