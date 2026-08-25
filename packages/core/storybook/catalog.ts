/**
Typed pathname catalog owned by `@layout/core`.

Metadata is eager and each exact detail leaf loads one independent owner
module. Unknown paths fail closed in the shared generic catalog.

@packageDocumentation
*/

import {defineStorybookStoryCatalog} from "@zavx0z/storybook/stories"
import {
  LAYOUT_RUNTIME_STORY_METADATA_BY_ROUTE,
  runtimeHudStoryMetadata,
  runtimeSpatialDisplayStoryMetadata,
  type LayoutRuntimeStoryMetadata,
} from "./metadata.ts"
import type {LayoutRuntimeStory} from "./story.ts"

type LayoutRuntimeStoryRoute = keyof typeof LAYOUT_RUNTIME_STORY_METADATA_BY_ROUTE

const metadataForRoute = (route: string): LayoutRuntimeStoryMetadata => {
  const metadata = LAYOUT_RUNTIME_STORY_METADATA_BY_ROUTE[route as LayoutRuntimeStoryRoute]
  if (metadata === undefined) throw new Error(`Неизвестный маршрут истории Layout: ${route}`)
  return metadata
}

const normalizeLayoutRuntimeStory = (route: string, loaded: unknown): LayoutRuntimeStory => {
  if (loaded === null || typeof loaded !== "object") {
    throw new Error(`История Layout не загрузила объект: ${route}`)
  }
  const story = loaded as Partial<LayoutRuntimeStory>
  const metadata = metadataForRoute(route)
  if (story.id !== metadata.id) throw new Error(`id истории Layout не совпадает с маршрутом: ${route}`)
  if (story.target !== metadata.target) throw new Error(`target истории Layout не совпадает с маршрутом: ${route}`)
  if (story.title !== metadata.title) throw new Error(`title истории Layout не совпадает с маршрутом: ${route}`)
  if (story.description !== metadata.description) {
    throw new Error(`description истории Layout не совпадает с маршрутом: ${route}`)
  }
  if (story.source !== metadata.source) throw new Error(`source истории Layout не совпадает с маршрутом: ${route}`)
  if (typeof story.createSurface !== "function") {
    throw new Error(`createSurface истории Layout должен быть функцией: ${route}`)
  }
  return loaded as LayoutRuntimeStory
}

export const LAYOUT_STORYBOOK_CATALOG = defineStorybookStoryCatalog<unknown, LayoutRuntimeStory>({
  groups: [{
    id: "runtime",
    label: "Среда UI",
    components: [{
      id: "ui-runtime",
      label: "Среда интерфейса",
      apiName: "UiRuntime",
      tags: ["один рендерер", "удерживаемая поверхность"],
      sections: [{
        id: "target",
        label: "Цель вывода",
        variants: [
          {
            id: "hud",
            label: "HUD на камере",
            title: runtimeHudStoryMetadata.title,
            tags: ["камера", "экранная поверхность"],
            load: () => import("./stories/hud.stories.ts")
              .then(({runtimeHudStory}) => runtimeHudStory),
          },
          {
            id: "spatial-display",
            label: "Пространственный дисплей",
            title: runtimeSpatialDisplayStoryMetadata.title,
            tags: ["пространство", "виртуальный дисплей"],
            load: () => import("./stories/spatial-display.stories.ts")
              .then(({runtimeSpatialDisplayStory}) => runtimeSpatialDisplayStory),
          },
        ],
      }],
    }],
  }],
  representative: {component: "ui-runtime", section: "target", variant: "hud"},
  normalizeModule: normalizeLayoutRuntimeStory,
})

/**
Resolves a registered overview to its first owned detail without turning that
presentation choice into a routing fallback.

@param path - Exact route-tree path without a leading or trailing slash.

@returns The same exact leaf, the root representative, or the first detail
below a registered non-root overview.

@throws If `path` is not present in the owner route tree.

@example
```ts
layoutStorybookPresentationRoute("ui-runtime/target")
// "ui-runtime/target/hud"
```
*/
export function layoutStorybookPresentationRoute(path: string): string {
  const node = LAYOUT_STORYBOOK_CATALOG.routeTree.find(path)
  if (node === undefined) throw new Error(`Неизвестный маршрут истории Layout: ${path}`)
  if (node.kind === "leaf") return node.path
  if (node.path === "") return LAYOUT_STORYBOOK_CATALOG.representative

  const prefix = `${node.path}/`
  const descendant = LAYOUT_STORYBOOK_CATALOG.index.find(({route}) => route.startsWith(prefix))
  if (descendant === undefined) throw new Error(`Обзор Layout не содержит истории: ${path}`)
  return descendant.route
}
