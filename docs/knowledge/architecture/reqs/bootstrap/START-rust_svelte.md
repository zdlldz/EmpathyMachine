# Project Brief: Modern Local-First App Starter Repository

## Objective

Create a **lightweight, production-grade starter repository** that serves as a reusable foundation for building many small, high-performance desktop apps. This repo should prioritize:

* Extreme performance
* Native-feeling UX
* Accessibility
* Maintainability
* Rapid, highly iterative development
* Long-term extensibility

This will be forked frequently, so it should represent a **best-in-class “starting line”** rather than a demo or prototype.

---

## Core Technology Stack

### Backend

* **Rust** (primary backend language)
* **SQLite** (local-first database)
* Highly componentized, DRY, modular architecture
* Designed for long-term iterative expansion

### Frontend

* **Svelte 5**
* **shadcn-svelte** UI components
* Strong accessibility defaults
* Emphasis on native-feeling performance and responsiveness

### App Shell / Distribution

* **Tauri**
* Focus on **Apple Silicon (macOS)** delivery initially
* Windows support planned but not implemented yet

---

## Architecture & Quality Goals

* Follow **current best practices** across all layers
* Use **only**:

  * Proven
  * Mainstream
  * Actively maintained
  * Highly regarded crates/libraries
* Avoid experimental or niche dependencies
* Favor performance, clarity, and explicit structure over cleverness

---

## Frontend Requirements

1. **Dashboard**

   * A simple dashboard view using shadcn-svelte
   * Similar in spirit to:
     [https://www.shadcn-svelte.com/examples/dashboard](https://www.shadcn-svelte.com/examples/dashboard)

2. **Settings UI**

   * Tab-based settings view
   * Opens as a **standalone dialog window** (not just a routed view)

3. **End-to-End “Hello World” Proof**

   * Editable input in the Settings view
   * Value is:

     * Persisted via backend + SQLite
     * Read back and displayed in the dashboard view
   * Purpose: verify **full frontend ↔ backend ↔ database ↔ frontend integration**

---

## Developer Experience & Tooling

### Local Development

* Fast, ergonomic local dev setup
* Hot reloading / hot compiling wherever possible
* Minimal friction for iterative development

### Testing

* CLI-capable testing across the stack
* Include intrinsic testing support (e.g. Playwright or equivalent)
* Designed to run easily via agents and CI

### Quality-of-Life Tooling

* Sensible defaults
* Clear scripts
* Predictable workflows
* Minimal setup burden for future forks

---

## Repository Setup

* Assume:

  * A **blank directory**
  * A Git repository already initialized
  * `main` branch checked out
* You have permission to:

  * Create all files
  * Run commands
  * Structure the repo as needed
* Implement:

  * Appropriate `.gitignore`
  * Git LFS if appropriate
  * Any environment/tooling files required for smooth development

---

## Documentation & Agent-Driven Development

### Documentation System

* Build a **standardized documentation process** into all workflows
* Documentation should scale with the project as it grows

### Agent Configuration

* Create a **stellar `agents.md`** at the project root
* Create equally strong **sub-agent files** for major directories, at minimum:

  * `frontend/`
  * `backend/`
* Assume:

  * All development is performed by agents and sub-agents like yourself
  * An experienced human remains in the loop for product guidance and hands-on testing
* Optimize the repo and workflows to **maximize agent effectiveness**, speed, and reliability

---

## Guiding Philosophy

Design your **ideal (“dream”) development environment** assuming:

* Long-term evolution
* Heavy agent participation
* Frequent iteration
* Multiple downstream forks
* Performance and clarity are non-negotiable

This starter should feel like a **professional internal platform**, not a tutorial.

---

## Questions & Clarifications

* Please ask **any and all questions** you feel are necessary before beginning.
* Clarifications are welcome and encouraged before execution.

Thanks — looking forward to building this foundation.