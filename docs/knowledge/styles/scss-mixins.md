# SCSS Mixins Import Pattern

## Overview

Component SCSS files use mixins from `frontend/src/styles/_mixins.scss` for consistent styling patterns. This doc explains the correct import pattern and why it matters.

## The Pattern

**Always use `@use 'mixins' as *;` in component SCSS files.**

```scss
@use 'mixins' as *;

@include slot('button') {
  display: inline-flex;
  /* ... */
}
```

## Why This Works

The `vite.config.ts` configures `loadPaths: [stylesDir]`, which adds `frontend/src/styles` to Sass's module resolution path:

```ts
css: {
  preprocessorOptions: {
    scss: {
      api: 'modern-compiler',
      loadPaths: [stylesDir], // Adds frontend/src/styles to resolution
      additionalData: '@use "mixins" as *;\n'
    }
  }
}
```

This means `@use 'mixins'` resolves to `frontend/src/styles/_mixins.scss` from any location, regardless of file depth or structure.

## Why Not Relative Paths?

❌ **Don't use relative paths:**
```scss
@use '../../../../styles/mixins' as *; // Brittle!
```

**Problems with relative paths:**
- Break when files move or directory structure changes
- Hard to maintain across 50+ component files
- Different paths needed for different file depths
- Violates DRY principles

## Why Not Rely on `additionalData`?

The `additionalData` in `vite.config.ts` only applies to:
- Entry SCSS files (like `main.scss`)
- Files directly processed by Vite

It does **not** apply to:
- Files imported via `@use` from other SCSS files
- Component SCSS files imported by `_core-ui.scss`

Therefore, each component file must explicitly import mixins.

## Available Mixins

From `_mixins.scss`:

- **`slot($name, $suffix, $desc)`** - Target `data-slot` attributes with `:where()` wrapper
- **`where($selector)`** - Low-specificity selector grouping
- **`up($size)`, `down($size)`, `between($min, $max)`** - Responsive breakpoints
- **`focus-ring($bg, $ring)`** - Accessible focus styles
- **`truncate`** - Text truncation utility
- **`motion($properties...)`** - Transition helper

See `frontend/src/styles/README.md` for usage examples.

## Examples

### Component in subdirectory
```scss
// frontend/src/lib/components/ui/button/button.scss
@use 'mixins' as *;

@include slot('button') {
  /* styles */
}
```

### Component at root level
```scss
// frontend/src/lib/components/ui/badge.scss
@use 'mixins' as *;

@include slot('badge') {
  /* styles */
}
```

Both work identically thanks to `loadPaths` configuration.

## Related Files

- `frontend/vite.config.ts` - Vite/SCSS configuration
- `frontend/src/styles/_mixins.scss` - Mixin definitions
- `frontend/src/styles/README.md` - Style conventions
- `frontend/agents.md` - Frontend workflow guide
