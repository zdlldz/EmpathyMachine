# Component Backgrounds: Exception List Planning

**Date:** 2026-01-29  
**Icon:** tabler:layers-difference  
**Tags:** styling, theming, component-backgrounds, css-variables  
**Status:** Planning

## Summary

Refine the "Show component backgrounds" feature to exclude certain modal/overlay components that should always have solid (100% alpha) backgrounds, regardless of the setting.

## Current State

When `data-component-backgrounds="false"`, the following components currently get transparent backgrounds (0% alpha default, 40% alpha on hover):

1. `card` - ✅ **Keep transparent** (content cards)
2. `popover-content` - ✅ **Keep transparent** (non-modal popovers)
3. `hover-card-content` - ✅ **Keep transparent** (hover cards)
4. `tooltip-content` - ✅ **Keep transparent** (tooltips)
5. `dropdown-menu-content` - ❌ **NEEDS SOLID** (menu panel)
6. `context-menu-content` - ❌ **NEEDS SOLID** (menu panel)
7. `menubar-content` - ❌ **NEEDS SOLID** (menu panel)
8. `select-content` - ❌ **NEEDS SOLID** (dropdown menu)
9. `combobox-content` - ❌ **NEEDS SOLID** (dropdown menu)
10. `dialog-content` - ❌ **NEEDS SOLID** (modal dialog)
11. `alert-dialog-content` - ❌ **NEEDS SOLID** (modal dialog)
12. `sheet-content` - ⚠️ **DECISION NEEDED** (side panel - probably keep transparent)

## Components That Should Always Have Solid Backgrounds

### Modal Dialogs
- **`dialog-content`** (`data-slot="dialog-content"`)
  - Full-screen or centered modal dialogs
  - Requires solid background for readability and focus
  - Uses: `--color-popover` or `--color-surface`

- **`alert-dialog-content`** (`data-slot="alert-dialog-content"`)
  - Alert/confirmation dialogs
  - Requires solid background for critical information visibility
  - Uses: `--color-popover` or `--color-surface`

### Menu Panels (Dropdowns)
- **`dropdown-menu-content`** (`data-slot="dropdown-menu-content"`)
  - Dropdown menus triggered by buttons
  - Requires solid background for menu item visibility
  - Uses: `--color-popover` or `--color-surface`

- **`context-menu-content`** (`data-slot="context-menu-content"`)
  - Right-click context menus
  - Requires solid background for menu item visibility
  - Uses: `--color-popover` or `--color-surface`

- **`menubar-content`** (`data-slot="menubar-content"`)
  - Menubar dropdown menus
  - Requires solid background for menu item visibility
  - Uses: `--color-popover` or `--color-surface`

- **`select-content`** (`data-slot="select-content"`)
  - Select dropdown menus
  - Requires solid background for option visibility
  - Uses: `--color-popover` or `--color-surface`

- **`combobox-content`** (`data-slot="combobox-content"`)
  - Combobox dropdown menus
  - Requires solid background for option visibility
  - Uses: `--color-popover` or `--color-surface`

## Components That Should Stay Transparent

- **`card`** - Content cards (should respect the setting)
- **`popover-content`** - Non-modal popovers (should respect the setting)
- **`hover-card-content`** - Hover cards (should respect the setting)
- **`tooltip-content`** - Tooltips (should respect the setting)
- **`sheet-content`** - Side panels (probably should respect the setting, but could be debated)

## Implementation Plan

### Approach: CSS Exception Rules

Use CSS specificity to override the transparent background rules for components that need solid backgrounds.

### Step 1: Create Exception Selectors

Add new CSS rules that explicitly set solid backgrounds for exception components, even when `data-component-backgrounds="false"`:

```scss
// Exception: Components that always need solid backgrounds (100% alpha)
// These override the transparent rules when component backgrounds are disabled
:root[data-component-backgrounds="false"] [data-slot="dialog-content"],
:root[data-component-backgrounds="false"] [data-slot="alert-dialog-content"],
:root[data-component-backgrounds="false"] [data-slot="dropdown-menu-content"],
:root[data-component-backgrounds="false"] [data-slot="context-menu-content"],
:root[data-component-backgrounds="false"] [data-slot="menubar-content"],
:root[data-component-backgrounds="false"] [data-slot="select-content"],
:root[data-component-backgrounds="false"] [data-slot="combobox-content"] {
  background: var(--component-surface-base); // or var(--component-popover-base)
  border-color: var(--component-border-base);
  box-shadow: var(--shadow-sm); // or appropriate shadow
}
```

### Step 2: Use Established Variables

- Use `--component-surface-base` or `--component-popover-base` for backgrounds
- Use `--component-border-base` for borders
- Use existing shadow variables (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) for shadows
- These variables are already defined per-theme and contain the full-opacity colors

### Step 3: Remove from Transparent Rules

Remove the exception components from the existing transparent background selectors:

**Current selectors to modify:**
- Line ~265-276: Default transparent state selector
- Line ~285-296: Hover state selector  
- Line ~306-318: Box shadow hover selector

