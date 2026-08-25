import {describe, expect, test} from "bun:test"
import {Object3D} from "@engine/core"
import type {UiRuntime, UiRuntimeViewPointSnapshot} from "@layout/core/runtime"
import type {UiSurface} from "@layout/core/surface"
import type {LayoutRuntimeStory, LayoutRuntimeStoryTarget} from "../../core/storybook/story.ts"
import {LayoutPreviewStage} from "./layout-preview-stage.ts"

describe("Layout preview target ownership", () => {
  test("rehides every inactive target after runtime relayout and prepares evidence before rendering", () => {
    const hudParent = new Object3D()
    const displayParent = new Object3D()
    const space = new Object3D()
    const attached: UiSurface[] = []
    let prepared = false
    const renderPrepared: boolean[] = []
    const resurrectAll = (): void => {
      for (const surface of attached) surface.node.visible = true
    }
    const runtime = {
      hud: hudParent,
      display: displayParent,
      space,
      viewPoint: {},
      renderer: {
        renderFrame() {
          renderPrepared.push(prepared)
          prepared = false
        },
      },
      viewPointSnapshot: () => ({}) as UiRuntimeViewPointSnapshot,
      addHudSurface(surface: UiSurface) {
        attached.push(surface)
        hudParent.add(surface.node)
      },
      addSurface(surface: UiSurface) {
        attached.push(surface)
        displayParent.add(surface.node)
      },
      restoreViewPointSnapshot() {
        resurrectAll()
        return true
      },
      frameDisplays() {
        resurrectAll()
      },
      handleResize() {
        resurrectAll()
      },
    } as unknown as UiRuntime
    const stage = new LayoutPreviewStage(runtime, () => ({x: 0, y: 0, w: 400, h: 240}))
    const hud = story("hud")
    const spatial = story("spatial-display")

    stage.show(hud.story, (evidence) => {
      prepared = true
      expect(evidence).toEqual({target: "hud", parent: "HUD", frames: 1})
      expect(hud.surface.node.visible).toBeTrue()
    })
    stage.show(spatial.story, (evidence) => {
      prepared = true
      expect(evidence).toEqual({target: "spatial-display", parent: "UiRuntimeDisplay", frames: 2})
      expect(hud.surface.node.visible).toBeFalse()
      expect(spatial.surface.node.visible).toBeTrue()
    })
    stage.show(hud.story, (evidence) => {
      prepared = true
      expect(evidence).toEqual({target: "hud", parent: "HUD", frames: 3})
      expect(hud.surface.node.visible).toBeTrue()
      expect(spatial.surface.node.visible).toBeFalse()
    })

    expect(renderPrepared).toEqual([true, true, true])
  })
})

function story(target: LayoutRuntimeStoryTarget): Readonly<{
  story: LayoutRuntimeStory
  surface: UiSurface
}> {
  const surface = {
    node: new Object3D(),
    flushPendingRender() {},
  } as unknown as UiSurface
  return {
    surface,
    story: {
      id: target,
      target,
      title: target,
      description: target,
      source: target,
      createSurface: () => surface,
    },
  }
}
