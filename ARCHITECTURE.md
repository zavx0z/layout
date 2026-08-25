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

The canonical composition, retained-subtree, and clipping laws are defined by
the stable IDs in the [`@layout/core` requirements](packages/core/requirements.md).
Consumer repositories reference that owner contract instead of duplicating it.

## Runtime invariant

A product owns one `UiRuntime`, which owns one Engine renderer and Space. Every UI consumer attaches surfaces to that runtime instead of creating an independent renderer or scene graph per component. Static Storybook builds and MetaFor integration must preserve one Engine module identity and one UI runtime in the final ESM graph.

The browser composition root declares one Engine-owned default font URL through
`<meta name="engine-default-font" content="…">`. `UiRuntime` loads it only when
the caller supplies neither a parsed font nor a custom font URL, and Engine
caches one parsed instance per absolute URL. Visual packages never own or copy a
font route. A custom font bypasses the document default without requesting it.

## Repository Storybook

Development descriptors for `@layout/core` live in
`packages/core/storybook/**`, outside production exports and typecheck inputs.
The private `@layout/storybook` app composes them through exact
`@zavx0z/storybook/*` subpaths. Layout/UI dependencies required by the shared
Workbench remain private development dependencies; `@layout/core` still
depends only on Engine.

One canvas and one `UiRuntime` own the fixed Workbench HUD plus the selected
preview. The HUD story has a real `HUD` parent. The spatial story has a real
`UiRuntimeDisplay` parent and can move into Space without taking navigation,
source or events away from the camera-locked Workbench.

Local and static delivery share `/layout/`. The no-HMR server keeps port `4020`;
the shared static builder writes repository-root `dist/`, fail-closed deep-link
recovery and a schema-1 manifest. Pages remains manual and cannot be called a
cold proof until Engine, UI, Highlighter and shared Storybook are delivered at
immutable revisions and the workflow pins them.
