/**
Layout Storybook application composed inside the shared five-region Workbench.

One `UiRuntime`, Engine renderer, Space and canvas own both the fixed Workbench
HUD and the selected package-owned preview. The HUD route attaches its surface
to the camera; the spatial route attaches it to the real built-in `UIDisplay`.

@packageDocumentation
*/

import {UiRuntime} from "@layout/core/runtime"
import {
  StorybookRouteTreeRouter,
  type StorybookRouteTreeNode,
} from "@zavx0z/storybook/route-tree"
import type {
  StorybookStoryArgs,
  StorybookStoryIndexItem,
} from "@zavx0z/storybook/stories"
import {
  StorybookDockSurface,
  StorybookNavigationSurface,
  StorybookStoryPanelSurface,
  planStorybookShell,
  type StorybookNavigationItem,
  type StorybookResponsivePolicy,
  type StorybookStoryPanelMode,
  type StorybookStoryPanelOptions,
} from "@zavx0z/storybook/workbench"
import {storybookPublicPath} from "@zavx0z/storybook/environment"
import {
  LAYOUT_STORYBOOK_CATALOG,
  layoutStorybookPresentationRoute,
} from "../../core/storybook/catalog.ts"
import {
  LAYOUT_PREVIEW_CONTENT_INSET,
  LAYOUT_PREVIEW_HEADER_HEIGHT,
  LayoutPreviewHeaderSurface,
} from "./layout-preview-header.ts"
import {
  LayoutPreviewStage,
  type LayoutPreviewEvidence,
} from "./layout-preview-stage.ts"

const LAYOUT_STORYBOOK_MOUNT = storybookPublicPath("layout", "/")
const LAYOUT_STORYBOOK_RESPONSIVE: StorybookResponsivePolicy = Object.freeze({
  compactBelow: null,
  compactPanels: Object.freeze([]),
})
const EMPTY_ARGS = Object.freeze({}) satisfies StorybookStoryArgs