**Remove these from the selectors:**
- `[data-slot="dialog-content"]`
- `[data-slot="alert-dialog-content"]`
- `[data-slot="dropdown-menu-content"]`
- `[data-slot="context-menu-content"]`
- `[data-slot="menubar-content"]`
- `[data-slot="select-content"]`
- `[data-slot="combobox-content"]`

### Step 4: Determine Background Variable

**Decision needed:** Which variable should exception components use?

**Option A:** Use `--component-popover-base` (recommended)
- Semantically correct (dialogs/menus are popover-like)
- Already exists in all theme blocks
- Matches current component usage (`--color-popover`)

**Option B:** Use `--component-surface-base`
- Also semantically reasonable
- Already exists in all theme blocks
- Matches current component usage (`--color-surface`)

**Recommendation:** Use `--component-popover-base` for consistency with existing component styles.

### Step 5: Handle Borders and Shadows

- **Borders:** Use `var(--component-border-base)` at 100% opacity
- **Shadows:** Use existing shadow variables (`--shadow-sm` for menus, `--shadow-md` or `--shadow-lg` for dialogs)

### Step 6: Verify Theme Coverage

Ensure all 8 theme blocks have the required base variables:
- ✅ Default light/dark (`_tokens.scss`)
- ✅ Forest light/dark (`_tokens.scss`)
- ✅ Blue light/dark (`_presets.scss`)
- ✅ Green light/dark (`_presets.scss`)
- ✅ Red light/dark (`_presets.scss`)

All already have `--component-popover-base` and `--component-border-base` defined.

## File Changes

### `frontend/src/styles/themes/_presets.scss`

1. **Add exception rules** (after line ~262, before transparent rules):
   ```scss
   // Exception: Components that always need solid backgrounds
   // These override transparent rules when component backgrounds are disabled
   :root[data-component-backgrounds="false"] [data-slot="dialog-content"],
   :root[data-component-backgrounds="false"] [data-slot="alert-dialog-content"],
   :root[data-component-backgrounds="false"] [data-slot="dropdown-menu-content"],
   :root[data-component-backgrounds="false"] [data-slot="context-menu-content"],
   :root[data-component-backgrounds="false"] [data-slot="menubar-content"],
   :root[data-component-backgrounds="false"] [data-slot="select-content"],
   :root[data-component-backgrounds="false"] [data-slot="combobox-content"] {
     background: var(--component-popover-base);
     border-color: var(--component-border-base);
   }
   
   // Dialogs get larger shadows
   :root[data-component-backgrounds="false"] [data-slot="dialog-content"],
   :root[data-component-backgrounds="false"] [data-slot="alert-dialog-content"] {
     box-shadow: var(--shadow-lg);
   }
   
   // Menus get smaller shadows
   :root[data-component-backgrounds="false"] [data-slot="dropdown-menu-content"],
   :root[data-component-backgrounds="false"] [data-slot="context-menu-content"],
   :root[data-component-backgrounds="false"] [data-slot="menubar-content"],
   :root[data-component-backgrounds="false"] [data-slot="select-content"],
   :root[data-component-backgrounds="false"] [data-slot="combobox-content"] {
     box-shadow: var(--shadow-sm);
   }
   ```

2. **Remove exception components from transparent selectors:**
   - Remove from default transparent state selector (~line 265-276)
   - Remove from hover state selector (~line 285-296)
   - Remove from box shadow hover selector (~line 306-318)

## Testing Checklist

- [ ] Dialog content has solid background when `showComponentBackgrounds = false`
- [ ] Alert dialog content has solid background when `showComponentBackgrounds = false`
- [ ] Dropdown menu has solid background when `showComponentBackgrounds = false`
- [ ] Context menu has solid background when `showComponentBackgrounds = false`
- [ ] Menubar menu has solid background when `showComponentBackgrounds = false`
- [ ] Select dropdown has solid background when `showComponentBackgrounds = false`
- [ ] Combobox dropdown has solid background when `showComponentBackgrounds = false`
- [ ] Cards still transparent when `showComponentBackgrounds = false`
- [ ] Popovers still transparent when `showComponentBackgrounds = false`
- [ ] Tooltips still transparent when `showComponentBackgrounds = false`
- [ ] All exception components use correct theme colors
- [ ] All exception components have proper shadows
- [ ] Works across all themes (default, forest, blue, green, red × light/dark)

## Questions / Decisions Needed

1. **Sheet content:** Should `sheet-content` also have solid background, or stay transparent?
   - **Recommendation:** Keep transparent (it's a side panel, not a modal)

2. **Popover content:** User mentioned "menu-panel" - should `popover-content` also be solid?
   - **Recommendation:** Keep transparent (non-modal popovers should respect the setting)

3. **Shadow variables:** Should we use existing `--shadow-*` variables or create new ones?
   - **Recommendation:** Use existing variables (`--shadow-sm` for menus, `--shadow-lg` for dialogs)

4. **Background variable:** `--component-popover-base` vs `--component-surface-base`?
   - **Recommendation:** `--component-popover-base` for semantic correctness

## Notes

- This approach maintains DRY principles by reusing existing theme-level base variables
- No new variables needed - all required variables already exist
- CSS specificity ensures exception rules override transparent rules
- Theme-level variables ensure consistency across all themes
- Easy to extend if more exceptions are needed in the future
