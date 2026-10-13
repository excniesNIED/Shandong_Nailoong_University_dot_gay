/**
 * 奶龙 drawn from the cubic Bézier formula
 *   B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃,  0 ≤ t ≤ 1
 * plus the two parametric circles (eye / pupil) and the mouth segment.
 * SVG `C` commands evaluate exactly this polynomial, so each curve is emitted
 * as `M P₀ C P₁ P₂ P₃`. Control points are in the reference plot's math
 * coordinates (y up), re-fitted from the plot and widened for a rounder body.
 */

type Point = readonly [number, number]
type Cubic = readonly [Point, Point, Point, Point]

// Math (y-up) → SVG (y-down).
const pt = ([x, y]: Point) => `${x} ${-y}`
const cubic = ([p0, p1, p2, p3]: Cubic) => `M${pt(p0)} C${pt(p1)} ${pt(p2)} ${pt(p3)}`

const THROAT: Cubic = [[-1.3, 0.3], [-0.9, -0.8], [-2.3, -2.1], [-2.05, -4]]
const HEAD_FRONT: Cubic = [[-1.3, 0.35], [-1.5, 2.0], [-0.3, 3.4], [1.1, 3.4]]
const HEAD_BACK: Cubic = [[1.1, 3.4], [2.7, 3.4], [3.7, 2.0], [3.8, 0.2]]
const BACK: Cubic = [[3.8, 0.2], [3.9, -1.3], [4.9, -2.6], [5.1, -4]]
const EYE = { cx: 0.5, cy: 1.85, r: 0.6 }
const PUPIL = { cx: 0.72, cy: 1.83, r: 0.27 }
const MOUTH: readonly [Point, Point] = [[-1.25, 0.22], [0, 0.22]]

/** Left eye (smaller, side view): the curl outline closed by a straight chord
    along the head line, plus its pupil and highlight — same colors as the
    right eye, per the reference nailoog.webp. */
const EYE_LEFT_CURVE: Cubic = [[-1.32, 1.0], [-1.75, 1.3], [-1.65, 2.1], [-1.12, 1.95]]
const EYE_LEFT = { cx: -1.4, cy: 1.48, rx: 0.13, ry: 0.17 }
const EYE_LEFT_HIGHLIGHT = { cx: -1.445, cy: 1.54, r: 0.05 }
const EYE_LEFT_BUMP = `${cubic(EYE_LEFT_CURVE)} Z`

/** Closed silhouette: throat reversed, then head and back, bottom closed by Z. */
const SILHOUETTE = [
  `M${pt(THROAT[3])} C${pt(THROAT[2])} ${pt(THROAT[1])} ${pt(THROAT[0])}`,
  `L${pt(HEAD_FRONT[0])} C${pt(HEAD_FRONT[1])} ${pt(HEAD_FRONT[2])} ${pt(HEAD_FRONT[3])}`,
  `C${pt(HEAD_BACK[1])} ${pt(HEAD_BACK[2])} ${pt(HEAD_BACK[3])}`,
  `C${pt(BACK[1])} ${pt(BACK[2])} ${pt(BACK[3])} Z`,
].join(" ")

/** Bounding box of the figure in SVG user units, padded for stroke width. */
export const NAILONG_VIEWBOX = "-2.6 -3.8 8.2 8.2"

const STROKE_PATHS = [
  cubic(THROAT),
  // Head + back as one path so the shared endpoints have a proper line join.
  `${cubic(HEAD_FRONT)} C${pt(HEAD_BACK[1])} ${pt(HEAD_BACK[2])} ${pt(HEAD_BACK[3])} C${pt(BACK[1])} ${pt(BACK[2])} ${pt(BACK[3])}`,
  cubic(EYE_LEFT_CURVE),
  `M${pt(MOUTH[0])} L${pt(MOUTH[1])}`,
]

interface NailongFigureProps {
  /** Unique id prefix for the clip paths (several figures may share a page). */
  id: string
  strokeColor?: string
  strokeWidth?: number
}

/**
 * Stroke elements carry `data-stroke` so a draw animation can measure
 * `getTotalLength()` and tween `stroke-dasharray`/`-offset` from that length to
 * 0 (React Bits StrokeText technique); the fill layer is clipped by
 * `#${id}-wipe`, whose rect a loader can grow bottom → top.
 */
export function NailongFigure({ id, strokeColor = "#1f2937", strokeWidth = 0.07 }: NailongFigureProps) {
  const stroke = {
    fill: "none",
    stroke: strokeColor,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "data-stroke": "",
  }
  return (
    <g>
      <defs>
        <clipPath id={`${id}-body`}>
          <path d={SILHOUETTE} />
        </clipPath>
        <clipPath id={`${id}-wipe`} clipPathUnits="userSpaceOnUse">
          <rect data-wipe x="-2.7" y="-3.8" width="8.4" height="8.2" />
        </clipPath>
      </defs>

      <g data-fill clipPath={`url(#${id}-wipe)`}>
        <path d={SILHOUETTE} fill="#FFCA28" />
        <g clipPath={`url(#${id}-body)`}>
          <ellipse cx="-0.2" cy="2.8" rx="2.3" ry="1.9" fill="#FFF3C4" opacity="0.85" />
          <ellipse cx="4.0" cy="1.2" rx="1.5" ry="2.8" fill="#F59E0B" opacity="0.25" />
        </g>
        {/* Left eye (smaller): white sclera from the curl outline, pupil and
            highlight mirroring the right eye. */}
        <path d={EYE_LEFT_BUMP} fill="#FFFDF9" />
        <ellipse cx={EYE_LEFT.cx} cy={-EYE_LEFT.cy} rx={EYE_LEFT.rx} ry={EYE_LEFT.ry} fill="#2D5A8C" />
        <circle cx={EYE_LEFT_HIGHLIGHT.cx} cy={-EYE_LEFT_HIGHLIGHT.cy} r={EYE_LEFT_HIGHLIGHT.r} fill="#ffffff" />
        {/* Right eye (larger, front view) */}
        <ellipse cx={EYE.cx} cy={-EYE.cy} rx={EYE.r * 1.1} ry={EYE.r * 1.15} fill="#FFFDF9" />
        <ellipse cx={PUPIL.cx} cy={-PUPIL.cy} rx={PUPIL.r * 1.1} ry={PUPIL.r * 1.2} fill="#2D5A8C" />
        <circle cx={PUPIL.cx - 0.08} cy={-PUPIL.cy - 0.09} r="0.08" fill="#ffffff" />
        <ellipse cx="-0.45" cy="-0.85" rx="0.3" ry="0.18" fill="#F87171" opacity="0.55" />
      </g>

      {STROKE_PATHS.map((d) => (
        <path key={d} d={d} {...stroke} />
      ))}
      {/* Eye stroke for loader draw animation */}
      <ellipse cx={EYE.cx} cy={-EYE.cy} rx={EYE.r * 1.1} ry={EYE.r * 1.15} {...stroke} strokeWidth={strokeWidth * 1.2} />
    </g>
  )
}