async function startLayoutStorybook(): Promise<void> {
  const canvas = requireLayoutCanvas()
  canvas.setAttribute("aria-label", "Layout Storybook: Workbench, HUD и пространственный дисплей")
  document.documentElement.dataset.layoutStorybook = "starting"

  try {
    const runtime = await UiRuntime.create(canvas, {
      virtualDisplay: {initial: "near", surfaceDisplay: true, grid: true},
    })
    runtime.handleResize()

    const router = new StorybookRouteTreeRouter(LAYOUT_STORYBOOK_CATALOG.routeTree, {
      basePath: LAYOUT_STORYBOOK_MOUNT,
    })
    const initial = await loadStableLayoutStory(router)
    const initialNode = initial.node
    let storyRoute = initial.route
    let storyIndex = initial.index
    let story = initial.story
    let panelMode: StorybookStoryPanelMode = "controls"
    let catalogQuery = ""
    let collapsedGroups = new Set<string>()
    let selectionRevision = 0
    let evidence: LayoutPreviewEvidence = Object.freeze({
      target: story.target,
      parent: "ожидание",
      frames: 0,
    })

    const frames = (width: number, height: number) => planStorybookShell(width, height, {
      responsive: LAYOUT_STORYBOOK_RESPONSIVE,
    })
    const previewContentFrame = ({w, h}: {w: number; h: number}) => {
      const preview = frames(w, h).preview
      const availableWidth = Math.max(1, preview.w - LAYOUT_PREVIEW_CONTENT_INSET * 2)
      const availableHeight = Math.max(1, preview.h - LAYOUT_PREVIEW_HEADER_HEIGHT - LAYOUT_PREVIEW_CONTENT_INSET)
      const width = Math.max(1, Math.min(560, availableWidth - 36))
      const height = Math.max(1, Math.min(260, availableHeight - 36))
      return {
        x: preview.x + LAYOUT_PREVIEW_CONTENT_INSET + (availableWidth - width) / 2,
        y: preview.y + LAYOUT_PREVIEW_HEADER_HEIGHT + (availableHeight - height) / 2,
        w: width,
        h: height,
      }
    }
    const previewHeaderFrame = ({w, h}: {w: number; h: number}) => {
      const preview = frames(w, h).preview
      return {
        x: preview.x,
        y: preview.y,
        w: preview.w,
        h: Math.min(preview.h, LAYOUT_PREVIEW_HEADER_HEIGHT),
      }
    }

    const navigate = (route: string): void => {
      if (!router.go(route)) publishError(new Error(`Неизвестный маршрут Layout Storybook: ${route}`))
    }
    const catalog = new StorybookNavigationSurface<string>(catalogOptions())
    const sections = new StorybookNavigationSurface<string>(sectionOptions())
    const dock = new StorybookDockSurface<string>(dockOptions())
    const previewHeader = new LayoutPreviewHeaderSurface(storyIndex, story)
    const previewStage = new LayoutPreviewStage(runtime, previewContentFrame)
    let storyPanel: StorybookStoryPanelSurface

    const panelOptions = (): StorybookStoryPanelOptions => ({
      source: story.source,
      args: EMPTY_ARGS,
      controls: [],
      events: [
        {
          id: "target",
          label: "Цель",
          value: evidence.target === "hud" ? "HUD на камере" : "Пространственный UIDisplay",
        },
        {id: "parent", label: "Сохраняемый родитель", value: evidence.parent},
        {id: "frames", label: "Представленные кадры", value: String(evidence.frames)},
      ],
      mode: panelMode,
      onModeChange(mode) {
        panelMode = mode
        storyPanel.setOptions(panelOptions())
        publish()
      },
      onControlChange() {},
      async onCopy(source) {
        try {
          await navigator.clipboard.writeText(source)
          document.documentElement.dataset.layoutStorybookCopy = "copied"
        } catch {
          document.documentElement.dataset.layoutStorybookCopy = "error"
        }
      },
    })
    storyPanel = new StorybookStoryPanelSurface(panelOptions())

    runtime.addHudSurface(catalog, ({w, h}) => frames(w, h).catalog)
    runtime.addHudSurface(sections, ({w, h}) => frames(w, h).section)
    runtime.addHudSurface(previewHeader, previewHeaderFrame)
    runtime.addHudSurface(dock, ({w, h}) => frames(w, h).dock)
    runtime.addHudSurface(storyPanel, ({w, h}) => frames(w, h).info)

    function catalogOptions() {
      return {
        title: "Каталог Layout",
        items: catalogItems(collapsedGroups),
        route: storyIndex.componentId,
        onNavigate: navigate,
        query: catalogQuery,
        searchPlaceholder: "Runtime, HUD, дисплей…",
        onQueryChange(query: string) {
          catalogQuery = query
          catalog.setOptions(catalogOptions())
          publish()
        },
        onGroupToggle(groupId: string, collapsed: boolean) {
          collapsedGroups = new Set(collapsedGroups)
          if (collapsed) collapsedGroups.add(groupId)
          else collapsedGroups.delete(groupId)
          catalog.setOptions(catalogOptions())
          publish()
        },
      }
    }

    function sectionOptions() {
      return {
        title: storyIndex.componentLabel,
        items: sectionItems(storyIndex),
        route: `${storyIndex.componentId}/${storyIndex.sectionId}`,
        onNavigate: navigate,
      }
    }

    function dockOptions() {
      return {
        title: "Цели вывода",
        items: variantItems(storyIndex),
        route: router.current.kind === "leaf" ? router.current.path : "",
        onNavigate: navigate,
      }
    }

    function flushWorkbench(): void {
      for (const surface of [catalog, sections, dock, previewHeader, storyPanel]) surface.flushPendingRender()
    }

    function publish(): void {
      flushWorkbench()
      document.documentElement.dataset.layoutStorybookRoute = router.current.path
      document.documentElement.dataset.layoutStorybookRouteKind = router.current.kind
      document.documentElement.dataset.layoutStorybookStory = storyRoute
      document.documentElement.dataset.layoutStorybookStoryId = story.id
      document.documentElement.dataset.layoutStorybookTarget = evidence.target
      document.documentElement.dataset.layoutStorybookSurfaceParent = evidence.parent
      document.documentElement.dataset.layoutStorybookFrames = String(evidence.frames)
    }

    function present(): void {
      evidence = previewStage.show(story, (nextEvidence) => {
        evidence = nextEvidence
        storyPanel.setOptions(panelOptions())
        flushWorkbench()
      })
      publish()
    }

    async function applyRoute(node: StorybookRouteTreeNode<string>): Promise<void> {
      const revision = ++selectionRevision
      document.documentElement.dataset.layoutStorybook = "starting"
      try {
        const nextRoute = layoutStorybookPresentationRoute(node.path)
        const nextIndex = requireStory(nextRoute)
        const nextStory = await LAYOUT_STORYBOOK_CATALOG.load(nextRoute)
        if (revision !== selectionRevision || router.current !== node) return
        storyRoute = nextRoute
        storyIndex = nextIndex
        story = nextStory
        catalog.setOptions(catalogOptions())
        sections.setOptions(sectionOptions())
        dock.setOptions(dockOptions())
        previewHeader.setStory(storyIndex, story)
        runtime.relayout()
        present()
        document.documentElement.dataset.layoutStorybook = "ready"
      } catch (error) {
        if (revision === selectionRevision) throw error
      }
    }

    router.subscribe((node) => {
      void applyRoute(node).catch(publishError)
    })
    new ResizeObserver(() => {
      runtime.handleResize()
      runtime.relayout()
      present()
    }).observe(canvas)

    runtime.handleResize()
    runtime.relayout()
    if (router.current !== initialNode) {
      await applyRoute(router.current)
      return
    }
    present()
    if (router.current !== initialNode || selectionRevision !== 0) return
    document.documentElement.dataset.layoutStorybook = "ready"
  } catch (error) {
    publishError(error)
    throw error
  }
}

