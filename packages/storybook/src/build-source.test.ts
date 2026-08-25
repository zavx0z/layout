import {describe, expect, test} from "bun:test"
import {join} from "node:path"
import {
  LAYOUT_REPOSITORY_ROOT,
  LAYOUT_STORYBOOK_OUTPUT_ROOT,
  createLayoutStorybookStaticBuildOptions,
} from "./static-build.ts"

describe("Layout Storybook static build source", () => {
  test("keeps shared UI providers in private development manifests only", async () => {
    const root = await Bun.file(new URL("../../../package.json", import.meta.url)).json() as {
      devDependencies?: Record<string, string>
    }
    const storybook = await Bun.file(new URL("../package.json", import.meta.url)).json() as {
      dependencies?: Record<string, string>
    }
    const core = await Bun.file(new URL("../../core/package.json", import.meta.url)).json() as {
      dependencies?: Record<string, string>
    }
    const providers = {
      "@ui/components": "link:@ui/components",
      "@ui/elements": "link:@ui/elements",
      "@zavx0z/highlighter": "link:@zavx0z/highlighter",
      "@zavx0z/storybook": "link:@zavx0z/storybook",
    }

    for (const [name, specifier] of Object.entries(providers)) {
      expect(root.devDependencies?.[name], name).toBe(specifier)
      expect(storybook.dependencies?.[name], name).toBe(specifier)
      expect(core.dependencies?.[name], name).toBeUndefined()
    }
  })

  test("records exact Engine, Layout, UI, Highlighter and shared identities", async () => {
    const options = await createLayoutStorybookStaticBuildOptions()

    expect(options.app.id).toBe("layout")
    expect(options.app.basePath).toBe("/layout")
    expect(options.outputRoot).toBe(join(LAYOUT_REPOSITORY_ROOT, "dist"))
    expect(options.outputRoot).toBe(LAYOUT_STORYBOOK_OUTPUT_ROOT)
    expect(options.source.revision).toMatch(/^[0-9a-f]{40,64}$/)
    expect(typeof options.source.dirty).toBe("boolean")
    expect(options.dependencies.map(({name}) => name)).toEqual([
      "@engine/core",
      "@layout/core",
      "@ui/workspace",
      "@zavx0z/highlighter",
      "@zavx0z/storybook",
    ])
    for (const dependency of options.dependencies) {
      expect(dependency.revision, dependency.name).toMatch(/^[0-9a-f]{40,64}$/)
      expect(typeof dependency.dirty, dependency.name).toBe("boolean")
    }
    expect(options.dependencies[1]?.revision).toBe(options.source.revision)
    expect(options.staticFiles).toHaveLength(1)
    expect(options.staticFiles[0]?.publicPath).toBe("/fonts/jetbrains-mono-bold.ttf")
    expect(await Bun.file(options.staticFiles[0]!.sourcePath).exists()).toBeTrue()
  })

  test("delegates schema-1 output to the shared atomic builder", async () => {
    const source = await Bun.file(new URL("../scripts/build.ts", import.meta.url)).text()
    const manifest = await Bun.file(new URL("../package.json", import.meta.url)).json() as {
      scripts?: Record<string, string>
    }

    expect(source).toContain('from "@zavx0z/storybook/build"')
    expect(source).toContain("buildStaticStorybook(options)")
    expect(source).not.toContain("LAYOUT_STORYBOOK_BASE_PATH")
    expect(source).not.toContain("Bun.build")
    expect(source).not.toContain("rm(outputRoot")
    expect(source).not.toContain("copyFile")
    expect(manifest.scripts?.pages).toBe("bun scripts/build.ts")
    expect(await Bun.file(new URL("../scripts/build-pages.ts", import.meta.url)).exists()).toBeFalse()
  })

  test("keeps generated Pages output only in ignored repository-root dist", async () => {
    const ignore = await Bun.file(new URL("../../../.gitignore", import.meta.url)).text()
    const workflow = await Bun.file(new URL("../../../.github/workflows/pages.yml", import.meta.url)).text()

    expect(ignore.split(/\r?\n/)).toContain("dist/")
    expect(workflow).toContain("          path: dist")
    expect(workflow).not.toContain("path: packages/storybook/pages")
  })

  test("pins and registers the complete cold Pages dependency graph", async () => {
    const workflow = await Bun.file(new URL("../../../.github/workflows/pages.yml", import.meta.url)).text()
    const pins = [
      ["zavx0z/engine", "ae461b8ab622d391247c714f3937f18bd5b4ae45"],
      ["zavx0z/ui", "1ab29de686b1bb238d43e37a55d9ed428ccc799d"],
      ["zavx0z/highlighter", "a9f240b682a6ccec042ea04522220f153d3b53eb"],
      ["zavx0z/storybook", "bbacaa721b9327dc771f348f017bd6e0a7cef3df"],
    ] as const

    expect(workflow).toContain("  workflow_dispatch:")
    for (const [repository, revision] of pins) {
      expect(workflow, repository).toContain(`repository: ${repository}`)
      expect(workflow, repository).toContain(`ref: ${revision}`)
    }

    const bootstrap = [
      "name: Register Engine package",
      "name: Register Layout package",
      "name: Register UI Elements package",
      "name: Register UI Components package",
      "name: Install and verify Highlighter dependency",
      "name: Register Highlighter package",
      "name: Install shared Storybook dependencies",
      "name: Register shared Storybook package",
      "name: Install UI dependencies",
      "name: Install Layout dependencies",
      "name: Check Layout",
      "name: Build static Layout Storybook",
    ]
    const positions = bootstrap.map((marker) => workflow.indexOf(marker))
    expect(positions.every((position) => position >= 0)).toBeTrue()
    expect(positions).toEqual([...positions].sort((left, right) => left - right))
    expect(workflow.match(/run: bun link/g)?.length).toBe(6)
    expect(workflow.match(/bun install --frozen-lockfile/g)?.length).toBe(4)
  })
})
