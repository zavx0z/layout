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

`bun run check` covers typecheck, tests and the static `/layout/` artifact.
Before accepting linked integration, verify that
`@engine/core` resolves to the intended Engine checkout or immutable revision;
a global Bun link is a temporary overlay, not release evidence.

## Storybook and evidence

Use the global `$storybook` with exact package `@layout/storybook` for
lifecycle, automatic origin, static build and browser evidence. This skill does
not own a Storybook process, port, registry, target, lifecycle script or shared
delivery rule. Layout package requirements retain only target-parent, linked
Engine identity and visual expectations.

Canonical overview routes end in `/`; leaves
`/layout/ui-runtime/target/hud` and
`/layout/ui-runtime/target/spatial-display` do not. Unknown suffixes return
404. Browser evidence requires `layoutStorybook=ready`, console 0, a non-black
`#layout-story-canvas`, and exact `layoutStorybookSurfaceParent`: HUD for the
first story and `UiRuntimeDisplay` for the second.

For visual or input changes, use `$storybook` to verify the exact flat-HUD and spatial-display
stories affected, console output, and the rendered WebGPU result. A static build
or unit test alone does not prove browser behavior. Keep WebGPU Inspector
external to repository source and public artifacts.

At handoff report the checkout and revision, Engine dependency identity,
focused and repository checks, Pages build, exact live route and visual evidence
where applicable, and every remaining consumer or owner gate.
