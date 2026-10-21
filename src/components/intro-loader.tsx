import { useLayoutEffect, useRef } from "react"
import { gsap } from "gsap"

import { NAILONG_VIEWBOX, NailongFigure } from "@/components/nailong-figure"

interface IntroLoaderProps {
  /** Fires when the overlay starts dissolving; the page runs its entrance then. */
  onReveal: () => void
  /** Fires after the overlay has fully faded and may be unmounted. */
  onDone: () => void
}

// The loader is a full-screen cover: everything the page shows is painted
// only after it hands over. These values keep the draw readable while the
// largest contentful paint stays early (mobile LCP was ~4.3s with 1.5/0.16).
const DRAW = 0.9
const STAGGER = 0.08

/**
 * Full-screen loader: strokes of the Bézier 奶龙 draw themselves on, the body
 * floods with yellow (bottom-up wipe), the caption fills, then the overlay
 * dissolves into the page. Mirrors React Bits StrokeText (dash draw → fill wipe).
 */
export function IntroLoader({ onReveal, onDone }: IntroLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const strokes = Array.from(root.querySelectorAll<SVGGeometryElement>("[data-stroke]"))
    const wipe = root.querySelector("[data-wipe]")
    const caption = root.querySelectorAll("[data-caption] > span")
    const progress = root.querySelector("[data-progress]")
    const figure = root.querySelector("[data-figure]")

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      // StrokeText-style dash: per-element measured length + 2% margin, no
      // pathLength normalization. dasharray == pathLength (1) leaves rounding
      // gaps at the path seams once the draw settles (ear tail, eye circle).
      strokes.forEach((el) => {
        const dash = el.getTotalLength() * 1.02
        gsap.set(el, { strokeDasharray: dash, strokeDashoffset: dash })
      })
      // Wipe rect covers y ∈ [-3.8, 4.4]; collapse to the bottom edge.
      gsap.set(wipe, { attr: { y: 4.4, height: 0 } })
      gsap.set(caption, { opacity: 0, y: 8 })
      gsap.set(progress, { scaleX: 0 })

      const tl = gsap.timeline({ onComplete: onDone })
      if (reduced) tl.timeScale(4)

      tl.to(strokes, { strokeDashoffset: 0, duration: DRAW, ease: "power2.inOut", stagger: STAGGER }, 0)
      const drawEnd = DRAW + STAGGER * (strokes.length - 1)
      tl.to(progress, { scaleX: 1, duration: drawEnd + 1.1, ease: "none" }, 0)
      tl.to(caption, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 }, 0.5)
      tl.to(wipe, { attr: { y: -3.8, height: 8.2 }, duration: 0.9, ease: "power2.inOut" }, drawEnd + 0.1)
      tl.to(figure, { scale: 1.06, duration: 0.18, ease: "power1.out", yoyo: true, repeat: 1, transformOrigin: "50% 100%" })
      // ctx.ignore: tweens created by the page must not be reverted with the loader.
      tl.add(() => ctx.ignore(onReveal), "+=0.15")
      tl.to(figure, { scale: 0.45, y: -40, opacity: 0, duration: 0.55, ease: "back.in(1.4)" }, "<")
      tl.to(root, { opacity: 0, duration: 0.6, ease: "power2.out" }, "<0.2")
    }, root)
    return () => ctx.revert()
    // Callbacks are fixed for one loader lifetime; a replay remounts via key.
  }, [])

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-campus-parchment dark:bg-background"
      role="status"
      aria-label="奶龙正在绘制中"
    >
      <div className="pointer-events-none absolute inset-2 diploma-border md:inset-4" />
      <svg data-figure viewBox={NAILONG_VIEWBOX} className="h-52 w-52 overflow-visible sm:h-64 sm:w-64" aria-hidden="true">
        <NailongFigure id="loader" strokeColor="#153e75" strokeWidth={0.075} />
      </svg>
      <p data-caption className="mt-6 font-serif text-lg font-bold tracking-[0.3em] text-sdnu-navy sm:text-xl dark:text-amber-300">
        {Array.from("欢迎来到山东奶龙大学").map((ch, i) => (
          <span key={i} className="inline-block">
            {ch}
          </span>
        ))}
      </p>
      <div className="mt-6 h-0.5 w-40 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div data-progress className="h-full origin-left bg-nailong-darkyellow" />
      </div>
    </div>
  )
}
