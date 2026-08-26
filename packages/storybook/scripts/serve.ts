import {startStorybookPackageServer} from "@zavx0z/storybook/server"
import {
  createLayoutStorybookApp,
  layoutStorybookStaticFiles,
} from "../src/storybook-app.ts"

startStorybookPackageServer({
  app: createLayoutStorybookApp(),
  staticFiles: layoutStorybookStaticFiles(),
})
