import {UiRuntime} from "@layout/core/runtime"
import {RuntimeStory} from "./stories/runtime.stories.ts"

const canvas = document.querySelector("#stage")
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Missing Storybook canvas")

const runtime = await UiRuntime.create(canvas, {
  virtualDisplay: {initial: "near", surfaceDisplay: true, grid: true},
})
const story = new RuntimeStory({bgColor: null, borderColor: null})
runtime.addHudSurface(story, ({w, h}) => ({
  x: Math.max(18, (w - Math.min(560, w - 36)) / 2),
  y: Math.max(80, (h - Math.min(260, h - 150)) / 2),
  w: Math.min(560, w - 36),
  h: Math.min(260, h - 150),
}))
runtime.handleResize()
window.addEventListener("resize", () => runtime.handleResize())

const hud = document.querySelector("#hud")
const space = document.querySelector("#space")
if (!(hud instanceof HTMLButtonElement) || !(space instanceof HTMLButtonElement)) throw new Error("Missing display controls")

const selectMode = (mode: "near" | "far") => {
  runtime.setDisplayMode(mode)
  hud.ariaPressed = String(mode === "near")
  space.ariaPressed = String(mode === "far")
}
hud.addEventListener("click", () => selectMode("near"))
space.addEventListener("click", () => selectMode("far"))

document.documentElement.dataset.storybook = "ready"
