---
name: layout-dev
description: "Develop and verify the standalone Layout repository, @layout/core UI runtime, HUD and spatial displays, tests, and static Storybook. Use for Layout implementation or repository-level development; use ui-dev, nodes-dev, or metafor-dev for consumer-owned behavior."
---

# Layout development

Built for [MetaFor](https://github.com/zavx0z/metafor) as a reusable UI engine
for HUDs, virtual displays, and immersive WebGPU interfaces.

Use the exact Layout checkout supplied for the task. Preserve its branch or
detached HEAD, unrelated changes, linked dependency identity, listeners, and
browser targets. Before changing a contract, read `ARCHITECTURE.md`, the
affected public types and implementation, and focused tests.

`@layout/core` owns `UiRuntime`, `UiSurface`, retained input and clipping,
logical-pixel/world-unit conversion, HUD and spatial `UIDisplay` targets,
`UITexture`, display navigation, and deterministic FlexBox planning. Engine
owns rendering primitives and `Space`; UI owns visual controls; Nodes owns node
authoring; MetaFor owns product semantics. Import the exact public owner and do
not add aliases, compatibility re-exports, or a reverse dependency.

One product runtime owns one retained Engine renderer and Space. Surfaces attach
to that runtime instead of creating a renderer or scene per component. Flat HUD
and optional spatial-display behavior must remain coherent.

The HTML composition root declares one `engine-default-font` meta URL.
`UiRuntime.create()` loads it lazily only without a custom `font` or `fontUrl`,
and Engine shares the parsed instance. Layout source and visual packages do not
own a copied default TTF or eagerly fetch it.

## Checks

Run focused tests while iterating, then:

```bash
bun run typecheck
bun run test
bun run pages
git diff --check
```

`bun run check` covers typecheck and tests. `bun run pages` separately proves
the static `/layout/` artifact. Before accepting linked integration, verify that
`@engine/core` resolves to the intended Engine checkout or immutable revision;
a global Bun link is a temporary overlay, not release evidence.

The static artifact is repository-root `dist/` and must contain `.nojekyll`,
the Engine font, fail-closed known-route recovery and schema-1
`storybook-manifest.json` identities, lazy chunks, sizes and SHA-256 hashes.

GitHub Pages deployment is manual and owner-gated. Never dispatch
`.github/workflows/pages.yml`, run `gh workflow run`, change repository Pages
settings, or deploy an artifact unless the owner explicitly requests deployment
in the current task. `bun run pages` and checks verify an artifact; they do not
authorize publishing it.

## Storybook and evidence

`bun run storybook` starts the shared no-HMR catalog at
`http://127.0.0.1:4020/layout/`. It compiles the one page on first request and
keeps it until an owner-controlled restart. Inspect listener ownership before
starting it and never adopt or stop a foreign process. Restart only the exact
owned process after a stable source checkpoint.

Canonical overview routes end in `/`; leaves
`/layout/ui-runtime/target/hud` and
`/layout/ui-runtime/target/spatial-display` do not. Unknown suffixes return
404. Browser evidence requires `layoutStorybook=ready`, console 0, a non-black
`#layout-story-canvas`, and exact `layoutStorybookSurfaceParent`: HUD for the
first story and `UiRuntimeDisplay` for the second.

For visual or input changes, verify the exact flat-HUD and spatial-display
stories affected, console output, and the rendered WebGPU result. A static build
or unit test alone does not prove browser behavior. Keep WebGPU Inspector
external to repository source and public artifacts.

At handoff report the checkout and revision, Engine dependency identity,
focused and repository checks, Pages build, exact live route and visual evidence
where applicable, and every remaining consumer or owner gate.
