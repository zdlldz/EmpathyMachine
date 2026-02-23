# [DEV-5309] - Deep Styles Audit + Streamlining
Icon: tabler:palette
Tags: frontend, styling, scss, audit, planning
Date: 2026-01-18
Summary: Comprehensive audit of the SCSS architecture following the DEV-1234 Bits UI refactor. Goal is to understand current state, identify streamlining opportunities, and establish a minimal/clean styling foundation.

## Goal
- Audit all SCSS files to understand current architecture
- Identify opportunities to streamline and minimize styles
- Answer key questions about styling approach (monolith vs component-level)
- Establish BEM/consistent naming conventions
- Adopt mobile-first responsive patterns
- Achieve minimal, clean, maintainable SCSS foundation

## Scope
- All files in `frontend/src/styles/`
- Component styling patterns in `frontend/src/lib/components/`
- Does NOT include Rust/backend styles
- Does NOT add Tailwind or utility-class complexity

## Changes
- Created this process doc and started discovery notes/questions.
- Added task index entry.
- Expanded with detailed discovery findings (2026-01-18).
- Implemented componentized SCSS with per-component imports, split theme presets, and mixins.
- Added SCSS nesting + `@mixin where`/`@mixin slot` to keep selectors DRY (2026-01-19).

## Files touched
- `docs/process/DEV-5309-styles-audit.md`
- `docs/tasks.md`

## Validation
- `pnpm -C frontend build` (pass; chunk size warning due to Shiki language bundles)
- `pnpm -C frontend check` (pass)
- `pnpm -C frontend test:e2e` (pass)

---

## Status update (2026-01-18)
- `_components.scss` removed from the build; styles now live beside each Bits UI wrapper (e.g. `frontend/src/lib/components/ui/button/button.scss`).
- App/view blocks are co-located (`frontend/src/App.scss`, `frontend/src/settings/SettingsApp.scss`, `frontend/src/window/WindowApp.scss`, `frontend/src/views/*-view.scss`, `frontend/src/components/component-preview.scss`).
- Shared app blocks live in dedicated files (e.g. `frontend/src/lib/components/blocks/sidebar-brand.scss`, `frontend/src/lib/components/blocks/sidebar-layout.scss`).
- Theme presets moved to `frontend/src/styles/themes/_presets.scss`; mixins live in `frontend/src/styles/_mixins.scss`.
- `frontend/src/styles/app.scss` now only contains global layout utilities and CSS variables.

## CSS size snapshot (2026-01-18)
Captured from `pnpm -C frontend build` (per HTML entrypoint, sum of linked CSS assets):
- `index.html`: 51,718 bytes
  - `assets/window-titlebar-D2cDHh3y.css`: 38,029 bytes
  - `assets/avatar-fallback-Bl9tLMeY.css`: 1,466 bytes
  - `assets/package-1P0FL_0Z.css`: 5,546 bytes
  - `assets/main-yaZqjjt6.css`: 6,677 bytes
- `settings.html`: 42,691 bytes
  - `assets/window-titlebar-D2cDHh3y.css`: 38,029 bytes
  - `assets/avatar-fallback-Bl9tLMeY.css`: 1,466 bytes
  - `assets/sliders-horizontal-BHawVwcz.css`: 228 bytes
  - `assets/settings-CC2Uxsaw.css`: 2,968 bytes
- `window.html`: 38,251 bytes
  - `assets/window-titlebar-D2cDHh3y.css`: 38,029 bytes
  - `assets/window-CYpovumI.css`: 222 bytes
- `components.html`: 133,917 bytes
  - `assets/window-titlebar-D2cDHh3y.css`: 38,029 bytes
  - `assets/avatar-fallback-Bl9tLMeY.css`: 1,466 bytes
  - `assets/sliders-horizontal-BHawVwcz.css`: 228 bytes
  - `assets/package-1P0FL_0Z.css`: 5,546 bytes
  - `assets/components-BrejgxB8.css`: 88,648 bytes

Note: The discovery section below reflects the pre-migration state for historical context.

## Completion status
This work can be considered complete once Playwright E2E runs successfully on a full macOS host or with a non-headless-shell Chromium channel (the current sandbox blocks headless shell). If you accept that limitation for now, the migration work itself is complete.

