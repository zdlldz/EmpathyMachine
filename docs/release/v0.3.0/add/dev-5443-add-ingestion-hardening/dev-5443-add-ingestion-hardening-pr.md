---
title: "PR: {{TITLE}}"
id: {{ID}}
category: {{CATEGORY}}
slug: {{SLUG}}
status: pr-pending
icon: lucide:git-pull-request
tags: pr, documentation, comms
author: {{AUTHOR}}
version: {{VERSION}}
date: {{DATE}}
description: Pull Request metadata, description, commit message drafts, and final checklist for QA handoff.
---

# Phase 5: Pull Request Prep

## 1. Summary
[High-level overview of the material changes and the business value.]

## 2. Commit History (Draft)
```text
{{CATEGORY}}: {{TITLE}} ({{ID}})
- Change 1
- Change 2
```

## 3. QA & Verification (Handoff)

### Evidence of Proof
- **Detailed QA Report:** `{{SLUG}}-qa.md`
- **Quality Gates:** [e.g., `pnpm check` and `cargo test` passing]

### Reproduction Steps
1.  [Step 1]
2.  [Step 2]
3.  **Reproduction Command:** \`[Insert command here]\`

### Risk Map (Blast Radius)
- **Primary:** [Specific components/services modified]
- **Secondary:** [Affected downstream dependencies or UI views]

## 4. QA Checklist
- [ ] **Functionality:** Verified the core feature/fix logic.
- [ ] **Edge Cases:** Verified handling of `null`, `Error`, and `Timeout`.
- [ ] **UI/UX:** Verified layout stability and "Golden Rule" alignment.
- [ ] **A11y:** Verified keyboard flow and ARIA state announcements.
- [ ] **Persistence:** Verified SQLite state survives restart.

## 5. Developer PR Checklist
- [ ] Code is DRY and componentized.
- [ ] No `.unwrap()`, `console.log`, or debug noise remains.
- [ ] Documentation resettled to `docs/knowledge/` (if permanent).
- [ ] `user.md` is complete and prosumer-ready.
