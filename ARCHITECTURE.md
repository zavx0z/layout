# Architecture

Layout is the UI-engine layer of the [MetaFor](https://github.com/zavx0z/metafor) infrastructure stack.

```text
zavx0z/engine  →  zavx0z/layout  →  zavx0z/ui  →  zavx0z/node
                         ↘          MetaFor          ↙
```

An arrow points from a dependency to its consumer.

## Ownership

`@layout/core` owns UI runtime mechanics:

- `UiRuntime` lifecycle and render-on-demand scheduling;
- `UiSurface` retained ownership, clipping, input and coordinate conversion;
- `HUD` and `UIDisplay` targets, plus the `UITexture` target descriptor;
- logical-pixel to world-unit mapping;
- deterministic FlexBox planning.

The underlying `Space`, renderer, camera, geometry and GPU materials come from [`@engine/core`](https://github.com/zavx0z/engine). Every `UiRuntime` owns one retained Space internally; using world-space displays is optional, so the same runtime can present only a camera-locked 2D HUD.

Visual vocabulary does not belong here. Buttons, inputs, themes, icons, windows and product-specific composition are owned by [zavx0z/ui](https://github.com/zavx0z/ui).

## Runtime invariant

A product owns one `UiRuntime`, which owns one Engine renderer and Space. Every UI consumer attaches surfaces to that runtime instead of creating an independent renderer or scene graph per component. Static Storybook builds and MetaFor integration must preserve one Engine module identity and one UI runtime in the final ESM graph.
