import { useEffect } from "react"
import { createRootRoute, Link, Outlet, useRouterState } from "@tanstack/react-router"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"

/**
 * Keeps `document.title` in step with the active route.
 *
 * The prerendered pages carry their own title in the served HTML, but a
 * client-side navigation never re-renders that head, so the tab would keep
 * the title of the page the visitor came from.
 */
function RouteTitle() {
  const title = useRouterState({
    select: (state) => {
      for (let i = state.matches.length - 1; i >= 0; i--) {
        for (const entry of state.matches[i].meta ?? []) {
          if (entry && "title" in entry && typeof entry.title === "string") return entry.title
        }
      }
      return undefined
    },
  })

  useEffect(() => {
    if (title) document.title = title
  }, [title])

  return null
}

function RootLayout() {
  return (
    <div className="relative flex min-h-screen flex-col text-slate-800 selection:bg-amber-300 selection:text-sdnu-deep dark:text-slate-200">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-sdnu-navy focus:shadow-lg dark:focus:bg-slate-800 dark:focus:text-slate-100"
      >
        跳到主要内容
      </a>
      <div className="pointer-events-none fixed inset-2 z-30 diploma-border md:inset-4" />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-red-400/20 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />
        <svg className="float-item-1 absolute top-28 left-[18%] h-5 w-5 text-amber-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
        <svg className="float-item-2 absolute top-44 right-[20%] h-6 w-6 text-sdnu-navy/30 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l3 9h9l-7.5 5.5 3 9.5-7.5-5.5-7.5 5.5 3-9.5-7.5-5.5h9z" />
        </svg>
      </div>

      <SiteHeader />
      <RouteTitle />
      <Outlet />
      <SiteFooter />
      <Toaster position="bottom-center" />
    </div>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: () => (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <img src="/nailoog.webp" alt="山东奶龙大学校徽" width={96} height={96} className="size-24" />
      <h1 className="font-serif text-2xl font-bold text-sdnu-navy dark:text-slate-100">奶龙在千佛山迷路了</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">这个页面不存在，可能去长清湖校区上课了。</p>
      <Button asChild className="rounded-full">
        <Link to="/">回到首页</Link>
      </Button>
    </main>
  ),
})
