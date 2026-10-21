import { useCallback, useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { Copy, Play, RotateCw, Users } from "lucide-react"
import { toast } from "sonner"

import { InteractiveEmblem } from "@/components/interactive-emblem"
import { IntroLoader } from "@/components/intro-loader"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { playSound } from "@/lib/sound"

const QQ_GROUP = "641370366"
const QQ_JOIN_URL = "https://qm.qq.com/q/t9uMBMK3SM"
const OFFICIAL_URL = "https://www.sdnu.edu.cn"

// Intro plays only on a real document load of the homepage (refresh); tab
// navigation back to 主页 must not replay it. Reset per document load.
let introPlayed = false

/** Full homepage UI, shared by the "/" route and the "/78" easter-egg route. */
export function Home() {
  const [loaderKey, setLoaderKey] = useState(0)
  // The intro is armed after mount, not during the first render: the pages are
  // prerendered to static HTML, so the server markup has to match the client's
  // first render exactly (hydration) and cannot depend on window.location.
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [anthemOpen, setAnthemOpen] = useState(false)
  const emblemRef = useRef<HTMLButtonElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  // Intro plays only on a real document load of the homepage (refresh); tab
  // navigation back to 主页 must not replay it. Reset per document load.
  useEffect(() => {
    if (introPlayed) return
    if (window.location.pathname === "/" || window.location.pathname === "/78") {
      setLoading(true)
    }
  }, [])

  // Hidden until the loader hands over; skipped entirely when the intro is
  // suppressed (tab navigation back to an already-introed document).
  useEffect(() => {
    if (!loading) return
    gsap.set(emblemRef.current, { scale: 0.3, rotate: -30, opacity: 0 })
    gsap.set(pageRef.current?.querySelectorAll("[data-enter]") ?? [], { opacity: 0, y: 16 })
  }, [loading, loaderKey])

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
    <div ref={pageRef} className="relative flex flex-1 flex-col">
      {loading && (
        <IntroLoader
          key={loaderKey}
          onReveal={_0x4e2f}
          onDone={() => {
            introPlayed = true
            setLoading(false)
          }}
        />
      )}

      <main className="relative z-10 mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:py-10">
        <InteractiveEmblem emblemRef={emblemRef} />

        <div data-enter className="mt-1 mb-4 text-center font-serif text-5xl leading-tight sm:text-6xl md:text-7xl">
          <h1 className="hero-title font-black tracking-tight text-sdnu-navy dark:text-slate-50">
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

        <div data-enter className="flex w-full max-w-md flex-col items-center justify-center gap-5 sm:flex-row sm:gap-4">
          <a
            href={OFFICIAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative z-10 w-full overflow-hidden rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-10 py-3 text-center font-serif text-sm uppercase tracking-widest text-transparent shadow-xl shadow-red-600 cursor-pointer transition-[filter,box-shadow] after:absolute after:rounded-full after:bg-red-200 after:h-[85%] after:w-[95%] after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 hover:saturate-[1.15] hover:shadow-2xl hover:shadow-red-600 active:saturate-[1.4] sm:w-auto sm:text-base"
          >
            前往学校官网
            <p className="absolute z-40 font-semibold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent top-1/2 left-1/2 -translate-x-1/2 group-hover:-translate-y-full h-full w-full transition-all duration-300 -translate-y-[30%] tracking-widest">
              前往学校官网
            </p>
            <p className="absolute z-40 top-1/2 left-1/2 bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent -translate-x-1/2 translate-y-full h-full w-full transition-all duration-300 group-hover:-translate-y-[40%] tracking-widest font-extrabold">
              立即访问
            </p>
            <svg
              className="absolute w-full h-full scale-x-125 rotate-180 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 group-hover:-translate-y-[45%] transition-all duration-300"
              viewBox="0 0 2400 800"
              preserveAspectRatio="none"
              version="1.1"
            >
              <defs>
                <linearGradient id="sssurf-grad" y2="100%" x2="50%" y1="0%" x1="50%">
                  <stop offset="0%" stopOpacity={1} stopColor="hsl(37, 99%, 67%)" />
                  <stop offset="100%" stopOpacity={1} stopColor="hsl(316, 73%, 52%)" />
                </linearGradient>
              </defs>
              <g transform="matrix(1,0,0,1,0,-91.0877685546875)" fill="url(#sssurf-grad)">
                <path opacity="0.05" transform="matrix(1,0,0,1,0,35)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                <path opacity="0.21" transform="matrix(1,0,0,1,0,70)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                <path opacity="0.37" transform="matrix(1,0,0,1,0,105)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                <path opacity="0.53" transform="matrix(1,0,0,1,0,140)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                <path opacity="0.68" transform="matrix(1,0,0,1,0,175)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                <path opacity="0.84" transform="matrix(1,0,0,1,0,210)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
                <path opacity={1} transform="matrix(1,0,0,1,0,245)" d="M 0 305.9828838196134 Q 227.6031525693441 450 600 302.17553022897005 Q 1010.7738828515054 450 1200 343.3024459932802 Q 1379.4406250195766 450 1800 320.38902780838214 Q 2153.573162029817 450 2400 314.38564046970816 L 2400 800 L 0 800 L 0 340.3112176762882 Z" />
              </g>
            </svg>
            <svg
              className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[30%] group-hover:-translate-y-[33%] group-hover:scale-95 transition-all duration-500 z-40 fill-red-500"
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
            >
              <path d="M0,288L9.2,250.7C18.5,213,37,139,55,133.3C73.8,128,92,192,111,224C129.2,256,148,256,166,256C184.6,256,203,256,222,250.7C240,245,258,235,277,213.3C295.4,192,314,160,332,170.7C350.8,181,369,235,388,229.3C406.2,224,425,160,443,122.7C461.5,85,480,75,498,74.7C516.9,75,535,85,554,101.3C572.3,117,591,139,609,170.7C627.7,203,646,245,665,256C683.1,267,702,245,720,245.3C738.5,245,757,267,775,266.7C793.8,267,812,245,831,234.7C849.2,224,868,224,886,218.7C904.6,213,923,203,942,170.7C960,139,978,85,997,53.3C1015.4,21,1034,11,1052,48C1070.8,85,1089,171,1108,197.3C1126.2,224,1145,192,1163,197.3C1181.5,203,1200,245,1218,224C1236.9,203,1255,117,1274,106.7C1292.3,96,1311,160,1329,170.7C1347.7,181,1366,139,1385,128C1403.1,117,1422,139,1431,149.3L1440,160L1440,320L1430.8,320C1421.5,320,1403,320,1385,320C1366.2,320,1348,320,1329,320C1310.8,320,1292,320,1274,320C1255.4,320,1237,320,1218,320C1200,320,1182,320,1163,320C1144.6,320,1126,320,1108,320C1089.2,320,1071,320,1052,320C1033.8,320,1015,320,997,320C978.5,320,960,320,942,320C923.1,320,905,320,886,320C867.7,320,849,320,831,320C812.3,320,794,320,775,320C756.9,320,738,320,720,320C701.5,320,683,320,665,320C646.2,320,628,320,609,320C590.8,320,572,320,554,320C535.4,320,517,320,498,320C480,320,462,320,443,320C424.6,320,406,320,388,320C369.2,320,351,320,332,320C313.8,320,295,320,277,320C258.5,320,240,320,222,320C203.1,320,185,320,166,320C147.7,320,129,320,111,320C92.3,320,74,320,55,320C36.9,320,18,320,9,320L0,320Z" fillOpacity={1} />
            </svg>
          </a>
          <Button
            variant="outline"
            onClick={() => setAnthemOpen(true)}
            className="h-auto w-full rounded-full border-slate-300/80 bg-white px-7 py-3.5 text-sm text-slate-700 hover:border-slate-400 hover:bg-slate-50 sm:w-auto sm:text-base dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
          >
            <Play className="text-slate-500 dark:text-slate-400" />
            司凤版校歌
          </Button>
        </div>

        <div data-enter className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-2 text-sm text-slate-500 sm:w-auto sm:flex-row dark:text-slate-400">
          <span>山东奶龙大学官方群：</span>
          <div className="inline-flex w-full max-w-md items-center justify-center gap-3 rounded-full border border-slate-200/90 bg-white/80 px-4 py-2 shadow-xs backdrop-blur-xs sm:w-auto dark:border-slate-600/70 dark:bg-slate-800/80">
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
            <DialogTitle className="font-serif text-lg text-sdnu-navy dark:text-slate-100">⚡山东师大校歌⚡｜司凤版</DialogTitle>
            <DialogDescription className="font-sans text-xs">
              由{" "}
              <a
                href="https://space.bilibili.com/689635411/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sdnu-navy underline-offset-4 transition hover:underline dark:text-amber-300"
              >
                @神奇好命
              </a>{" "}
              倾情制作 · B站，求关注、求一键三连~
            </DialogDescription>
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
