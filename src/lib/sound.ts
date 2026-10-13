let ctx: AudioContext | null = null

function audio(): AudioContext {
  ctx ??= new AudioContext()
  if (ctx.state === "suspended") void ctx.resume()
  return ctx
}

/** Short pitch-bent tone; silent if Web Audio is unavailable. */
function tone(type: OscillatorType, freqs: [number, number][], peak: number, length: number) {
  try {
    const ac = audio()
    const now = ac.currentTime
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.type = type
    for (const [hz, at] of freqs) {
      if (at === 0) osc.frequency.setValueAtTime(hz, now)
      else osc.frequency.exponentialRampToValueAtTime(hz, now + at)
    }
    gain.gain.setValueAtTime(peak, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + length)
    osc.connect(gain).connect(ac.destination)
    osc.start(now)
    osc.stop(now + length + 0.01)
  } catch {
    // Audio is decoration only.
  }
}

/** Click tracks: 1.mp3 25%, 2–6.mp3 15% each (sums to 100). */
const CLICK_TRACKS: { src: string; weight: number }[] = [
  { src: "/1.mp3", weight: 25 },
  ...[2, 3, 4, 5, 6].map((n) => ({ src: `/${n}.mp3`, weight: 15 })),
]

/** Play an mp3 asset; silent on any failure (audio is decoration). */
function track(src: string, volume = 0.7) {
  try {
    const el = new Audio(src)
    el.volume = volume
    void el.play().catch(() => {
      // Autoplay rejection is fine; audio is decoration.
    })
  } catch {
    // Audio is decoration only.
  }
}

/**
 * Sound effects entry point.
 * - "click": weighted-random mp3 from /1–6.mp3, fired on interactive clicks.
 * - "chime": short synth confirmation for copy feedback.
 * - "reload": fixed /1.mp3 cue for the 重新载入动画 replay loader.
 * All are decoration; every failure path stays silent.
 */
export function playSound(kind: "click" | "chime" | "reload") {
  if (kind === "click") {
    const roll = Math.random() * 100
    let acc = 0
    const chosen = CLICK_TRACKS.find((t) => (acc += t.weight) > roll) ?? CLICK_TRACKS[0]
    track(chosen.src)
    return
  }
  if (kind === "reload") {
    track("/1.mp3")
    return
  }
  tone("triangle", [[880, 0], [1320, 0.08]], 0.18, 0.35)
}
