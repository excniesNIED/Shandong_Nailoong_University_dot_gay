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

export const playSqueak = () => tone("sine", [[420, 0], [880, 0.12], [600, 0.25]], 0.3, 0.25)
export const playChime = () => tone("triangle", [[880, 0], [1320, 0.08]], 0.18, 0.35)
