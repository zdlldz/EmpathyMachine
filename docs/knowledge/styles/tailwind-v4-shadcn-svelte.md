# Tailwind v4 + shadcn-svelte wiring (deprecated)
Icon: tabler:brand-tailwind
Tags: deprecated, tailwind, shadcn, styling
Date: 2026-01-17
Summary: Legacy reference for the pre-DEV-1234 Tailwind setup. The starter now uses a Bits UI + SCSS pipeline.

- Tailwind and shadcn-specific wiring were removed in DEV-1234.
- Current styles live in `frontend/src/styles/main.scss` with `_tokens.scss`, `_base.scss`, `themes/_presets.scss`, and `app.scss`.
- Theme presets live in `frontend/src/styles/themes/_presets.scss`; transition tokens remain in `frontend/src/styles/_tokens.scss`.
- Bits UI primitives are wrapped in `frontend/src/lib/components/ui/` and styled via co-located SCSS files.
