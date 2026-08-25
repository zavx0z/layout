import {buildStaticStorybook} from "@zavx0z/storybook/build"
import {createLayoutStorybookStaticBuildOptions} from "../src/static-build.ts"

const options = await createLayoutStorybookStaticBuildOptions()
const manifest = await buildStaticStorybook(options)

console.log(
  `[Layout Storybook] built ${manifest.pages.length} static page in ${options.outputRoot} for /layout/`,
)
