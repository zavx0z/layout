import {runtimeSpatialDisplayStoryMetadata} from "../metadata.ts"
import {RuntimeStory} from "../runtime-story.ts"
import type {LayoutRuntimeStory} from "../story.ts"

/** Spatial owner story: the repository app must attach its Surface to the built-in `UIDisplay`. */
export const runtimeSpatialDisplayStory: LayoutRuntimeStory = Object.freeze({
  ...runtimeSpatialDisplayStoryMetadata,
  createSurface() {
    return new RuntimeStory({bgColor: null, borderColor: null})
  },
})
