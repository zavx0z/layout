import {describe, expect, test} from "bun:test"
import {storybookPageRoutes} from "@zavx0z/storybook/app"
import {LAYOUT_STORYBOOK_CATALOG} from "../../core/storybook/catalog.ts"
import {createLayoutStorybookApp} from "./storybook-app.ts"

describe("Layout Storybook app manifest", () => {
  test("owns one WebGPU page under /layout with exact evidence and Russian shell text", () => {
    const app = createLayoutStorybookApp()

    expect(app.id).toBe("layout")
    expect(app.basePath).toBe("/layout")
    expect(app.home).toEqual({
      path: "/",
      label: "Главная",
      ariaLabel: "На главную Layout Storybook",
    })
    expect(app.footer).toEqual({
      lead: "Создано для",
      owner: {
        label: "MetaFor",
        href: "https://github.com/zavx0z/metafor",
      },
      detail: "переиспользуемая WebGPU-инфраструктура Layout",
    })
    expect(app.head.meta).toEqual([{
      kind: "public-path",
      name: "engine-default-font",
      path: "/fonts/jetbrains-mono-bold.ttf",
    }])
    expect(app.pages).toHaveLength(1)

    const page = app.pages[0]!
    expect(page.id).toBe("layout")
    expect(page.mountPath).toBe("/")
    expect(page.body).toEqual({kind: "canvas", canvasId: "layout-story-canvas"})
    expect(page.capability).toBe("webgpu")
    expect(page.readiness).toEqual({dataset: "layoutStorybook", value: "ready"})
    expect(page.canvas).toEqual({id: "layout-story-canvas", evidence: "non-black"})
    expect(page.routeTree).toBe(LAYOUT_STORYBOOK_CATALOG.routeTree)
    expect(storybookPageRoutes(app, page)[0]).toBe("/layout/")
  })
})
