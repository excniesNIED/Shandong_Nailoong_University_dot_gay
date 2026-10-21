import { StrictMode } from "react"
import { createRoot, hydrateRoot } from "react-dom/client"
import { createRouter, RouterProvider } from "@tanstack/react-router"

import { routeTree } from "./routeTree.gen"
import "./index.css"

const router = createRouter({ routeTree, defaultPreload: "intent", defaultViewTransition: true })

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

// The pages are prerendered to static HTML (see scripts/prerender.mjs), so the
// client renders the same tree the server did. Without this flag the router
// adds a suspense boundary the server markup does not have, and hydration
// fails on every page.
router.ssr = { manifest: undefined }

const container = document.getElementById("root")!
const tree = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

/** Route components are code-split: their chunk has to be in before the first
 *  paint, otherwise the client render suspends and cannot hydrate the
 *  prerendered markup. */
async function loadRouteComponents() {
  // The first load paints the page for the first time; a view transition there
  // only risks an aborted transition, so it is skipped.
  const viewTransition = router.options.defaultViewTransition
  router.options.defaultViewTransition = false
  try {
    await router.load()
  } finally {
    router.options.defaultViewTransition = viewTransition
  }
  await Promise.all(
    router.state.matches.map((match) => {
      const route = router.routesById[match.routeId]
      const component = route?.options?.component as { preload?: () => Promise<unknown> } | undefined
      return component?.preload?.() ?? Promise.resolve()
    }),
  )
}

// Production builds ship prerendered markup for every route. Load the router
// before the first paint so the client render matches that markup and can
// hydrate it; the dev server has no markup, so it falls back to a client
// render.
void loadRouteComponents()
  .catch(() => undefined)
  .then(() => {
    if (container.hasChildNodes()) {
      hydrateRoot(container, tree)
    } else {
      createRoot(container).render(tree)
    }
  })
