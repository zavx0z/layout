import {runtimeHudStoryMetadata} from "../metadata.ts"
import {RuntimeStory} from "../runtime-story.ts"
import type {LayoutRuntimeStory} from "../story.ts"

/** HUD owner story: the repository app must attach its Surface to `UiRuntime.hud`. */
export const runtimeHudStory: LayoutRuntimeStory = Object.freeze({
  ...runtimeHudStoryMetadata,
  createSurface() {
    return new RuntimeStory({bgColor: null, borderColor: null})
  },
})
