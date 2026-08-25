/**
Static delivery inputs for the repository-owned Layout Storybook.

This module reads Git identities but leaves output untouched. The shared
builder performs the later atomic write into repository-root `dist`.

@packageDocumentation
*/

import {dirname, resolve} from "node:path"
import {fileURLToPath} from "node:url"
import {
  readGitIdentity,
  type StorybookDependencyIdentity,
  type StorybookStaticBuildOptions,
} from "@zavx0z/storybook/build"
import {
  createLayoutStorybookApp,
  layoutStorybookStaticFiles,
} from "./storybook-app.ts"

export const LAYOUT_REPOSITORY_ROOT = resolve(import.meta.dir, "../../..")
export const LAYOUT_STORYBOOK_OUTPUT_ROOT = resolve(LAYOUT_REPOSITORY_ROOT, "dist")

/**
Reads the complete schema-1 build input for `/layout/`.

@returns An immutable build description with exact source and dependency
identities.

@throws If Layout or one linked dependency is not inside a readable Git
checkout.
*/
export async function createLayoutStorybookStaticBuildOptions(): Promise<StorybookStaticBuildOptions> {
  return Object.freeze({
    app: createLayoutStorybookApp(),
    outputRoot: LAYOUT_STORYBOOK_OUTPUT_ROOT,
    source: await readGitIdentity(LAYOUT_REPOSITORY_ROOT),
    dependencies: await layoutStorybookDependencyIdentities(),
    staticFiles: layoutStorybookStaticFiles(),
  })
}

/**
Reads the five revisions that determine the private browser graph.

@returns Identities ordered as Engine, Layout, UI, Highlighter and shared
Storybook.

@throws If any resolved package is outside a readable Git checkout.
*/
export async function layoutStorybookDependencyIdentities(): Promise<readonly StorybookDependencyIdentity[]> {
  const inputs = [
    ["@engine/core", import.meta.resolve("@engine/core/default-font")],
    ["@layout/core", import.meta.resolve("@layout/core/runtime")],
    ["@ui/workspace", import.meta.resolve("@ui/elements/primitives")],
    ["@zavx0z/highlighter", import.meta.resolve("@zavx0z/highlighter")],
    ["@zavx0z/storybook", import.meta.resolve("@zavx0z/storybook/app")],
  ] as const
  return Object.freeze(await Promise.all(inputs.map(async ([name, entry]) => ({
    name,
    ...await readGitIdentity(dirname(fileURLToPath(entry))),
  }))))
}
