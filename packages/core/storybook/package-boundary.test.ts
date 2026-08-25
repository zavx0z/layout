import {describe, expect, test} from "bun:test"

describe("@layout/core Storybook owner boundary", () => {
  test("keeps development stories outside production exports, dependencies and typecheck", async () => {
    const manifest = await Bun.file(new URL("../package.json", import.meta.url)).json()
    const tsconfig = await Bun.file(new URL("../tsconfig.json", import.meta.url)).json()

    expect(Object.keys(manifest.exports)).not.toContain("./storybook")
    expect(JSON.stringify(manifest)).not.toContain("@zavx0z/storybook")
    expect(JSON.stringify(manifest)).not.toContain("@ui/")
    expect(tsconfig.include).toEqual(["src/**/*.ts", "src/**/*.json"])
    expect(JSON.stringify(tsconfig)).not.toContain("storybook")
  })

  test("keeps one independent dynamic import per target story", async () => {
    const source = await Bun.file(new URL("./catalog.ts", import.meta.url)).text()

    expect(source.match(/\bimport\("\.\/stories\//g)).toHaveLength(2)
    expect(source).toContain('import("./stories/hud.stories.ts")')
    expect(source).toContain('import("./stories/spatial-display.stories.ts")')
    expect(source).not.toMatch(/from "\.\/stories\/[^"]+\.stories\.ts"/)
  })

  test("keeps production source independent from Storybook and visual UI packages", async () => {
    const glob = new Bun.Glob("src/**/*.ts")
    for await (const path of glob.scan(new URL("..", import.meta.url).pathname)) {
      const source = await Bun.file(new URL(`../${path}`, import.meta.url)).text()
      expect(source, path).not.toContain("@zavx0z/storybook")
      expect(source, path).not.toMatch(/from ["']@ui\//)
    }
  })
})
