import { useRef, useState } from "react"
import type { MouseEvent, Ref } from "react"

import { Emblem } from "@/components/emblem"
import { QUOTES } from "@/lib/quotes"
import { playSound } from "@/lib/sound"
import { burstSparkles } from "@/lib/sparkles"
import { cn } from "@/lib/utils"

interface InteractiveEmblemProps {
  /** Lets the page drive the entrance animation on the button itself (home hero). */
  emblemRef?: Ref<HTMLButtonElement>
  className?: string
  /** Extra classes for the quote line (e.g. fixed height to keep the emblem still). */
  quoteClassName?: string
}

/**
 * The home-hero interactive icon: spinning orbit rings around the clickable
 * emblem; clicking bursts sparkles and rotates through the 山师语录.
 */
export function InteractiveEmblem({ emblemRef, className, quoteClassName }: InteractiveEmblemProps) {
  const avatarRef = useRef<SVGGElement>(null)
  const [quote, setQuote] = useState(0)

  const nextQuote = (e: MouseEvent) => {
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

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="hero-emblem group relative my-3 select-none sm:my-5">
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
        className={cn(
          "mt-6 min-h-[1.75rem] max-w-md text-center font-serif text-sm text-amber-800 sm:text-base dark:text-amber-300",
          quoteClassName,
        )}
      >
        「{QUOTES[quote]}」
      </p>
    </div>
  )
}
