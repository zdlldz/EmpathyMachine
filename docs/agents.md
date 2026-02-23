# Documentation Agents

You are in the **Docs** ecosystem. This system ensures high-density, enterprise-grade audit trails for every material change in the project.

## 1. Documentation Index
- **[Docs Orchestrator](./agents/agent-docs.md):** Guidance for managing task folders and the 10-file payload.
- **[System Spec](./knowledge/architecture/docs.md):** The technical law governing frontmatter, slugs, and folder hierarchy.
- **[The Armory](./templates/README.md):** Scaffolding commands for Releases and Tasks.

## 2. Core Missions
1.  **Permanent Knowledge:** Maintain the domain libraries in `docs/knowledge/`.
2.  **Audit Trail:** Ensure every completed PR is documented under its respective release in `docs/release/`.
3.  **Accuracy:** Reconcile all "claimed intent" in process docs against the "verified reality" of the code implementation.

## 3. Workflow
When starting a task, identify your Linear ID (or date) and category, then scaffold your task folder using the templates in `docs/templates/task-bundle/`.
