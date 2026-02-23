# Project Documentation

Welcome to the project documentation library. This system is designed for **High-Density Traceability** and **Agent-Driven Excellence**, ensuring that every material decision and feature implementation is documented for perpetuity.

## 1. Navigating the Library

### 🏗️ [Knowledge Base](./knowledge/)
Permanent project knowledge organized by domain.
- **[Architecture](./knowledge/architecture/):** System maps, ADRs, and core specifications.
- **[API](./knowledge/api/):** GraphQL conventions and integration patterns.
- **[Styles](./knowledge/styles/):** Design system tokens and SCSS patterns.
- **[Ops](./knowledge/ops/):** CLI tooling and deployment runbooks.

### 📜 [Audit Trail](./release/)
The chronological history of every material task, organized by release version. 
- Each task produces a **10-File Payload** (Discovery, Planning, Process, QA, etc.) providing a complete record of how and why changes were made.

### 🤖 [Agent Protocols](./agents.md)
Specialized instructions for AI agents operating within this documentation framework.

## 2. Developer Workflow

### Starting a Task
Documentation is part of the feature. When starting a material task (DEV-ID):
1.  **Scaffold:** Create a folder in the current release directory using the [Task Bundle](./templates/task-bundle/).
2.  **Document:** Follow the sequential phases (Discovery -> Planning -> Implementation).
3.  **Resettle:** Upon PR completion, move any permanent knowledge discovered into the `knowledge/` library.

Refer to the **[Scaffolding Guide](./templates/README.md)** for exact commands.

## 3. Core References
- **[System Map](./knowledge/architecture/system-map.md):** How the parts connect.
- **[Glossary](./knowledge/architecture/glossary.md):** Project-specific jargon.
- **[Documentation Spec](./knowledge/architecture/docs.md):** The technical laws of this system.
