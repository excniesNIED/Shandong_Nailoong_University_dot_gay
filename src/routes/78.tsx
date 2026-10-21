import { createFileRoute } from "@tanstack/react-router"

import { EasterEggModal } from "@/components/easter-egg-modal"
import { Home } from "@/components/home"

export const Route = createFileRoute("/78")({
  head: () => ({
    meta: [
      { title: "终端彩蛋 · 山东奶龙大学" },
      {
        name: "description",
        content:
          "山东奶龙大学终端彩蛋页：在终端执行 curl https://91.xn--xhq02y0gz4ebvbj98t.gay/78 即可拿到ASCII 艺术「妈」字回应。浏览器打开本页可以看到奶龙护学主页与惊喜弹窗。",
      },
    ],
  }),
  component: Home78,
})

/** /78 easter egg: the full homepage, plus the surprise dialog on top. */
function Home78() {
  return (
    <>
      <Home />
      <EasterEggModal />
      {/* Rendered on the server too, so the curl command is crawlable text. */}
      <p className="relative z-10 mx-auto mb-10 px-4 text-center font-mono text-xs text-slate-500 dark:text-slate-400">
        终端彩蛋：
        <code className="font-mono">curl https://91.xn--xhq02y0gz4ebvbj98t.gay/78</code>
      </p>
    </>
  )
}