## Status update (2026-01-19)
- Added `@mixin where` + `@mixin slot` helpers to preserve low-specificity selectors with concise SCSS.
- Converted app block styles to nested BEM where they read more cleanly (e.g. titlebar, sidebar, settings, window).
- Normalized Bits UI wrapper SCSS to use the new mixins instead of raw `:where()` blocks.
- Added `frontend/src/styles/README.md` with nesting + mixin conventions; validation still pending.
- Aligned Playwright `webServer` port/baseURL to `1234` to match Vite config.
- Updated Playwright dashboard/styles wiring tests to match the current tabs-based UI state.
- E2E tests now pass after aligning ports and updating selectors.

## Discovery: SCSS File Structure

| File | Lines | Purpose |
|------|-------|---------|
| `main.scss` | 4 | Entry point; `@use` imports all partials |
| `_tokens.scss` | ~382 | Design tokens (CSS custom properties) + theme variants |
| `_base.scss` | ~67 | CSS reset, body defaults, form resets, `.sr-only` |
| `_components.scss` | ~2643 | Monolithic component styles (Bits UI data-slot selectors) |
| `app.scss` | ~1630 | Layout primitives, app blocks, view-specific styles |

**Total: ~4700 lines of SCSS**

### Token System (`_tokens.scss`)
- **Spacing**: `--space-1` (0.25rem) through `--space-12` (3rem)
- **Typography**: `--text-xs` through `--text-2xl`, `--font-sans` (Inter), `--font-mono` (JetBrains Mono)
- **Colors**: Semantic tokens (`--color-bg`, `--color-fg`, `--color-primary`, etc.)
- **Semantic aliases**: `--background`, `--foreground`, `--primary`, `--card`, `--popover`, etc.
- **Radius**: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl` (based on `--radius-base`)
- **Motion**: `--motion-duration` (200ms), `--motion-duration-fast` (120ms), `--motion-ease`
- **Shadows**: `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- **Theme variants**: Light/dark via `:root.dark`, color themes via `[data-theme="blue|green|red"]`

### Styling Approach
1. **Data Attributes for Styling Hooks**: Components use `data-slot="button"`, `data-variant="ghost"`, `data-size="sm"`, `data-state="open"`, etc.
2. **`:where()` for Low Specificity**: All component selectors wrapped for easy overrides
3. **Thin Component Wrappers**: UI components in `lib/components/ui/` are minimal wrappers that apply `data-slot` attributes; styles come from global `_components.scss`

---

## Key Question Analysis

### Q1: "Looks like plain CSS, not SCSS?"
**Finding**: Files ARE `.scss` but use mostly modern CSS features:
- CSS custom properties (not `$variables`)
- CSS nesting (now native to CSS)
- No mixins, functions, or SCSS-specific features currently used

**Implication**: Could adopt SCSS features like mixins for common patterns (transitions, focus rings, responsive breakpoints) if desired.

### Q2: "Should we use BEM naming?"
**Current State**:
- `data-slot` attributes for Bits UI component primitives
- BEM-ish naming in `app.scss` for layout blocks (`.sidebar-brand__icon`, `.titlebar-tab__close`)

| Approach | Current Usage | Analysis |
|----------|---------------|----------|
| `data-slot` | Component primitives | Aligns with Bits UI patterns, avoids class conflicts |
| BEM classes | App layout blocks | Readable, grepable, familiar |
| Hybrid | Both used | Works if distinction is clear and documented |

### Q3: "Can component CSS be in component files vs monolithic?"
| Option | Pros | Cons |
|--------|------|------|
| **Monolithic** (current) | Single source of truth, easy to find, consistent patterns | Large file (~2600 lines), all styles loaded always |
| **Svelte `<style>` blocks** | Co-located, tree-shaken, scoped | Can't target `data-slot` globally, harder to share patterns |
| **Per-component SCSS files** | Modular, could lazy-load | More files, import management complexity |
| **Category-split files** | Balanced modularity | Moderate complexity |

### Q4: "Shouldn't Bits UI give us clean components out of the box?"
**Clarification**: No. Bits UI is intentionally unstyled:
> "Most components ship completely unstyled, with the exception of those required for core functionality." — Bits UI docs

