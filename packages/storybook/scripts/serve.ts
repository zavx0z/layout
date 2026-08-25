import {startStorybookHubServer} from "@zavx0z/storybook/server"
import {
  createLayoutStorybookApp,
  layoutStorybookStaticFiles,
} from "../src/storybook-app.ts"

const server = startStorybookHubServer({
  app: createLayoutStorybookApp(),
  hostname: Bun.env.LAYOUT_STORYBOOK_HOST ?? "127.0.0.1",
  port: Number(Bun.env.LAYOUT_STORYBOOK_PORT ?? 4020),
  staticFiles: layoutStorybookStaticFiles(),
})

console.log(`[Layout Storybook] ${server.url}layout/`)
