/**
Layout-owned application graph shared by local and static delivery.

The catalog remains owned by `@layout/core`, while this private package owns
the `/layout/` shell, evidence descriptors and Engine font route.

@packageDocumentation
*/

import {join} from "node:path"
import {fileURLToPath} from "node:url"
import {
  defineStorybookApp,
  type StorybookAppManifest,
  type StorybookStaticFile,
} from "@zavx0z/storybook/app"
import {LAYOUT_STORYBOOK_CATALOG} from "../../core/storybook/catalog.ts"

const storybookRoot = join(import.meta.dir, "..")

/**
Creates the one Layout Storybook manifest used by both delivery modes.

@returns A validated app pinned to `/layout` with one WebGPU page.

@throws If the shared validator rejects the owner catalog or evidence graph.
*/
export function createLayoutStorybookApp(): StorybookAppManifest {
  return defineStorybookApp({
    id: "layout",
    title: "Layout Storybook",
    basePath: "/layout",
    home: {
      path: "/",
      label: "Главная",
      ariaLabel: "На главную Layout Storybook",
    },
    footer: {
      lead: "Создано для",
      owner: {
        label: "MetaFor",
        href: "https://github.com/zavx0z/metafor",
      },
      detail: "переиспользуемая WebGPU-инфраструктура Layout",
    },
    head: {meta: [{
      kind: "public-path",
      name: "engine-default-font",
      path: "/fonts/jetbrains-mono-bold.ttf",
    }]},
    pages: [{
      id: "layout",
      title: "Layout Storybook · @layout/core",
      mountPath: "/",
      entrypoint: join(storybookRoot, "src/main.ts"),
      stylePath: join(storybookRoot, "src/styles.css"),
      body: {kind: "canvas", canvasId: "layout-story-canvas"},
      capability: "webgpu",
      readiness: {dataset: "layoutStorybook", value: "ready"},
      canvas: {id: "layout-story-canvas", evidence: "non-black"},
      routeTree: LAYOUT_STORYBOOK_CATALOG.routeTree,
    }],
  })
}

/**
Resolves the Engine-owned font without copying it into Layout source.

@returns The exact static-file descriptor consumed by server and build.
*/
export function layoutStorybookStaticFiles(): readonly StorybookStaticFile[] {
  return Object.freeze([{
    publicPath: "/fonts/jetbrains-mono-bold.ttf",
    sourcePath: fileURLToPath(import.meta.resolve("@engine/core/fonts/jetbrains-mono-bold.ttf")),
  }])
}