The ~2600 lines in `_components.scss` IS the design system. This is expected and necessary. Bits UI provides structure/accessibility; we provide ALL visual styling.

### Q5: "Do we need all of this CSS?"
This requires mapping usage. Preliminary audit:

**Components Used in Core Entry Points** (verified via imports in App/Settings/Window + shared blocks):
- Button, Input, Label
- Card (+ header/content/title/description), Separator
- Dialog, ContextMenu, DropdownMenu
- Sidebar (depends on Sheet, Tooltip, Skeleton, Separator, Input, Button)
- Avatar, Breadcrumb

**Components Likely Showcase-Only** (ComponentsApp.svelte / Godmode window):
- Accordion, Alert, AlertDialog, AspectRatio, Badge
- Calendar, Carousel, Chart, Checkbox, Collapsible
- Command, DataTable, Drawer, HoverCard, InputOTP
- Label, Menubar, NavigationMenu, Pagination, Popover
- Progress, RadioGroup, RangeCalendar, Resizable
- ScrollArea, Sheet, Skeleton, Slider, Sonner
- Table, Textarea, Toggle, ToggleGroup

**Implication**: Components window imports the full UI library, while the main app uses a subset.
This makes CSS bundling by entrypoint a clean way to keep the core app minimal without removing
showcase capability.

**Observation**: The showcase demonstrates the full design system. For a minimal app build, many component styles could be optional.

---

## Open Questions for Decision

### Architecture
1. **Monolithic vs Split**: Keep `_components.scss` as-is, split by category, or split per-component?
2. **Naming Convention**: Formalize BEM for app blocks + keep `data-slot` for components?
3. **SCSS Features**: Adopt mixins/functions for common patterns (focus rings, transitions)?

### Optimization
4. **Unused Styles**: Remove showcase-only component styles from core? Or keep for extensibility?
5. **Mobile-First**: Rewrite responsive patterns mobile-first? What breakpoints?
6. **Theme Presets**: Keep all color themes (blue/green/red) or ship single clean theme?

### Patterns
7. **`:where()` Strategy**: Keep low-specificity approach or move to classes?
8. **Co-location**: Any benefit to moving styles closer to components?
9. **View Splitting**: Keep `app.scss` monolithic or split by view?

---

## Potential Streamlining Approaches

### Option A: Organize Better (Low Effort)
- Add clear section comments/separators in `_components.scss`
- Group by component category
- Document core vs optional components
- **Benefit**: Cleaner organization, same architecture

### Option B: Split by Category (Medium Effort)
```
styles/
  _components/
    _inputs.scss      # input, textarea, select, checkbox, radio, switch, slider
    _buttons.scss     # button, toggle, toggle-group
    _overlays.scss    # dialog, sheet, drawer, popover, tooltip, dropdown
    _navigation.scss  # tabs, breadcrumb, menubar, navigation-menu
    _feedback.scss    # alert, progress, skeleton, sonner
    _data.scss        # table, data-table, calendar, chart
    _layout.scss      # card, separator, resizable, scroll-area, sidebar
    _misc.scss        # accordion, collapsible, avatar, badge, aspect-ratio
```
- **Benefit**: Easier maintenance, could lazy-load categories

### Option C: Per-Component SCSS (High Effort)
```
components/
  accordion/
    accordion.svelte
    accordion.scss
  button/
    button.svelte
    button.scss
```
- **Benefit**: True modularity, load-on-demand
- **Risk**: More complexity, harder design system consistency

### Option D: Svelte Scoped Styles (High Effort, Different Paradigm)
- Move to `<style>` blocks with `:global()` where needed
- **Benefit**: Co-location, tree-shaking
- **Risk**: Loses global design system coherence

---

## Mobile-First Audit

### Current State
- Most styles are desktop-first or static
- Few `@media` queries in `_components.scss`
- Some responsive patterns in `app.scss` (dashboard grids, sidebar visibility)

### Mobile-First Opportunities
- [ ] Calendar layouts (month grid)
- [ ] Dialog/sheet sizing
- [ ] Table overflow handling
- [ ] Alert dialog footer layout
- [ ] Sheet header/footer layout
- [ ] Dashboard/card grids

