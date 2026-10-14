import { useCallback, useEffect, useRef, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { gsap } from "gsap"
import { Copy, Play, RotateCw, Users } from "lucide-react"
import { toast } from "sonner"

import { Emblem } from "@/components/emblem"
import { IntroLoader } from "@/components/intro-loader"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { QUOTES } from "@/lib/quotes"
import { playSound } from "@/lib/sound"

export const Route = createFileRoute("/")({ component: Home })

const QQ_GROUP = "641370366"
const QQ_JOIN_URL = "https://qm.qq.com/q/t9uMBMK3SM"
const OFFICIAL_URL = "https://www.sdnu.edu.cn"
const SPARKLES = ["✨", "💛", "🌟", "🥟"]

function burstSparkles(x: number, y: number) {
  for (let i = 0; i < 4; i++) {
    const p = document.createElement("div")
    p.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)]
    p.className = "pointer-events-none fixed z-50 select-none text-base"
    p.style.left = `${x - 10}px`
    p.style.top = `${y - 10}px`
    document.body.appendChild(p)
    const angle = Math.random() * Math.PI * 2
    const dist = 30 + Math.random() * 50
    gsap.to(p, {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 25,
      scale: 0.4,
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
      onComplete: () => p.remove(),
    })
  }
}

function Home() {
  const [loaderKey, setLoaderKey] = useState(0)
  const [loading, setLoading] = useState(true)
  const [quote, setQuote] = useState(0)
  const [copied, setCopied] = useState(false)
  const [anthemOpen, setAnthemOpen] = useState(false)
  const [stats, setStats] = useState<{ today: number; total: number; online: number } | null>(null)
  const emblemRef = useRef<HTMLButtonElement>(null)
  const avatarRef = useRef<SVGGElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  // Hidden until the loader hands over; StrictMode-safe because it is a plain set.
  useEffect(() => {
    gsap.set(emblemRef.current, { scale: 0.3, rotate: -30, opacity: 0 })
    gsap.set(pageRef.current?.querySelectorAll("[data-enter]") ?? [], { opacity: 0, y: 16 })
  }, [loaderKey])

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

  const _0x4e2f = useCallback(() => {
    const _0x8a1b = emblemRef.current
    const _0x3f9c = pageRef.current?.querySelectorAll("[data-enter]") ?? []
    const _0x7d4e = { scale: 1, rotate: 0, opacity: 1, duration: 0.85, ease: "back.out(1.7)" }
    const _0x2b8f = { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.07, delay: 0.15 }
    gsap.to(_0x8a1b, _0x7d4e)
    gsap.to(_0x3f9c, _0x2b8f)
  }, [])

  const replay = () => {
    playSound("reload")
    setLoading(true)
    setLoaderKey((k) => k + 1)
  }

  const nextQuote = (e: React.MouseEvent) => {
    playSound("click")
    burstSparkles(e.clientX, e.clientY)
    setQuote((q) => (q + 1 + Math.floor(Math.random() * (QUOTES.length - 1))) % QUOTES.length)
    const avatar = avatarRef.current
    if (!avatar) return
    avatar.classList.remove("animate-nailong", "wobble-active")
    void avatar.getBoundingClientRect()
    avatar.classList.add("wobble-active")
    window.setTimeout(() => {
      avatar.classList.remove("wobble-active")
      avatar.classList.add("animate-nailong")
    }, 700)
  }

  const copyGroup = async () => {
    try {
      await navigator.clipboard.writeText(QQ_GROUP)
      playSound("chime")
      setCopied(true)
      toast.success(`已复制官方群号：${QQ_GROUP}`)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.info(`群号为：${QQ_GROUP}`)
    }
  }

  return (
    <div ref={pageRef} className="relative flex min-h-screen flex-col justify-between text-slate-800 selection:bg-amber-300 selection:text-sdnu-deep dark:text-slate-200">
      {loading && (
        <IntroLoader key={loaderKey} onReveal={_0x4e2f} onDone={() => setLoading(false)} />
      )}

      <div className="pointer-events-none fixed inset-2 z-30 diploma-border md:inset-4" />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-blue-300/15 blur-3xl" />
        <svg className="float-item-1 absolute top-28 left-[18%] h-5 w-5 text-amber-400 opacity-60" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l2.4 7.2h7.6l-6.1 4.5 2.3 7.3-6.2-4.6-6.2 4.6 2.3-7.3-6.1-4.5h7.6z" />
        </svg>
        <svg className="float-item-2 absolute top-44 right-[20%] h-6 w-6 text-sdnu-navy/30 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0l3 9h9l-7.5 5.5 3 9.5-7.5-5.5-7.5 5.5 3-9.5-7.5-5.5h9z" />
        </svg>
      </div>

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
        <div className="rounded-full border border-sdnu-navy/20 bg-white/70 px-3 py-1 font-sans text-xs tracking-widest text-sdnu-navy/80 uppercase shadow-xs backdrop-blur-sm dark:border-slate-600/60 dark:bg-white/10 dark:text-slate-200">
          SDNU 1950
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:py-10">
        <div className="group relative my-3 select-none sm:my-5">
          <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-amber-300/25 via-yellow-200/15 to-blue-300/20 opacity-70 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />
          <div className="animate-spin-slow pointer-events-none absolute -inset-4 rounded-full border border-dashed border-sdnu-navy/25 sm:-inset-6 dark:border-slate-400/30" />
          <div className="animate-spin-reverse pointer-events-none absolute -inset-4 sm:-inset-6">
            <span className="absolute top-0 left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sdnu-navy shadow-md ring-4 ring-amber-300 dark:bg-amber-400" />
          </div>

          <button
            ref={emblemRef}
            type="button"
            onClick={nextQuote}
            className="relative block cursor-pointer rounded-full transition-[filter] hover:brightness-[1.02]"
            title="点击奶龙，换一句山师语录"
            aria-label="点击更换山师语录"
          >
            <Emblem avatarRef={avatarRef} />
          </button>

          <div className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-sdnu-deep opacity-90 shadow-md">
            ✨ 点我换语录
          </div>
        </div>

        <p
          data-enter
          aria-live="polite"
          className="mt-6 min-h-[1.75rem] max-w-md font-serif text-sm text-amber-800 sm:text-base dark:text-amber-300"
        >
          「{QUOTES[quote]}」
        </p>

        <div data-enter className="mt-1 mb-4 text-center font-serif text-5xl leading-tight sm:text-6xl md:text-7xl">
          <h1 className="font-black tracking-tight text-sdnu-navy dark:text-slate-50">
            山东<span className="nailong-highlighter mx-1 text-sdnu-navy dark:text-slate-50">奶龙</span>大学
          </h1>
          <p className="mt-2 text-[0.4em] font-normal tracking-[0.057em] text-sdnu-navy/70 sm:mt-3 dark:text-slate-400">
            Shandong Nailoong University
          </p>
        </div>

        <p data-enter className="mx-auto flex max-w-lg items-center justify-center space-x-1.5 font-serif text-base text-slate-600 sm:text-lg dark:text-slate-300">
          <span>奶龙已就位，在千佛山与长清湖为山师人护学。</span>
          <span className="inline-block h-2 w-2 animate-ping rounded-full bg-emerald-500" title="系统护学状态正常" />
        </p>

        <div data-enter className="mt-5 mb-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {["🏛️ 1950 年建校", "⭐ 冲一流 · 自封"].map((label) => (
            <span
              key={label}
              className="rounded-full border border-slate-200/90 bg-white px-3.5 py-1 font-serif text-xs font-medium text-slate-600 shadow-2xs transition hover:border-amber-400 hover:text-amber-700 dark:border-slate-600/70 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-amber-500 dark:hover:text-amber-400"
            >
              {label}
            </span>
          ))}
          <span className="rounded-full border border-amber-300/80 bg-amber-50/90 px-3.5 py-1 font-serif text-xs font-medium text-amber-800 shadow-2xs dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
            🛡️ 奶龙特级护学
          </span>
          <span className="hidden rounded-full border border-blue-200/70 bg-blue-50/80 px-3.5 py-1 font-serif text-xs font-medium text-blue-800 shadow-2xs sm:inline-block dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300">
            🎓 弘德明志 · 博学笃行
          </span>
        </div>

        <div data-enter className="flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            className="group h-auto w-full rounded-full bg-sdnu-navy px-8 py-3.5 text-sm tracking-wide text-white shadow-lg shadow-sdnu-navy/25 hover:bg-sdnu-deep hover:shadow-xl hover:shadow-sdnu-navy/35 sm:w-auto sm:text-base"
          >
            <a href={OFFICIAL_URL} target="_blank" rel="noopener noreferrer">
              前往学校官网
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </a>
          </Button>
          <Button
            variant="outline"
            onClick={() => setAnthemOpen(true)}
            className="h-auto w-full rounded-full border-slate-300/80 bg-white px-7 py-3.5 text-sm text-slate-700 hover:border-slate-400 hover:bg-slate-50 sm:w-auto sm:text-base dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
          >
            <Play className="text-slate-500 dark:text-slate-400" />
            司凤版校歌
          </Button>
        </div>

        <div data-enter className="mt-8 flex flex-col items-center justify-center gap-2 text-sm text-slate-500 sm:flex-row dark:text-slate-400">
          <span>山东奶龙大学官方群：</span>
          <div className="inline-flex items-center gap-3 rounded-full border border-slate-200/90 bg-white/80 px-4 py-2 shadow-xs backdrop-blur-xs dark:border-slate-600/70 dark:bg-slate-800/80">
            <span className="font-sans text-base font-semibold tracking-wider text-slate-800 dark:text-slate-200">{QQ_GROUP}</span>
            <button
              type="button"
              onClick={copyGroup}
              className="flex cursor-pointer items-center gap-1 font-medium text-sdnu-navy transition hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-400"
            >
              <Copy className="size-4" />
              {copied ? "已复制！" : "复制"}
            </button>
            <span className="h-4 w-px bg-slate-200 dark:bg-slate-600" />
            <a
              href={QQ_JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-medium text-sdnu-navy transition hover:text-amber-600 dark:text-amber-300 dark:hover:text-amber-400"
            >
              <Users className="size-4" />
              一键加群
            </a>
          </div>
        </div>
      </main>

      <footer className="relative z-10 mx-auto mt-auto w-full max-w-6xl border-t border-slate-200/60 px-6 pt-6 pb-14 text-center font-sans text-[11px] text-slate-400 dark:border-slate-700/60 dark:text-slate-500">
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
          <p className="flex items-center gap-1">
            <a
              href="https://nai.amoe.cc/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-medium transition hover:text-sdnu-navy hover:underline underline-offset-4 dark:hover:text-amber-300"
            >
              更多奶群和奶站
            </a>
            ·
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" className="inline-flex cursor-pointer items-center gap-0.5 font-medium underline-offset-4 transition hover:text-sdnu-navy hover:underline dark:hover:text-amber-300">
                  第一次来？先看看关于本站
                </button>
              </DialogTrigger>
              <DialogContent className="max-h-[85vh] overflow-y-auto rounded-2xl border-amber-100 bg-white sm:max-w-md dark:border-slate-700 dark:bg-card">
                <DialogHeader className="flex-row items-center gap-3 space-y-0 text-left">
                  <img src="/nailoog.webp" alt="" width={40} height={40} className="size-10 rounded-xl" />
                  <div>
                    <DialogTitle className="font-serif text-lg text-sdnu-navy dark:text-slate-100">关于山东奶龙大学</DialogTitle>
                    <DialogDescription className="font-sans text-xs">Nailong × Shandong Normal University</DialogDescription>
                  </div>
                </DialogHeader>
                <div className="space-y-3 border-y border-slate-100 py-3 text-left font-serif text-xs leading-relaxed text-slate-600 sm:text-sm dark:border-slate-800 dark:text-slate-300">
                  <p>
                    <strong>山东奶龙大学</strong>（Shandong Nailoong University，简称 SDNU），又称山东奶蛙大学（Shandong Milkyfrog University）、山东乃万大学（Shandong Nine-One University），坐落于山东省济南市，对外全称“山东师范大学奶龙官方组织”，是山师学子与萌系顶流“奶龙”的一次梦幻联动：活泼乐观、大肚能容，从容面对教资、考研与期末周。
                  </p>
                  <p>
                    <strong>山东师范大学</strong>坐落在历史文化名城济南，办学文脉可追溯到 1902 年山东大学堂师范馆，1950 年组建山东师范学院，1981 年更名为山东师范大学。学校秉承“尊贤尚功、奋发有为”的校园精神和“弘德明志、博学笃行”的校训，拥有千佛山、长清湖两个校区，现有 25 个学院（部）、64 个招生本科专业，是山东省人民政府和教育部共建高校、山东省高水平大学“冲一流”建设高校。
                  </p>
                  <div className="rounded-lg border border-amber-200/60 bg-amber-50/70 p-3 text-xs text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                    💡 <strong>免责声明：</strong>本站为山东师范大学奶龙官方组织（学生自发整活组织），与山东师范大学官方无隶属关系。“前往山师官网”直达 sdnu.edu.cn。
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button className="rounded-full bg-sdnu-navy px-5 text-xs hover:bg-sdnu-deep">朕已知晓，退下吧</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </p>
        </div>
      </footer>

      <button
        type="button"
        onClick={replay}
        className="fixed bottom-4 right-4 z-40 inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300/80 bg-white/95 px-3.5 py-2 font-serif text-xs font-semibold text-slate-700 shadow-lg shadow-slate-900/10 backdrop-blur-xs transition hover:bg-slate-50 hover:shadow-xl dark:border-slate-600 dark:bg-slate-800/95 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        <RotateCw className="size-3.5" />
        重新载入动画
      </button>

      <Dialog open={anthemOpen} onOpenChange={setAnthemOpen}>
        <DialogContent className="rounded-2xl border-amber-100 bg-white sm:max-w-2xl dark:border-slate-700 dark:bg-card">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg text-sdnu-navy dark:text-slate-100">司凤版校歌</DialogTitle>
            <DialogDescription className="font-sans text-xs">哔哩哔哩 · 司凤版山东师范大学校歌</DialogDescription>
          </DialogHeader>
          <iframe
            src="//player.bilibili.com/player.html?isOutside=true&aid=117433952111474&bvid=BV18cpq62Epc&cid=42713940567&p=1&autoplay=0&mute=0"
            title="司凤版校歌"
            scrolling="no"
            frameBorder={0}
            allowFullScreen
            className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800"
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
