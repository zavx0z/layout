import {cp, mkdir, rm} from "node:fs/promises"
import {join} from "node:path"

const root = new URL("..", import.meta.url).pathname
const output = join(root, "pages")
await rm(output, {recursive: true, force: true})
await mkdir(output, {recursive: true})

const build = await Bun.build({
  entrypoints: [join(root, "src/main.ts")],
  outdir: output,
  target: "browser",
  format: "esm",
  minify: true,
  loader: {".wgsl": "text"},
  naming: "app.js",
})
if (!build.success) throw new AggregateError(build.logs, "Layout Storybook build failed")

await cp(join(root, "index.html"), join(output, "index.html"))
await cp(join(root, "public/jetbrains-mono-bold.ttf"), join(output, "jetbrains-mono-bold.ttf"))
await Bun.write(join(output, ".nojekyll"), "")