### Suggested Breakpoint System
```scss
// Mobile-first breakpoints
$breakpoint-sm: 640px;   // Small tablets
$breakpoint-md: 768px;   // Tablets
$breakpoint-lg: 1024px;  // Desktop
$breakpoint-xl: 1280px;  // Large desktop
```

---

## BEM Naming Audit

### Current Good Patterns in `app.scss`
```scss
.titlebar { }
.titlebar__content { }
.titlebar__leading { }
.titlebar__actions { }

.titlebar-tab { }
.titlebar-tab__close { }
.titlebar-tab__crumbs { }

.sidebar-brand { }
.sidebar-brand__icon { }
.sidebar-meta { }
.sidebar-meta__title { }
```

### Recommendation
- **Keep `data-slot`** for Bits UI component styling (consistent with their patterns)
- **Use BEM** for app-specific blocks (`.titlebar-*`, `.sidebar-*`, `.settings-*`, `.dashboard-*`)
- **Document** the distinction clearly

---

## Dependencies Context

Current frontend dependencies (no Tailwind):
- `bits-ui: ^2.15.4` - Headless components
- `clsx: ^2.1.1` - Class name utility (no tailwind-merge needed)
- `sass: ^1.77.0` - SCSS compiler
- `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono` - Typography

---

## Next Steps

1. **Decide on architecture approach** (A/B/C/D above)
2. **Map component usage** to identify truly unused styles
3. **Formalize naming convention** (BEM for blocks, data-slot for primitives)
4. **Audit for mobile-first opportunities**
5. **Consider SCSS features** (mixins for common patterns)
6. **Create streamlined implementation plan**

---

## Notes
- DEV-1234 refactor was recently completed and is functional
- Current architecture follows Bits UI patterns correctly
- Goal is refinement and streamlining, not major overhaul
- No Tailwind - SCSS only
- Components Godmode is valuable for design system demonstration/testing

---

## Final Go-Plan (Recommended)

### Guiding Decisions
- **Max componentization** for lean builds: per-component styles for Bits UI primitives.
- **App blocks** co-located with their owning Svelte components.
- **Entry-point trimming** is the primary bundling strategy (main/settings/window/components).
- **Shared tokens + mixins** remain global for consistency and DRY ergonomics.
- **Theme presets stay** and remain compatible with per-component styles.

### Phase 0: Measure + Map (Quick, Low Risk)
- Capture current CSS size per entrypoint (main/settings/window/components).
- Map actual component usage by entrypoint to guide which styles are “core.”
- Outcome: data to justify how far we go (category-split vs per-component).

### Phase 1: App Block Co-location (Clear Win)
- Move BEM-style blocks from `app.scss` into their owning Svelte components using `<style lang="scss">`.
- Use SCSS nesting (`&__`, `&--`) to keep BEM clean and compact.
- Keep only shared layout primitives + minimal global helpers in `app.scss`.

### Phase 2: SCSS Mixins + Mobile-First System
- Add mixins for focus rings, transitions, text truncation, and breakpoints.
- Convert existing responsive rules to mobile-first patterns using the mixins.

### Phase 3: Components Layer Restructure (Final)
**Per-component styles for UI primitives**
- Move each primitive’s styles into its wrapper component with `:global([data-slot=...])`.
- Keep a shared mixin + token library for consistent focus, spacing, transitions, breakpoints.
- Preserve low-specificity selectors (`:where(...)`) and a consistent ordering pattern per component.
- Goal: only styles for imported components are compiled into each entrypoint bundle.

### Phase 4: Optional Presets + Docs
- Move non-default theme presets into an optional import (`themes/_presets.scss`).
- Add `styles/README.md` documenting conventions:
  - data-slot for primitives
  - BEM for app blocks
  - mixin usage
  - breakpoint tiers

### Phase 5: Audit + Cleanup
- Remove unused global styles.
- Verify Components Godmode still renders all primitives with the new structure.

---

## Decisions Confirmed
- Componentization: **Per-component styles** for all Bits UI primitives.
- Driver: **Bundle size + performance** first, DX clarity second.
- Core primitives layer: **No always-on core layer**; each component ships its own styles.
- Theme presets: **Keep**, as optional imports compatible with component styles.
- Breakpoints: **sm 640, md 768, lg 1024, xl 1280** with mixins for shorthand usage.
