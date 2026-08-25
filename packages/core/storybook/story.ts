/**
Owner contract for lazy `@layout/core` runtime stories.

The private repository Storybook owns the canvas and `UiRuntime` lifecycle.
Each story owns its target, documentation, source example and a fresh
development-only Surface. Nothing in `packages/core/src` imports this module.

@packageDocumentation
*/

import type {UiSurface} from "@layout/core/surface"

export type LayoutRuntimeStoryTarget = "hud" | "spatial-display"

export interface LayoutRuntimeStory {
  readonly id: string
  readonly target: LayoutRuntimeStoryTarget
  readonly title: string
  readonly description: string
  readonly source: string

  /**
  Creates a new unattached Surface for one Storybook preview.

  The caller attaches the returned instance exactly once according to
  `target`: `hud` uses `UiRuntime.addHudSurface()`, while `spatial-display`
  uses `UiRuntime.addSurface()`.

  @returns A fresh Surface whose retained node is not attached to a runtime.
  */
  createSurface(): UiSurface
}
