import { createFileRoute } from "@tanstack/react-router"

import { EasterEggModal } from "@/components/easter-egg-modal"
import { Home } from "@/components/home"

export const Route = createFileRoute("/78")({ component: Home78 })

/** /78 easter egg: the full homepage, plus the surprise dialog on top. */
function Home78() {
  return (
    <>
      <Home />
      <EasterEggModal />
    </>
  )
}
