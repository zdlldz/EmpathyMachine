# Documentation System

This repo treats documentation as a first-class artifact. All material changes require a small doc update.

## Structure
- `docs/decisions/` Architecture Decision Records (ADRs)
- `docs/runbooks/` Operational workflows and recurring tasks
- `docs/_start/` Project briefs and early-stage references
- `docs/knowledge/` Grep-friendly technical notes and learnings
- `docs/roadmap.md` Shared planning and roadmap notes
- `docs/tasks.md` Task index for active/closed work
- `docs/process/` Task process docs (one per work item)

## Workflow
- New feature or behavior change: update or create a short doc.
- Architecture or dependency change: add an ADR.
- Operational workflow: add or update a runbook.

## Conventions
- Keep docs terse and actionable.
- Prefer checklists for repeatable processes.
- Link from code comments only when the doc is stable.
- See `docs/runbooks/dev-debugging.md` for local troubleshooting notes.
- Process + knowledge docs should follow the frontmatter format in `docs/process/template.md`.

## Quick index
- `docs/roadmap.md` product + platform roadmap
- `docs/tasks.md` task status index
- `docs/knowledge/` learnings and debugging notes
- `docs/process/` per-task process docs
- `docs/process/template.md` process doc template
