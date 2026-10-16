import { gsap } from "gsap"

const SPARKLES = ["✨", "💛", "🌟", "🥟"]

/** Burst a handful of emoji sparkles at a viewport position, then fade them out. */
export function burstSparkles(x: number, y: number) {
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
