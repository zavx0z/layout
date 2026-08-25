import {beforeAll, describe, expect, test} from "bun:test"
import {
  BufferGeometry,
  Color,
  Mesh,
  Object3D,
  type TrueTypeFont,
} from "@engine/core"
import {loadSharedFont} from "@engine/core/default-font"
import type {UiRuntime} from "./runtime.ts"
import {
  UiSurface,
  type UiClipShape,
  type UiSurfaceOpts,
} from "./surface.ts"

class ChildClipTestSurface extends UiSurface {
  #draw: () => void

  constructor(opts: UiSurfaceOpts = {}, draw: () => void = () => {}) {
    super(opts)
    this.#draw = draw
  }

  createParent(): Object3D {
    return this.createRetainedParent()
  }

  materialize(parent: Object3D, draw: () => void): void {
    this.materializeRetainedParent(parent, draw)
  }

  transform(parent: Object3D, update: (target: Object3D) => void): void {
    this.updateRetainedTransform(parent, update)
  }

  setVisible(parent: Object3D, visible: boolean): void {
    this.updateRetainedVisibility(parent, visible)
  }

  setViewportClip(parent: Object3D, clip: Readonly<{x: number; y: number; w: number; h: number}>): void {
    this.updateRetainedViewportClip(parent, clip)
  }

  removeParent(parent: Object3D): void {
    this.removeRetainedParent(parent)
  }

  screenMinimumHit(parent: Object3D, shape: UiClipShape): void {
    this.materializeRetainedParent(parent, () => {
      this.withChildClip(shape, () => {
        this.retainedHit(parent, 18, 18, 4, 4, () => {}, {
          key: "minimum",
          screenMinimum: {width: 40, height: 40},
        })
      })
    })
  }

  wheelAt(x: number, y: number): boolean {
    return this.dispatchWheelHit({preventDefault() {}} as WheelEvent, x, y)
  }

  mainLayer(): Object3D {
    return this.node.getObjectByName(`${this.constructor.name}.layer`)!
  }

  retainedOverlayLayer(): Object3D {
    return this.node.getObjectByName(`${this.constructor.name}.retainedOverlayLayer`)!
  }

  protected render(): void {
    this.#draw()
  }
}

type FakeRuntime = Readonly<{
  runtime: UiRuntime
  invalidated: BufferGeometry[]
}>

const createFakeRuntime = (): FakeRuntime => {
  const invalidated: BufferGeometry[] = []
  return {
    runtime: {
      canvas: {style: {}},
      renderer: {
        pixelRatio: 1,
        invalidateGeometry: (geometry: BufferGeometry) => invalidated.push(geometry),
      },
      requestRender() {},
      uiRectToFramebufferClipBounds: (
        xMin: number,
        yMin: number,
        xMax: number,
        yMax: number,
      ): [number, number, number, number] => [xMin, yMin, xMax, yMax],
    } as unknown as UiRuntime,
    invalidated,
  }
}

let font: TrueTypeFont

beforeAll(async () => {
  font = await loadSharedFont(import.meta.resolve("@engine/core/fonts/jetbrains-mono-bold.ttf"))
})

const setupSurface = (
  opts: UiSurfaceOpts = {},
  draw: () => void = () => {},
  rect: Readonly<{w: number; h: number}> = {w: 120, h: 100},
): {surface: ChildClipTestSurface; fake: FakeRuntime} => {
  const fake = createFakeRuntime()
  const surface = new ChildClipTestSurface(opts, draw)
  surface.attachCanvas(fake.runtime)
  surface.setRect({x: 0, y: 0, w: rect.w, h: rect.h}, 0.001, font)
  fake.invalidated.length = 0
  return {surface, fake}
}

const outerRect: UiClipShape = Object.freeze({kind: "rect", x: 0, y: 0, w: 80, h: 80})
const innerRounded: UiClipShape = Object.freeze({
  kind: "rounded-rect",
  x: 10,
  y: 10,
  w: 60,
  h: 60,
  radius: Object.freeze({tl: 30, tr: 20, br: 10, bl: 5}),
})

