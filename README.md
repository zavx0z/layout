# Layout

**A retained UI engine for HUDs, virtual displays, and immersive WebGPU interfaces. Built for [MetaFor](https://github.com/zavx0z/metafor).**

[![Pages](https://img.shields.io/badge/Storybook-live-5eaed6)](https://zavx0z.github.io/layout/)
[![WebGPU](https://img.shields.io/badge/WebGPU-native-8b5cf6)](https://www.w3.org/TR/webgpu/)
[![MetaFor](https://img.shields.io/badge/built%20for-MetaFor-22c55e)](https://github.com/zavx0z/metafor)

Layout provides a WebGPU interface runtime. It owns one Engine renderer and retained Space, then coordinates surfaces, pointer and keyboard input, camera-locked HUDs, texture-target descriptors, and optional world-space displays without imposing a visual component library.

## Why it exists

Most interface frameworks stop at a flat browser viewport. Layout is built for software that may run as a conventional 2D HUD today and move the same interface into glasses, headsets, spatial canvases, or multiple virtual displays tomorrow.

- one render-on-demand runtime instead of a second animation engine;
- retained surface identity and transform-only updates;
- logical UI pixels mapped to millimetre-based world coordinates;
- HUD and spatial-display targets, plus texture-target descriptors;
- mouse, touch, keyboard, IME, clipping, focus, and display navigation;
- a compact FlexBox planner for deterministic interface geometry.

Layout is infrastructure, not a theme. Visual Elements and Components live in [zavx0z/ui](https://github.com/zavx0z/ui); high-performance node editors live in [zavx0z/node](https://github.com/zavx0z/node); GPU primitives come from [zavx0z/engine](https://github.com/zavx0z/engine).

## Storybook

The static [Layout Storybook](https://zavx0z.github.io/layout/) demonstrates the same runtime as a flat HUD and as a spatial display. It is built on every green `main` and deployed to GitHub Pages.

## Workspace

```text
packages/
  core/       @layout/core
  storybook/  @layout/storybook
```

Packages are internal build identities. Local development links them directly; they are not published to npm.

## Development

```bash
cd ../engine/packages/core && bun link
cd ../../../layout
bun install
bun run check
bun run storybook
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for ownership and [CONTRIBUTING.md](CONTRIBUTING.md) for contribution workflow.
