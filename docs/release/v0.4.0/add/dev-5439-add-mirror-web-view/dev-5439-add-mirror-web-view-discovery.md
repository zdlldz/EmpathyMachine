---
title: "Discovery: The Mirror Architecture"
id: DEV-5439
category: add
slug: dev-5439-add-mirror-web-view
status: complete
icon: lucide:search
tags: discovery, portability, cross-platform
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Deep-dive into the technical requirements and trade-offs for supporting a standalone web client alongside the native Tauri app.
---

# Phase 0: Discovery

## 1. The Strategy: "The Mirror"
The goal is to move from a **Native-Locked** app to a **Platform-Agnostic Core** with native and web "Shells."

### The Linear Model
Like Linear, the native app remains the "First-Class" experience (performance, system deep-linking, multi-window). The web view acts as a "Thin Client" (accessibility from any URL, zero-install, easier collaboration).

## 2. UI-Agnostic Audit: Pros & Cons

| Aspect | Pros | Cons |
| :--- | :--- | :--- |
| **Maintainability** | Single source of truth for business logic. 100% DRY views. | Requires an abstraction layer (Platform Service). |
| **Testability** | **Agent Velocity:** Agents can test UI in browsers in seconds without Tauri build overhead. | Native-only bugs (e.g. Wry glitches) still require native testing. |
| **Portability** | Ready for Cloud/SaaS deployment from Day 1. | Initial setup takes longer than "just calling Tauri APIs." |
| **Architecture** | Forces strict DDD (Domain-Driven Design) and clean boundaries. | Slightly more boilerplate for cross-boundary data (GraphQL vs direct IPC). |

### What are we "Losing"?
We are losing **"Naive Simplicity."** In a native-only app, you can tightly couple UI to the OS. By decoupling, we must think about "Environment Capabilities" (e.g., "Is `fs` available? If not, use `upload`").

## 3. Step Zero: The Fundamental Foundation
Before "The Mirror" can be fully implemented, several core services must be matured to provide a platform-agnostic substrate.

### A. The File Service API (Primary Dependency)
The most significant hurdle is the "Local File Wall." 
- **Requirement:** A unified File Service that manages I/O, Caching, and Metadata.
- **Strategy:** Abstract storage via a `StorageProvider` trait in Rust.
    - **Local Provider:** Handles direct disk access and **Symlink** logic (mapping external local files into the app's scope).
    - **Cloud Provider:** Integrates with the Connections API (e.g., Cloudflare R2).
- **Benefit:** The UI never asks for a "Path"; it asks for an "AssetID." The backend returns a `protocol-asset://` URL in Tauri or a `https://` URL in Web.

### B. Identity & Multi-Tenancy
The current "Local Identity" bootstrap is designed for a single-user native app.
- **Requirement:** Mature the Auth layer to support standard Session/JWT flows.
- **Strategy:** Ensure the `RequestContext` in GraphQL can handle both local-machine identity and remote-authenticated sessions.

### C. The Signal Layer (Real-time Sync)
Native Tauri events are "free" and low-latency.
- **Requirement:** Standardize on **GraphQL Subscriptions** (WebSockets) for all real-time state updates (Job progress, Settings changes).
- **Strategy:** Ensure the `EventBus` in Rust is fully wired to the WebSocket transport in the standalone Axum server.

## 4. Technical Hurdle Analysis (Revised)

### A. The Boundary (IPC vs. HTTP)
- **Native:** Frontend -> `invoke()` -> Rust Handler.
- **Web:** Frontend -> `fetch()` -> Standalone Axum Server.
- **Solution:** Standardize on **GraphQL** as the primary data rail. Use Tauri Commands ONLY for purely native OS interactions (window resizing, system trays).

### B. The "Local File" Wall
- **Addressed by Step Zero:** The File Service API eliminates this by providing a unified URL-based asset resolver.

### C. Windowing Parity
- **Native:** Multi-window, transparent, tab detaching.
- **Web:** Single Page App (SPA) limited to one browser tab.
- **Solution:** Use an `AppEnv` flag. If `web`, the "Detach" and "Transparency" features are automatically hidden/disabled in the UI.

## 5. Feature Parity Matrix (Revised)

| Feature | Tauri (First-Class) | Web (Thin Client) | Primary Rail |
| :--- | :--- | :--- | :--- |
| **Media Playback** | Local/Direct | Streamed/Cloud | File Service |
| **Asset Metadata** | Disk Info | Database/API | File Service |
| **Multi-window** | Native Windows | Single Tab (SPA) | Platform Service |
| **State Sync** | Local Events | WebSockets | Subscriptions |
| **Settings** | Standalone Window | Modal/View | Settings Rune |
| **Auth** | Machine Key | Session/JWT | Auth Service |

## 6. Risks & Unknowns
- **Symlink Performance:** How does the File Service handle thousands of symlinked assets in a web context? 
- **Standalone Mode:** Can the Rust backend run securely as a public-facing server without additional proxies?
- **Agent Sandbox:** Can agents successfully run a standalone backend server without the Tauri runtime environment? (This is a major DX goal).