describe("UiSurface scoped child clips", () => {
  test("attaches one immutable outer-to-inner chain to immediate Mesh/Text and input", () => {
    const {surface} = setupSurface()
    let wheels = 0
    let dismissals = 0
    surface.withChildClip(outerRect, () => {
      surface.withChildClip(innerRounded, () => {
        surface.drawRect(0, 0, 80, 80, new Color(0xffffff))
        surface.drawText("clip", 20, 20, {fontPx: 12, material: surface.materials.text})
        surface.hit(0, 0, 80, 80, () => {}, {key: "nested"})
        surface.wheel(0, 0, 80, 80, () => { wheels += 1 }, "nested-wheel")
        surface.dismissableLayer({
          key: "nested-dismiss",
          regions: [{x: 0, y: 0, w: 80, h: 80}],
          dismiss: () => { dismissals += 1 },
        })
      })
    })

    expect(surface.mainLayer().children).toHaveLength(2)
    for (const visual of surface.mainLayer().children) {
      expect(visual.presentationClips).toHaveLength(2)
      expect(Object.isFrozen(visual.presentationClips)).toBeTrue()
      expect(Object.isFrozen(visual.presentationClips[0])).toBeTrue()
      expect(visual.presentationClips[0]?.radii).toEqual([0, 0, 0, 0])
      expect(visual.presentationClips[1]?.radii).toEqual([0.03, 0.02, 0.01, 0.005])
      expect(visual.presentationClips[0]?.coordinateSpace).toBe(visual.presentationClips[1]?.coordinateSpace)
    }

    expect(surface.pointerHitKey(11, 11)).toBeNull()
    expect(surface.wheelAt(11, 11)).toBeFalse()
    expect(wheels).toBe(0)
    expect(surface.pointerHitKey(12, 68)).toBe("nested")
    expect(surface.pointerHitKey(40, 40)).toBe("nested")
    expect(surface.wheelAt(40, 40)).toBeTrue()
    expect(wheels).toBe(1)

    surface.onPointerDown({button: 0} as MouseEvent, 40, 40)
    expect(dismissals).toBe(0)
    surface.onPointerDown({button: 0} as MouseEvent, 11, 11)
    expect(dismissals).toBe(1)
  })

  test("restores the outer scope after an exception", () => {
    const {surface} = setupSurface()
    expect(() => surface.withChildClip(innerRounded, () => {
      surface.drawRect(10, 10, 20, 20, new Color(0xffffff))
      throw new Error("clip draw failed")
    })).toThrow("clip draw failed")

    surface.drawRect(40, 40, 10, 10, new Color(0xffffff))
    expect(surface.mainLayer().children[0]?.presentationClips).toHaveLength(1)
    expect(surface.mainLayer().children[1]?.presentationClips).toHaveLength(0)
  })

  test("keeps retained visual/input identity through transform and visibility", () => {
    const {surface} = setupSurface()
    const parent = surface.createParent()
    let wheels = 0
    surface.materialize(parent, () => {
      surface.withChildClip({kind: "rounded-rect", x: 0, y: 0, w: 40, h: 40, radius: 10}, () => {
        surface.drawRect(0, 0, 40, 40, new Color(0xffffff))
        surface.hit(0, 0, 40, 40, () => {}, {key: "retained"})
        surface.wheel(0, 0, 40, 40, () => { wheels += 1 }, "retained-wheel")
      })
    })
    const mesh = parent.children[0] as Mesh
    const clips = mesh.presentationClips
    const geometry = mesh.geometry
    expect(clips).toHaveLength(1)
    expect(clips[0]?.coordinateSpace).toBe(parent)
    expect(surface.pointerHitKey(20, 20)).toBe("retained")

    surface.transform(parent, (target) => {
      target.position.set(0.05, -0.02, 0)
    })
    expect(parent.children[0]).toBe(mesh)
    expect(mesh.geometry).toBe(geometry)
    expect(mesh.presentationClips).toBe(clips)
    expect(surface.pointerHitKey(20, 20)).toBeNull()
    expect(surface.pointerHitKey(70, 40)).toBe("retained")
    expect(surface.wheelAt(70, 40)).toBeTrue()
    expect(wheels).toBe(1)

    surface.setViewportClip(parent, {x: 50, y: 20, w: 40, h: 40})
    expect(parent.children[0]).toBe(mesh)
    expect(mesh.geometry).toBe(geometry)
    expect(mesh.presentationClips).toBe(clips)
    expect(surface.pointerHitKey(70, 40)).toBe("retained")

    surface.setVisible(parent, false)
    expect(surface.pointerHitKey(70, 40)).toBeNull()
    expect(surface.wheelAt(70, 40)).toBeFalse()
    surface.setVisible(parent, true)
    expect(surface.pointerHitKey(70, 40)).toBe("retained")

    surface.removeParent(parent)
    expect(parent.parent).toBeNull()
    expect(surface.pointerHitKey(70, 40)).toBeNull()
  })

  test("clips retained screen-minimum input and fails closed for a singular owner", () => {
    const {surface} = setupSurface()
    const parent = surface.createParent()
    surface.screenMinimumHit(parent, {kind: "rounded-rect", x: 0, y: 0, w: 40, h: 40, radius: 20})

    expect(surface.pointerHitKey(1, 1)).toBeNull()
    expect(surface.pointerHitKey(20, 1)).toBe("minimum")
    parent.scale.x = 0
    parent.updateMatrix()
    expect(surface.pointerHitKey(20, 20)).toBeNull()
  })

  test("rolls back retained clip metadata and records atomically", () => {
    const {surface} = setupSurface()
    const parent = surface.createParent()
    surface.materialize(parent, () => {
      surface.withChildClip({kind: "rect", x: 0, y: 0, w: 40, h: 40}, () => {
        surface.drawRect(0, 0, 40, 40, new Color(0xffffff))
        surface.hit(0, 0, 40, 40, () => {}, {key: "old"})
      })
    })
    const previous = parent.children[0]!
    const previousClips = previous.presentationClips

    expect(() => surface.materialize(parent, () => {
      surface.withChildClip({kind: "rounded-rect", x: 60, y: 60, w: 40, h: 40, radius: 20}, () => {
        surface.drawRect(60, 60, 40, 40, new Color(0xffffff))
        surface.hit(60, 60, 40, 40, () => {}, {key: "new"})
        throw new Error("rollback")
      })
    })).toThrow("rollback")

    expect(parent.children).toEqual([previous])
    expect(previous.presentationClips).toBe(previousClips)
    expect(surface.pointerHitKey(20, 20)).toBe("old")
    expect(surface.pointerHitKey(80, 80)).toBeNull()
    surface.drawRect(100, 0, 10, 10, new Color(0xffffff))
    expect(surface.mainLayer().children.at(-1)?.presentationClips).toHaveLength(0)
  })

  test("keeps retained portal pixels and input on the exact owner clip chain", () => {
    const {surface} = setupSurface()
    const parent = surface.createParent()
    let wheels = 0
    surface.materialize(parent, () => {
      surface.withChildClip({kind: "rounded-rect", x: 0, y: 0, w: 50, h: 50, radius: 20}, () => {
        surface.withOverlayPortal(() => {
          surface.drawRect(0, 0, 50, 50, new Color(0xffffff))
          surface.hit(0, 0, 50, 50, () => {}, {key: "portal"})
          surface.wheel(0, 0, 50, 50, () => { wheels += 1 }, "portal-wheel")
        })
      })
    })

    expect(parent.children).toHaveLength(0)
    const portal = surface.retainedOverlayLayer().children[0]!
    const visual = portal.children[0]!
    expect(visual.presentationClips).toHaveLength(1)
    expect(visual.presentationClips[0]?.coordinateSpace).toBe(parent)
    expect(surface.pointerHitKey(1, 1)).toBeNull()
    expect(surface.pointerHitKey(25, 25)).toBe("portal")
    expect(surface.wheelAt(25, 25)).toBeTrue()
    expect(wheels).toBe(1)

    surface.transform(parent, (target) => target.position.set(0.04, -0.01, 0))
    expect(visual.presentationClips[0]?.coordinateSpace).toBe(parent)
    expect(surface.pointerHitKey(25, 25)).toBeNull()
    expect(surface.pointerHitKey(65, 35)).toBe("portal")
  })

  test("uses Surface border radius as the root visual/hit/wheel clip", () => {
    let surface!: ChildClipTestSurface
    let wheels = 0
    const fake = createFakeRuntime()
    surface = new ChildClipTestSurface({
      bgColor: new Color(0x222222),
      borderColor: new Color(0x444444),
      borderRadiusPx: 20,
      padding: 10,
    }, () => {
      surface.drawRect(0, 0, 80, 60, new Color(0xffffff))
      surface.hit(-10, -10, 100, 80, () => {}, {key: "root"})
      surface.wheel(-10, -10, 100, 80, () => { wheels += 1 }, "root-wheel")
    })
    surface.attachCanvas(fake.runtime)
    surface.setRect({x: 0, y: 0, w: 100, h: 80}, 0.001, font)

    const visual = surface.mainLayer().children[0]!
    expect(visual.presentationClips).toHaveLength(1)
    expect(visual.presentationClips[0]?.center).toEqual([0.04, -0.03])
    expect(visual.presentationClips[0]?.halfSize).toEqual([0.05, 0.04])
    expect(visual.presentationClips[0]?.radii).toEqual([0.02, 0.02, 0.02, 0.02])
    expect(surface.pointerHitKey(1, 1)).toBeNull()
    expect(surface.pointerHitKey(50, 40)).toBe("root")
    surface.onWheel({preventDefault() {}} as WheelEvent, 1, 1)
    expect(wheels).toBe(0)
    surface.onWheel({preventDefault() {}} as WheelEvent, 50, 40)
    expect(wheels).toBe(1)

    surface.dispose()
    expect(surface.mainLayer().children).toHaveLength(0)
    expect(surface.pointerHitKey(50, 40)).toBeNull()
  })
})
