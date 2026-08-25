import {UiSurface} from "@layout/core/surface"
import type {StorybookStoryIndexItem} from "@zavx0z/storybook/stories"
import {drawStorybookPreviewChrome} from "@zavx0z/storybook/workbench"
import type {LayoutRuntimeStory} from "../../core/storybook/story.ts"

export const LAYOUT_PREVIEW_HEADER_HEIGHT = 30
export const LAYOUT_PREVIEW_CONTENT_INSET = 2

/** Shared preview header with a transparent content area for the real UIDisplay. */
export class LayoutPreviewHeaderSurface extends UiSurface {
  readonly #content = this.createRetainedParent()
  #index: StorybookStoryIndexItem
  #story: LayoutRuntimeStory
  #signature = ""

  constructor(index: StorybookStoryIndexItem, story: LayoutRuntimeStory) {
    super({bgColor: null, borderColor: null})
    this.node.name = "LayoutPreviewHeaderSurface"
    this.#content.name = "LayoutPreviewHeaderSurface.content"
    this.#index = index
    this.#story = story
  }

  setStory(index: StorybookStoryIndexItem, story: LayoutRuntimeStory): void {
    this.#index = index
    this.#story = story
    this.requestRender()
  }

  protected override render(): void {
    const signature = `${this.#index.route}:${this.#story.title}:${this.rectW}:${this.rectH}:${this.pixelScale}`
    if (signature === this.#signature) return
    this.materializeRetainedParent(this.#content, () => {
      drawStorybookPreviewChrome(this, this.rectW, this.rectH, {title: this.#story.title})
    })
    this.#signature = signature
  }
}
