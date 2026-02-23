---
title: "Architecture: System Map"
id: 20260216
category: architecture
slug: 20260216-architecture-system-map
status: done
icon: lucide:map
tags: architecture, map, overview
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: High-level technical map explaining the connections between frontend, backend, and persistence layers.
---

# System Map

## Visual Architecture
```mermaid
graph TD
    subgraph Frontend [Shell - Svelte 5]
        UI[User Interface]
        Runes[$state, $derived, $effect]
        Query[useQuery Cache]
        Windows[useWindowManager]
    end

    subgraph Boundary [IPC Layer]
        Cmds[Tauri Commands]
        Events[Tauri Events]
        GQL[GraphQL Over HTTP/WS]
    end

    subgraph Backend [Core - Rust]
        Tauri[Tauri v2 Runtime]
        AsyncGQL[async-graphql]
        Domain[Domain Logic]
        SQLx[SQLx Pool]
        Jobs[Concurrent JobRunner]
    end

    subgraph Persistence [Data Layer]
        SQLite[(SQLite Database)]
    end

    UI --> Runes
    Runes --> Query
    Query --> GQL
    UI --> Windows
    Windows --> Cmds
    GQL --> AsyncGQL
    AsyncGQL --> Domain
    Cmds --> Domain
    Domain --> SQLx
    Domain --> Jobs
    SQLx --> SQLite
    Jobs --> SQLx
    Tauri --> Events
    Events --> UI
```

## High-Level Overview
This project is a local-first desktop application built with **Tauri v2**, **Rust**, and **Svelte 5**.

### 1. The Core (Backend)
- **Language:** Rust
- **Framework:** Tauri v2
- **Persistence:** SQLite via SQLx
- **API:** GraphQL (async-graphql) served via Axum
- **Logging:** Structured tracing via the `tracing` crate

### 2. The Shell (Frontend)
- **Language:** TypeScript / Svelte 5
- **Reactivity:** Svelte 5 Runes ($state, $derived, $effect)
- **UI Primitives:** Bits UI + Standardized wrappers (ViewShell, PropertyRow)
- **Styling:** SCSS with a tokenized design system

### 3. The Boundary (IPC)
- **Commands:** Strongly typed Rust functions invoked from the frontend.
- **Events:** Asynchronous message passing from Rust to Frontend (e.g., settings updates).
- **Security:** Scoped permissions and capabilities defined in `backend/capabilities/`.

## Maintenance & Regeneration
To ensure this map remains "The Source of Truth," use the following tools to audit the actual codebase structure:
- **Backend Audit:** `cargo modules generate graph`
- **Frontend Audit:** `npx depcruise --output-type mermaid src`
- **Tidiness Check:** `fd --max-depth 2`

