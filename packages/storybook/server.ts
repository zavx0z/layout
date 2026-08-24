import page from "./index.html"

Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.LAYOUT_STORYBOOK_PORT ?? 4020),
  development: {hmr: false, console: true},
  routes: {"/": page},
})
