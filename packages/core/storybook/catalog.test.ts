import {describe, expect, test} from "bun:test"
import {
  LAYOUT_STORYBOOK_CATALOG,
  layoutStorybookPresentationRoute,
} from "./catalog.ts"
import {RuntimeStory} from "./runtime-story.ts"

const HUD_ROUTE = "ui-runtime/target/hud"
const SPATIAL_ROUTE = "ui-runtime/target/spatial-display"

describe("@layout/core Storybook catalog", () => {
  test("owns two exact pathname leaves with Russian catalog text", () => {
    expect(LAYOUT_STORYBOOK_CATALOG.routeTree.leaves).toEqual([HUD_ROUTE, SPATIAL_ROUTE])
    expect(LAYOUT_STORYBOOK_CATALOG.representative).toBe(HUD_ROUTE)
    expect(LAYOUT_STORYBOOK_CATALOG.index).toHaveLength(2)

    const hud = LAYOUT_STORYBOOK_CATALOG.find(HUD_ROUTE)
    const spatial = LAYOUT_STORYBOOK_CATALOG.find(SPATIAL_ROUTE)

    expect(hud).toMatchObject({
      groupLabel: "Среда UI",
      componentLabel: "Среда интерфейса",
      apiName: "UiRuntime",
      sectionLabel: "Цель вывода",
      variantLabel: "HUD на камере",
      title: "Поверхность UiRuntime в HUD",
    })
    expect(spatial).toMatchObject({
      groupLabel: "Среда UI",
      componentLabel: "Среда интерфейса",
      apiName: "UiRuntime",
      sectionLabel: "Цель вывода",
      variantLabel: "Пространственный дисплей",
      title: "Поверхность UiRuntime на пространственном дисплее",
    })
    expect(hud?.tags).toEqual([
      "один рендерер",
      "удерживаемая поверхность",
      "камера",
      "экранная поверхность",
    ])
    expect(spatial?.tags).toEqual([
      "один рендерер",
      "удерживаемая поверхность",
      "пространство",
      "виртуальный дисплей",
    ])
  })

  test("resolves only registered leaves and overviews", () => {
    expect(layoutStorybookPresentationRoute("")).toBe(HUD_ROUTE)
    expect(layoutStorybookPresentationRoute("ui-runtime")).toBe(HUD_ROUTE)
    expect(layoutStorybookPresentationRoute("ui-runtime/target")).toBe(HUD_ROUTE)
    expect(layoutStorybookPresentationRoute(SPATIAL_ROUTE)).toBe(SPATIAL_ROUTE)
    expect(() => layoutStorybookPresentationRoute("ui-runtime/unknown")).toThrow(
      "Неизвестный маршрут истории Layout: ui-runtime/unknown",
    )
  })

  test("loads independent HUD and spatial owner modules", async () => {
    const hud = await LAYOUT_STORYBOOK_CATALOG.load(HUD_ROUTE)
    const spatial = await LAYOUT_STORYBOOK_CATALOG.load(SPATIAL_ROUTE)

    expect(hud.target).toBe("hud")
    expect(hud.description).toContain("UiRuntime.addHudSurface()")
    expect(hud.source).toContain('from "@layout/core/runtime"')
    expect(hud.source).toContain("runtime.addHudSurface(surface")

    expect(spatial.target).toBe("spatial-display")
    expect(spatial.description).toContain("UiRuntime.addSurface()")
    expect(spatial.source).toContain('from "@layout/core/runtime"')
    expect(spatial.source).toContain("runtime.addSurface(surface")
    expect(spatial.source).not.toContain("addHudSurface")

    const hudSurface = hud.createSurface()
    const spatialSurface = spatial.createSurface()
    expect(hudSurface).toBeInstanceOf(RuntimeStory)
    expect(spatialSurface).toBeInstanceOf(RuntimeStory)
    expect(spatialSurface).not.toBe(hudSurface)
  })

  test("fails closed for an unknown suffix", async () => {
    expect(LAYOUT_STORYBOOK_CATALOG.find("ui-runtime/target/unknown")).toBeUndefined()
    await expect(LAYOUT_STORYBOOK_CATALOG.load("ui-runtime/target/unknown")).rejects.toThrow(
      "Unknown storybook story route: ui-runtime/target/unknown",
    )
  })
})
