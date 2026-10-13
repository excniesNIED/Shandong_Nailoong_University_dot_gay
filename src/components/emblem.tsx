import { NAILONG_VIEWBOX, NailongFigure } from "@/components/nailong-figure"

/**
 * Page seal: SDNU's round emblem (wordmark stripped, `public/sdnu-emblem.svg`)
 * with the loader's Bézier 奶龙 sitting on top of the shield.
 */
export function Emblem({ avatarRef }: { avatarRef: React.Ref<SVGGElement> }) {
  return (
    <svg viewBox="0 0 340 340" className="h-60 w-60 overflow-visible drop-shadow-xl sm:h-72 sm:w-72" aria-hidden="true">
      <circle cx="170" cy="170" r="168" fill="#ffffff" />
      <image href="/sdnu-emblem.svg" x="4" y="4" width="332" height="332" />
      <g ref={avatarRef} className="animate-nailong" style={{ transformBox: "fill-box" }}>
        <svg x="88" y="92" width="164" height="164" viewBox={NAILONG_VIEWBOX} overflow="visible">
          <NailongFigure id="emblem" strokeColor="#153e75" strokeWidth={0.14} />
        </svg>
      </g>
    </svg>
  )
}
