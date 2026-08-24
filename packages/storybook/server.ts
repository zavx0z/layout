import {join} from "node:path"

const pages = join(import.meta.dir, "pages")
const assets = new Map([
  ["/", {file: "index.html", type: "text/html; charset=utf-8"}],
  ["/app.js", {file: "app.js", type: "text/javascript; charset=utf-8"}],
  ["/jetbrains-mono-bold.ttf", {file: "jetbrains-mono-bold.ttf", type: "font/ttf"}],
])

Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.LAYOUT_STORYBOOK_PORT ?? 4020),
  fetch(request) {
    const asset = assets.get(new URL(request.url).pathname)
    if (asset === undefined) return new Response("Not found", {status: 404})
    return new Response(Bun.file(join(pages, asset.file)), {headers: {"content-type": asset.type}})
  },
})
