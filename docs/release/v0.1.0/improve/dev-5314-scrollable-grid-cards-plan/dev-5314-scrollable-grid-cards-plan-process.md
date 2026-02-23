# [DEV-5314] - Scrollable grid + cards (final plan)
Icon: tabler:layout-grid
Tags: layout, ui, perf, planning
Date: 2026-01-27
Summary: Final plan for two “grail” layout components (ScrollableGrid + Card) plus a per-view, stackable filter drawer system that scales across future grid contexts.

## Purpose of this document
This plan is intended to be a complete, portable starting point for any agent (or orchestrator) to implement the grid + card foundation. It assumes only that the agent has access to this repo and the standard repo guide (`agents.md`).

## Goal
- Establish two reusable, DRY “grail” components that anchor all grid + card layouts.
- Achieve buttery-smooth scrolling with 1k–10k items and variable card heights.
- Keep components data-agnostic so real data can be plugged in later without refactors.
- Add a dedicated Grid view to exercise the primitives and UX model.

## Scope
- **Core components:** `ScrollableGrid` and `Card`.
- **Supporting UI:** minimal grid toolbar (columns, sort, filters placeholder, local search).
- **State:** persist column count + sort per view in the existing settings system.
- **Drawer system:** per-view stackable drawer pattern for filters, behaves like sidebar(s).
- **View:** add a new Grid view entry wired into navigation.

## Non-goals (for this phase)
- Global search or server-backed queries.
- Multiple card variants; start with a single, consistent “grail” card layout.
- Full filter logic (placeholder content only).

## Decisions locked in
- **Variable-height cards** are allowed (no line clamps by default).
- **Whole-column spans only** (no fractional widths).
- **Local search resets** each session.
- **DrawerStack is per view** and **newest drawer appears closest to content**.
- **Drawer widths** use a global token with per-drawer overrides.
- **Drawer behavior:** drawers **push content left** (not overlay) for now; this is a per-view setting to toggle later.
- **View-specific persistence** uses keys like `grid_view_columns` and `grid_view_sort`.
- **Density is persisted per view** but driven by media query (not user-controlled yet).
- **Hover and focus** both trigger video play; leaving hover/focus pauses.
- **Accessibility semantics:** use modern, ARIA-aligned grid semantics (`role="grid"` + `gridcell`) unless conflicts arise with virtualization; keep list semantics as fallback if needed.

## Principles
- **DRY by design:** shared tokens, shared state helpers, single data model.
- **Minimal deps:** prefer in-house logic; add libs only if clearly superior.
- **Svelte 5 runes:** no legacy patterns.
- **Performance-first:** virtualize, avoid large DOM, reduce reflow.
- **Composable shells:** layout components only; app-specific data later.
- **No jitter:** maintain visual stability even with variable card heights.

## Component model
### 1) `ScrollableGrid` (layout container + performance)
**Responsibilities**
- Own the scroll container, grid layout, and virtualization.
- Expose a render API that stays data-agnostic.

**API sketch**
- Props:
  - `items` (array)
  - `columns` (1–16)
  - `getKey(item)`
  - `getSpan(item)` (whole numbers only)
  - `overscan` (rows)
- Slots:
  - `let:item` for rendering a `Card`

**Layout strategy**
- CSS grid with `--grid-columns`, `--gap-grid`, `--padding-grid`.
- Each item sets `--card-span` and `grid-column: span var(--card-span)`.
- Items use `contain` + `content-visibility: auto` + `contain-intrinsic-size`.

**Virtualization (in-house, row-based, variable heights)**
- Greedy row packing based on spans (whole columns only).
- Measure row heights with `ResizeObserver` (no hardcoded heights).
- Maintain prefix-sum heights for fast binary search on scroll.
- **Anchor-based scroll correction:** keep a top “anchor row” stable; adjust scrollTop when rows above change height to prevent visible jumps.
- Overscan aggressive enough to hide mount/unmount cost.

### 2) `Card` (content shell)
**Responsibilities**
- Provide a single, durable card structure with slots for media, meta, tags, and actions.
- Adapt layout for span=1 (list-style) vs multi-column (stacked).

**API sketch**
- Props:
  - `span` (1–16, whole numbers)
  - `layout` (derived: `list` when span=1, `grid` otherwise)
  - `aspectRatio` (grid default + per-card override)
  - `density` (`small` | `medium` | `large`, default `medium`)
