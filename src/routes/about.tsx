import { createFileRoute, Link } from "@tanstack/react-router"

import { InteractiveEmblem } from "@/components/interactive-emblem"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "关于本站 · 山东奶龙大学" },
      {
        name: "description",
        content:
          "山东奶龙大学（Shandong Nailoong University，简称 SDNU），又称山东奶蛙大学、山东乃万大学，系山东师范大学学生自发组建的野生整活组织：奶龙坐镇校徽，特级护学、专治期末周，另设山师语录、奶家军导航与官方群。",
      },
    ],
  }),
  component: About,
})

const AREAS = [
  {
    title: "🛡️ 特级护学",
    desc: "奶龙已就位，坐镇校徽，在千佛山与长清湖两校区为山师人护学：活泼乐观、大肚能容，从容面对教资、考研与期末周。",
  },
  {
    title: "✨ 山师语录",
    desc: "戳一下校徽，奶龙就换一句山师语录；主页还埋着终端 ASCII 彩蛋，等你亲手触发。",
  },
  {
    title: "🏛️ 前身今世",
    desc: "山东师范大学办学文脉可追溯到 1902 年山东大学堂师范馆，1950 年组建山东师范学院，1981 年更名至今；现有 25 个学院（部）、64 个招生本科专业，是省部共建高校、山东省高水平大学“冲一流”建设高校，校训“弘德明志、博学笃行”。",
  },
  {
    title: "🐸 奶家军",
    desc: "奶群和奶站合集、奶龙小游戏大全都在「奶家军」页一键直达；山东奶龙大学官方群：QQ 641370366，官方域名：山东奶龙大学.gay。",
  },
]

function About() {
  return (
    <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
      <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-14">
        {/* Portrait: interactive emblem on top, copy below. Landscape: copy left, emblem right. */}
        <div className="order-2 max-w-2xl lg:order-1">
          <span className="inline-block rounded-full border border-amber-300/80 bg-amber-50/90 px-3.5 py-1 font-serif text-xs font-medium text-amber-800 shadow-2xs dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300">
            🎓 山东师范大学奶龙官方组织
          </span>
          <h1 className="hero-title mt-4 font-serif text-4xl font-black tracking-tight text-sdnu-navy sm:text-5xl dark:text-slate-50">
            山东<span className="nailong-highlighter mx-1 text-sdnu-navy dark:text-slate-50">奶龙</span>大学
          </h1>
          <p className="mt-2 font-serif text-sm tracking-[0.057em] text-sdnu-navy/70 dark:text-slate-400">
            Shandong Nailoong University
          </p>

          <p className="mt-5 font-serif text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
            山东奶龙大学（Shandong Nailoong University，简称 SDNU），又称山东奶蛙大学（Shandong Milkyfrog University）、山东乃万大学（Shandong Nine-One University），坐落于山东省济南市，位于赛博空间的非正式野生整活高校：奶龙坐镇校徽，特级护学、专治期末周，赛博吸娃/吸蛙。下面四个区域，带你逛遍这所大学——
          </p>

          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {AREAS.map((area) => (
              <div key={area.title}>
                <h2 className="font-serif text-base font-bold text-sdnu-navy dark:text-slate-100">{area.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{area.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 rounded-lg border border-amber-200/60 bg-amber-50/70 p-3 text-xs leading-relaxed text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            💡 <strong>免责声明：</strong>本站为山东师范大学奶龙官方组织（学生自发整活组织），与山东师范大学官方无隶属关系。
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-auto rounded-full bg-sdnu-navy px-7 py-3 text-sm tracking-wide text-white shadow-lg shadow-sdnu-navy/25 hover:bg-sdnu-deep">
              <Link to="/nailoog">去奶家军逛逛 →</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto rounded-full border-slate-300/80 bg-white px-7 py-3 text-sm text-slate-700 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-700"
            >
              <a href="https://www.sdnu.edu.cn" target="_blank" rel="noopener noreferrer">
                前往山师官网
              </a>
            </Button>
          </div>
        </div>

        <div className="order-1 flex w-full justify-center lg:order-2 lg:w-[30rem]">
          <InteractiveEmblem quoteClassName="w-full min-h-[3.5rem]" />
        </div>
      </div>
    </main>
  )
}
