---
title: "Namespaced i18n Strategy"
category: architecture
status: permanent
tags: i18n, scaling, frontend
author: agent-codex
---

# Namespaced i18n Scaling

As the application grows, a monolithic `messages.json` file becomes a bottleneck for development and causes merge conflicts. We have transitioned to a **Namespaced Directory Structure**.

## 1. Directory Structure
Locales are stored in `frontend/src/core/i18n/locales/[lang]/`.
Each feature or domain has its own `.json` file:
- `core.json`: Common UI elements.
- `nav.json`: Navigation labels.
- `media.json`: Media library specific strings.

## 2. Registration Pattern
Messages are merged in `frontend/src/core/i18n/messages.ts`:
```typescript
import enCore from './locales/en/core.json';
import enMedia from './locales/en/media.json';

const en = { ...enCore, ...enMedia };
```

## 3. Parity Enforcement
An automated script (`frontend/scripts/check-i18n.mjs`) ensures that all keys present in the `en` (English) source-of-truth files are also present in all other supported language files.

## 4. Key Benefits
- **Merge Conflict Reduction:** Developers can work on separate features without touching the same JSON file.
- **Lazy Loading:** Future optimizations can lazy-load specific namespaces to reduce bundle size.
- **Clarity:** Translation keys are naturally categorized by domain.
