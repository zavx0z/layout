import {describe, expect, test} from "bun:test"

describe("Layout Storybook shared Workbench application", () => {
  test("uses one UiRuntime and all five Workbench regions", async () => {
    const source = await Bun.file(new URL("./main.ts", import.meta.url)).text()

    expect(source.match(/UiRuntime\.create\(/g)).toHaveLength(1)
    expect(source).toContain('from "@zavx0z/storybook/route-tree"')
    expect(source).toContain('from "@zavx0z/storybook/stories"')
    expect(source).toContain('from "@zavx0z/storybook/workbench"')
    expect(source).toContain('from "@zavx0z/storybook/environment"')
    for (const region of [
      "StorybookNavigationSurface",
      "LayoutPreviewHeaderSurface",
      "StorybookDockSurface",
      "StorybookStoryPanelSurface",
    ]) expect(source).toContain(region)
    for (const frame of [".catalog", ".section", ".preview", ".dock", ".info"]) {
      expect(source).toContain(`frames(w, h)${frame}`)
    }
    expect(source).not.toContain("#hud")
    expect(source).not.toContain("#space")
    expect(source).not.toContain("innerHTML")
  })

  test("keeps Workbench fixed while proving two real preview parents", async () => {
    const app = await Bun.file(new URL("./main.ts", import.meta.url)).text()
    const stage = await Bun.file(new URL("./layout-preview-stage.ts", import.meta.url)).text()

    expect(app).toContain("runtime.addHudSurface(catalog")
    expect(app).toContain("runtime.addHudSurface(sections")
    expect(app).toContain("runtime.addHudSurface(previewHeader")
    expect(app).toContain("runtime.addHudSurface(dock")
    expect(app).toContain("runtime.addHudSurface(storyPanel")
    expect(app).toContain("Math.min(560, availableWidth - 36)")
    expect(app).toContain("Math.min(260, availableHeight - 36)")
    expect(stage).toContain('if (story.target === "hud") this.#runtime.addHudSurface(surface, this.#layout)')
    expect(stage).toContain("else this.#runtime.addSurface(surface, this.#layout)")
    expect(stage).toContain("this.#runtime.frameDisplays")
    expect(stage).toContain("this.#runtime.restoreViewPointSnapshot")
    expect(stage).toContain('story.target === "hud" ? this.#runtime.hud : this.#runtime.display')
    expect(stage).toContain("entry.surface.node.parent !== expectedParent")
    expect(app).toContain("dataset.layoutStorybookSurfaceParent = evidence.parent")
  })

  test("publishes the exact route only after an owner frame", async () => {
    const source = await Bun.file(new URL("./main.ts", import.meta.url)).text()

    expect(source).toContain("const initial = await loadStableLayoutStory(router)")
    expect(source).toContain("if (router.current !== initialNode)")
    expect(source).toContain("if (router.current === node) return")
    expect(source).toContain("evidence = previewStage.show(story, (nextEvidence) =>")
    expect(source.indexOf("present()")).toBeLessThan(
      source.lastIndexOf('dataset.layoutStorybook = "ready"'),
    )
  })

  test("keeps every visible shell action Russian and source read-only", async () => {
    const source = await Bun.file(new URL("./main.ts", import.meta.url)).text()
    const story = await Bun.file(new URL("../../core/storybook/runtime-story.ts", import.meta.url)).text()

    for (const text of ["Каталог Layout", "Цели вывода", "Представленные кадры", "Пространственный UIDisplay"]) {
      expect(source).toContain(text)
    }
    expect(story).toContain("один рендерер · сохраняемые поверхности")
    expect(story).toContain("Создано для MetaFor")
    expect(story).not.toContain("Built for MetaFor")
  })
})
