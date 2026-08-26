import {describe, expect, test} from "bun:test"
import {storybookPageRoutes} from "@zavx0z/storybook/app"
import {startStorybookHubServer} from "@zavx0z/storybook/server"
import {
  createLayoutStorybookApp,
  layoutStorybookStaticFiles,
} from "./storybook-app.ts"

describe("Layout Storybook no-HMR server", () => {
  test("serves only canonical /layout routes, the exact canvas and Engine font", async () => {
    const app = createLayoutStorybookApp()
    const server = startStorybookHubServer({
      app,
      hostname: "127.0.0.1",
      port: 0,
      staticFiles: layoutStorybookStaticFiles(),
    })

    try {
      const origin = server.url.origin
      const redirect = await fetch(`${origin}/layout`, {redirect: "manual"})
      expect(redirect.status).toBe(308)
      expect(redirect.headers.get("location")).toBe("/layout/")

      const routes = storybookPageRoutes(app, app.pages[0]!)
      for (const pathname of [routes[0]!, routes.at(-1)!]) {
        const response = await fetch(`${origin}${pathname}`)
        const html = await response.text()
        expect(response.status, pathname).toBe(200)
        expect(html, pathname).toContain('<base href="/layout/">')
        expect(html, pathname).toContain('<meta name="engine-default-font" content="/layout/fonts/jetbrains-mono-bold.ttf">')
        expect(html, pathname).toContain('<canvas id="layout-story-canvas"></canvas>')
        expect(html, pathname).toContain("Создано для&nbsp;<a")
        expect(html, pathname).toContain("переиспользуемая WebGPU-инфраструктура Layout")
        expect(html, pathname).not.toContain("Built for MetaFor")
      }

      expect(await fetch(`${origin}/`).then(({status}) => status)).toBe(404)
      expect(await fetch(`${origin}/layout/missing`).then(({status}) => status)).toBe(404)
      expect(await fetch(`${origin}/missing`).then(({status}) => status)).toBe(404)
      const font = await fetch(`${origin}/layout/fonts/jetbrains-mono-bold.ttf`)
      expect(font.status).toBe(200)
      expect((await font.arrayBuffer()).byteLength).toBeGreaterThan(0)
    } finally {
      server.stop(true)
    }
  })

  test("keeps the runnable lifecycle on the shared package server and automatic port", async () => {
    const source = await Bun.file(new URL("../scripts/serve.ts", import.meta.url)).text()
    const manifest = await Bun.file(new URL("../package.json", import.meta.url)).json() as {
      scripts?: Record<string, string>
    }

    expect(source).toContain('from "@zavx0z/storybook/server"')
    expect(source).toContain("startStorybookPackageServer({")
    expect(source).not.toContain("port:")
    expect(source).not.toMatch(/LAYOUT_STORYBOOK_(?:HOST|PORT)/u)
    expect(source).not.toContain("Bun.serve")
    expect(manifest.scripts).toEqual({
      storybook: "bun scripts/serve.ts",
      build: "bun scripts/build.ts",
      test: "bun test src",
      typecheck: "tsc --project tsconfig.json --pretty false",
      check: "bun run typecheck && bun run test && bun run build",
    })
  })
})
