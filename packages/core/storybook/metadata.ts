import type {LayoutRuntimeStory} from "./story.ts"

export type LayoutRuntimeStoryMetadata = Omit<LayoutRuntimeStory, "createSurface">

export const runtimeHudStoryMetadata: LayoutRuntimeStoryMetadata = Object.freeze({
  id: "ui-runtime-target-hud",
  target: "hud",
  title: "Поверхность UiRuntime в HUD",
  description: "Карточка закреплена на камере и подключена через точный вызов UiRuntime.addHudSurface().",
  source: `import {UiRuntime} from "@layout/core/runtime"
import {RuntimeStory} from "../runtime-story.ts"

const runtime = await UiRuntime.create(canvas, {
  virtualDisplay: {initial: "near", surfaceDisplay: true, grid: true},
})
const surface = new RuntimeStory({bgColor: null, borderColor: null})

runtime.addHudSurface(surface, ({w, h}) => ({
  x: Math.max(18, (w - Math.min(560, w - 36)) / 2),
  y: Math.max(80, (h - Math.min(260, h - 150)) / 2),
  w: Math.min(560, w - 36),
  h: Math.min(260, h - 150),
}))`,
})

export const runtimeSpatialDisplayStoryMetadata: LayoutRuntimeStoryMetadata = Object.freeze({
  id: "ui-runtime-target-spatial-display",
  target: "spatial-display",
  title: "Поверхность UiRuntime на пространственном дисплее",
  description: "Карточка принадлежит встроенному UIDisplay и подключена через точный вызов UiRuntime.addSurface().",
  source: `import {UiRuntime} from "@layout/core/runtime"
import {RuntimeStory} from "../runtime-story.ts"

const runtime = await UiRuntime.create(canvas, {
  virtualDisplay: {initial: "far", surfaceDisplay: true, grid: true},
})
const surface = new RuntimeStory({bgColor: null, borderColor: null})

runtime.addSurface(surface, ({w, h}) => ({
  x: Math.max(18, (w - Math.min(560, w - 36)) / 2),
  y: Math.max(18, (h - Math.min(260, h - 36)) / 2),
  w: Math.min(560, w - 36),
  h: Math.min(260, h - 36),
}))`,
})

export const LAYOUT_RUNTIME_STORY_METADATA_BY_ROUTE = Object.freeze({
  "ui-runtime/target/hud": runtimeHudStoryMetadata,
  "ui-runtime/target/spatial-display": runtimeSpatialDisplayStoryMetadata,
})
