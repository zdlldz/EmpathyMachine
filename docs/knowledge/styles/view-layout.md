# View layout standard
Icon: tabler:layout-grid
Tags: views, layout, svelte, scss
Date: 2026-01-30
Summary: Standard app view structure, layout utilities, and sizing variables for consistent view composition.

## Standard structure
- Use `app-view` on the root view wrapper.
- Use `app-view__content` for padded, vertical content stacks.
- Use `app-view__shell` + `app-view__pane` when the view needs split layouts (drawers, side panels).
- Utilities live in `frontend/src/styles/app.scss`.

## Layout utilities
- `app-view__section` for grouped sections.
- `app-view__row` for horizontal groups, `app-view__row--between` for space-between layouts.
- `app-view__row-item` to clamp control widths inside rows.
- `app-view__stack`, `app-view__grid`, `app-view__form`, `app-view__list` for vertical/grouped layouts.
- `app-note`, `app-meta`, `app-value`, `app-value--caps` for shared text treatments across views.
- `app-datatable-surface` for standard card-like datatable framing (border, radius, clipping, surface background).

## Sizing + spacing variables
- `--view-content-max-width`: max width for `app-view__content` (default `100%` for full bleed). Set on the view root to constrain or expand.
- `--view-row-item-max-width` / `--view-row-item-min-width`: clamp widths for `app-view__row-item`.
- Optional per-block spacing + alignment vars: `--view-row-gap`, `--view-row-align`, `--view-stack-gap`, `--view-grid-gap`, `--view-form-gap`, `--view-gap-list`.

## Template (standard)
```svelte
<div class="app-view my-view">
  <div class="app-view__content my-view__content">
    <section class="app-view__section">
      <div class="app-view__row">
        <div class="app-view__row-item">...</div>
      </div>
    </section>
  </div>
</div>
```

## Template (split layout)
```svelte
<div class="app-view my-grid-view">
  <div class="app-view__shell">
    <section class="app-view__pane">
      ...
    </section>
    <aside>...</aside>
  </div>
</div>
```

## Notes
- For full-bleed layouts, skip `app-view__content` or set `--view-content-max-width: 100%` on the view root.
