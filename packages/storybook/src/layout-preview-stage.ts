/**
Layout-owned preview target inside the shared Storybook Workbench.

The Workbench and both preview variants share one `UiRuntime`, renderer, Space
and browser canvas. HUD stories attach to the camera-locked HUD; spatial stories
attach to the real `UIDisplay`. Only the selected retained surface is visible.

@packageDocumentation
*/

import type {
  UiRuntime,
  UiRuntimeViewPointSnapshot,
  UiSurfaceLayoutFn,
} from "@layout/core/runtime"
import type {UiSurface} from "@layout/core/surface"
import type {LayoutRuntimeStory} from "../../core/storybook/story.ts"

export type LayoutPreviewEvidence = Readonly<{
  target: LayoutRuntimeStory["target"]
  parent: string
  frames: number
}>

type PreviewEntry = Readonly<{
  story: LayoutRuntimeStory
  surface: UiSurface
}>

export class LayoutPreviewStage {
  readonly #runtime: UiRuntime
  readonly #layout: UiSurfaceLayoutFn
  readonly #nearSnapshot: UiRuntimeViewPointSnapshot
  readonly #entries = new Map<string, PreviewEntry>()
  #frames = 0

  constructor(runtime: UiRuntime, layout: UiSurfaceLayoutFn) {
    this.#runtime = runtime
    this.#layout = layout
    this.#nearSnapshot = runtime.viewPointSnapshot()
  }

  get frames(): number {
    return this.#frames
  }

  show(
    story: LayoutRuntimeStory,
    prepareWorkbench: (evidence: LayoutPreviewEvidence) => void,
  ): LayoutPreviewEvidence {
    let entry = this.#entries.get(story.id)
    if (entry === undefined) {
      const surface = story.createSurface()
      if (story.target === "hud") this.#runtime.addHudSurface(surface, this.#layout)
      else this.#runtime.addSurface(surface, this.#layout)
      entry = Object.freeze({story, surface})
      this.#entries.set(story.id, entry)
    }

    if (story.target === "hud") {
      if (!this.#runtime.restoreViewPointSnapshot(this.#nearSnapshot)) {
        throw new Error("Layout Storybook could not restore the HUD view")
      }
    } else {
      this.#runtime.frameDisplays(undefined, {padding: 1.16})
    }

    this.#runtime.handleResize()
    for (const candidate of this.#entries.values()) candidate.surface.node.visible = candidate === entry
    entry.surface.flushPendingRender()
    const expectedParent = story.target === "hud" ? this.#runtime.hud : this.#runtime.display
    if (expectedParent === null || entry.surface.node.parent !== expectedParent) {
      throw new Error(`Layout Storybook target parent does not match ${story.target}`)
    }
    const evidence = Object.freeze({
      target: story.target,
      parent: story.target === "hud" ? "HUD" : "UiRuntimeDisplay",
      frames: this.#frames + 1,
    })
    prepareWorkbench(evidence)
    this.#runtime.space.updateWorldMatrix()
    this.#runtime.renderer.renderFrame(this.#runtime.space, this.#runtime.hud, this.#runtime.viewPoint)
    this.#frames = evidence.frames
    return evidence
  }
}