async function loadStableLayoutStory(router: StorybookRouteTreeRouter<string>) {
  while (true) {
    const node = router.current
    const route = layoutStorybookPresentationRoute(node.path)
    const index = requireStory(route)
    const story = await LAYOUT_STORYBOOK_CATALOG.load(route)
    if (router.current === node) return Object.freeze({node, route, index, story})
  }
}

function requireLayoutCanvas(): HTMLCanvasElement {
  const canvas = document.getElementById("layout-story-canvas")
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error("layout-story-canvas not found")
  return canvas
}

function requireStory(route: string): StorybookStoryIndexItem {
  const story = LAYOUT_STORYBOOK_CATALOG.find(route)
  if (story === undefined) throw new Error(`Layout Storybook story not found: ${route}`)
  return story
}

function catalogItems(collapsed: ReadonlySet<string>): readonly StorybookNavigationItem<string>[] {
  const firstByComponent = new Map<string, StorybookStoryIndexItem>()
  for (const item of LAYOUT_STORYBOOK_CATALOG.index) {
    if (!firstByComponent.has(item.componentId)) firstByComponent.set(item.componentId, item)
  }
  return [...firstByComponent.values()].map((item) => ({
    id: item.componentId,
    label: item.componentLabel,
    route: item.componentId,
    group: {
      id: item.groupId,
      label: item.groupLabel,
      collapsed: collapsed.has(item.groupId),
    },
    searchText: `${item.apiName} ${item.tags.join(" ")}`,
  }))
}

function sectionItems(selected: StorybookStoryIndexItem): readonly StorybookNavigationItem<string>[] {
  const firstBySection = new Map<string, StorybookStoryIndexItem>()
  for (const item of LAYOUT_STORYBOOK_CATALOG.index) {
    if (item.componentId === selected.componentId && !firstBySection.has(item.sectionId)) {
      firstBySection.set(item.sectionId, item)
    }
  }
  return [...firstBySection.values()].map((item) => ({
    id: item.sectionId,
    label: item.sectionLabel,
    route: `${item.componentId}/${item.sectionId}`,
  }))
}

function variantItems(selected: StorybookStoryIndexItem): readonly StorybookNavigationItem<string>[] {
  return LAYOUT_STORYBOOK_CATALOG.variants(selected.route).map((item) => ({
    id: item.variantId,
    label: item.variantLabel,
    route: item.route,
  }))
}

function publishError(error: unknown): void {
  document.documentElement.dataset.layoutStorybook = "error"
  document.documentElement.dataset.layoutStorybookError = error instanceof Error
    ? error.stack ?? error.message
    : String(error)
}

if (typeof document !== "undefined") await startLayoutStorybook()
