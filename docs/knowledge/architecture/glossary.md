---
title: "Architecture: Glossary"
id: 20260216
category: architecture
slug: 20260216-architecture-glossary
status: done
icon: lucide:book
tags: architecture, glossary, jargon
author: agent-codex
version: v0.2.0
date: 2026-02-16
description: Definitive list of project-specific terms and jargon to ensure clear communication across agentic and human teams.
---

# Glossary

## Core Terms
- **The Vault:** The secure backend layer (Rust) where sensitive data like API keys and secrets are stored. The frontend never has direct access to the Vault.
- **The Payload:** The standardized set of 10 markdown files required for every material task in DocsMachine v2.
- **Runes:** Svelte 5's primitive reactivity symbols (`$state`, `$derived`, etc.).
- **The Boundary:** The IPC (Inter-Process Communication) layer between the Rust backend and the Svelte frontend.

## Documentation Terms
- **Discovery:** Phase 0 of a task where historical context and technical hurdles are identified.
- **Post-Mortem:** The final phase of a task where the process is analyzed for improvements and roadmap items are captured.
- **Audit Trail:** The chronological history of tasks stored under `docs/release/[version]/`.

## Technical Terms
- **Newtype:** A Rust pattern for wrapping a primitive type in a struct to provide type safety (e.g., `struct Id(Uuid)`).
- **Typestate:** A pattern using the Rust type system to enforce valid state transitions.
