import { Link, useRouterState } from "@tanstack/react-router"
import { toast } from "sonner"

import { Tabs, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { playSound } from "@/lib/sound"
import { burstSparkles } from "@/lib/sparkles"

const NAV = [
  { to: "/", label: "主页" },
  { to: "/about", label: "关于" },
  { to: "/nailoog", label: "奶家军" },
] as const

/** Site header: clickable school seal on the left, route tabs on the right. */
export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  // /78 is the homepage easter egg; highlight 主页 there too.
  const active =
    pathname === "/78"
      ? "/"
      : (NAV.find((item) => item.to !== "/" && pathname.startsWith(item.to))?.to ?? "/")

  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between px-6 pt-7 sm:pt-9">
      <button
        type="button"
        onClick={(e) => {
          burstSparkles(e.clientX, e.clientY)
          playSound("click")
          toast("山东奶龙大学欢迎你！", { icon: "🐲" })
        }}
        className="group flex cursor-pointer items-center space-x-3 transition-transform hover:scale-[1.02]"
      >
        <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-sdnu-navy/20 transition group-hover:ring-amber-400 sm:h-10 sm:w-10 dark:bg-slate-900">
          <img src="/nailoog.webp" alt="山东奶龙大学校徽" width={40} height={40} className="h-full w-full" />
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="font-serif text-lg font-bold tracking-wide text-sdnu-navy transition group-hover:text-amber-600 sm:text-xl dark:text-slate-100 dark:group-hover:text-amber-400">
            山东奶龙大学
          </span>
          <span className="mt-1 font-serif text-[8px] tracking-[-0.01em] text-sdnu-navy/70 sm:text-[9px] dark:text-slate-400">
            Shandong Nailoong University
          </span>
        </span>
      </button>

      <Tabs value={active}>
        <TabsList className="relative rounded-full border border-sdnu-navy/20 bg-white/70 shadow-xs backdrop-blur-sm dark:border-slate-600/60 dark:bg-white/10">
          <TabsIndicator className="rounded-full border border-transparent bg-background shadow-sm dark:border-input dark:bg-input/30" />
          {NAV.map((item) => (
            <TabsTrigger
              key={item.to}
              value={item.to}
              nativeButton={false}
              render={<Link to={item.to} />}
              className="rounded-full px-3.5 font-sans text-xs tracking-wider sm:px-4"
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </header>
  )
}
