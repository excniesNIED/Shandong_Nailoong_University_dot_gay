import { createRootRoute, Link, Outlet } from "@tanstack/react-router"

import { Toaster } from "@/components/ui/sonner"
import { Button } from "@/components/ui/button"

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster position="bottom-center" />
    </>
  ),
  notFoundComponent: () => (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <img src="/nailoog.webp" alt="山东奶龙大学校徽" width={96} height={96} className="size-24" />
      <h1 className="font-serif text-2xl font-bold text-sdnu-navy">奶龙在千佛山迷路了</h1>
      <p className="text-sm text-slate-500">这个页面不存在，可能去长清湖校区上课了。</p>
      <Button asChild className="rounded-full">
        <Link to="/">回到首页</Link>
      </Button>
    </main>
  ),
})