- Slots:
  - `media`, `meta`, `tags`, `actions`

**Layout rules**
- Flex column by default; flex row for list layout (span=1).
- Use `gap` everywhere, no margins.
- Variable height is allowed; card height is content-driven.

**Media behavior**
- Images: `srcset` + `sizes`, `loading="lazy"`, `decoding="async"`.
- Videos: thumbnail `<img>` + inline `<video>`; hover/focus to play, fade thumbnail.
  - `muted`, `loop`, `playsinline`, no controls.
- Respect `prefers-reduced-motion` (disable hover/focus play).

## Stackable drawers (filters)
**Goal**
- Filters open a drawer that behaves like a sidebar and can stack with other drawers.

**Design**
- Each view owns a **DrawerStack** host (right edge).
- Drawers render as side-by-side panels and stack leftward.
- Newest drawer appears closest to content.
- Drawers **push content left** (not overlay) for now; make this a per-view toggle.
- Drawer visuals align with sidebar tokens for cohesion.
- Grid toolbar triggers a Filters drawer (placeholder content for now).

**DRY strategy**
- DrawerStack is a shared component; views only supply payloads.
- Single drawer registration API across the app.

## State + persistence
- Persist **column count** + **sort mode** scoped to Grid view in `core/settings.svelte.ts`.
- Keys: `grid_view_columns`, `grid_view_sort`.
- Add a **generic “persisted view state” helper** to keep this DRY for future views.
- **Density persisted per view**, derived from a media query (not user-controlled yet).
- Local search resets each session.

## Keyboard navigation + accessibility
- Roving `tabindex` managed by the grid controller.
- Arrow key mapping via row/column coordinates from row packing.
- Wrap behavior enabled (Right on last item → next row, etc.).
- On column count change, keep active item by ID and snap to nearest valid cell.
- Use ARIA grid semantics (`role="grid"`, `row`, `gridcell`) as the default approach.

## Grid toolbar
- **Columns:** +/- and numeric display (1–16), persisted.
- **Sort:** old↔new, title A↔Z; placeholder pattern for future sorts.
- **Filters:** button opens stackable drawer.
- **Local search:** scoped to grid data only.

## View integration
- Add a new “Grid” view in `core/views.ts` and sidebar.
- Use deterministic mock data to validate layout + perf + keyboard nav.

## Durability strategies
- **Row packing + anchoring:** smooth scroll with variable heights.
- **Token-driven spacing + density:** consistent layout across app contexts.
- **Isolation:** card internals do not affect grid calculations beyond measured height.
- **Composable structure:** cards never assume data shape beyond slots.

## Edge cases + mitigations
- **Media loads after render:** anchor-based scroll correction avoids jumps.
- **Column count change:** preserve focus by item ID; re-pack rows and adjust scroll anchor.
- **Window resize:** recompute packing and update virtual range without jank.
- **High item churn (sort/filter):** reset scroll to top, focus first item.
- **Offscreen video:** pause when unmounted; optionally gate play by IntersectionObserver.
- **Long text/locale expansion:** card height grows naturally; no clamps.

## Plan (final steps)
1. Finalize `ScrollableGrid` + `Card` API contracts (props/slots, CSS vars, event hooks).
2. Design DrawerStack host + registration API (per-view, push-content behavior).
3. Implement row packing + virtualization controller (anchor-based scroll correction).
4. Build `Card` shell + media behaviors with list vs grid layout.
5. Add Grid toolbar + local state wiring (columns/sort/search).
6. Add Grid view and sidebar entry with mock data.
7. Keyboard navigation + focus management (wrap + resize behavior).
8. Performance pass: 1k–10k items, verify scroll FPS + memory.

## Files to touch (anticipated)
- `frontend/src/core/views.ts`
- `frontend/src/App.svelte`
- `frontend/src/core/settings.svelte.ts`
- `frontend/src/lib/components/blocks/`
- `frontend/src/styles/`
- `frontend/src/core/i18n/messages.json`

## Validation (planned)
- Manual performance test with 1k–10k mock items.
- Keyboard navigation across column changes.
- Hover/focus video behavior + reduced-motion behavior.
- Drawer stacking behavior + focus trapping.

## Notes
- Planning doc only; no code changes implied.
