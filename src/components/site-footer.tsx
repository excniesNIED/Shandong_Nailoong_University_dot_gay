import { useEffect, useState } from "react"

/** Site-wide footer: copyright on the left, live traffic counters on the right. */
export function SiteFooter() {
  const [stats, setStats] = useState<{ today: number; total: number; online: number } | null>(null)

  // Visitor counters; silent on failure — decoration only.
  useEffect(() => {
    fetch("/api/traffic", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d) => {
        const values = [d?.today?.pageviews, d?.total?.pageviews, d?.online]
        if (values.every((n) => Number.isSafeInteger(n) && n >= 0)) {
          setStats({ today: d.today.pageviews, total: d.total.pageviews, online: d.online })
        }
      })
      .catch(() => {})
  }, [])

  return (
    <footer className="relative z-10 mx-auto mt-auto w-full max-w-6xl border-t border-slate-200/60 px-6 pt-6 pb-14 font-sans text-[11px] text-slate-400 dark:border-slate-700/60 dark:text-slate-500">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p>© 1950 - 2026 山东奶龙大学 · 弘德明志 博学笃行</p>
        {stats && (
          <p className="flex items-center gap-1.5 tabular-nums" aria-label="站点访问统计">
            <span>
              今日浏览 <span className="font-semibold text-slate-500 dark:text-slate-300">{stats.today}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>
              总浏览 <span className="font-semibold text-slate-500 dark:text-slate-300">{stats.total}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span>
              在线 <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.online}</span>
            </span>
          </p>
        )}
      </div>
    </footer>
  )
}
