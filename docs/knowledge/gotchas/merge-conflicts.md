# Merge conflict hygiene
Icon: tabler:git-merge
Tags: git, workflow, docs
Date: 2026-02-01
Summary: Simple practices to reduce merge conflicts, especially around shared index files and settings.

- Sync early and often: `git fetch origin` + `git rebase origin/main` before editing shared files.
- Keep task index edits append-only and deterministic (new rows at the end, no reordering).
- Batch index updates in a single commit or delegate index edits to one person/agent.
- Favor short-lived branches and small PRs to reduce overlap windows.
- Use topic-specific files when possible to avoid touching shared files unless necessary.
