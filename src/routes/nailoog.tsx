import { createFileRoute } from "@tanstack/react-router"

import { PixelCard } from "@/components/pixel-card"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/nailoog")({
  head: () => ({
    meta: [
      { title: "奶家军 · 山东奶龙大学" },
      {
        name: "description",
        content:
          "山东奶龙大学奶家军导航：奶群和奶站合集（NaiList、奶龙大学排行榜、奶龙中心、奶龙随机跳转）与奶龙小游戏大全（奶蛙狂笑、合成大奶蛙、奶了个蛙等），浏览器打开就能玩。",
      },
    ],
  }),
  component: Nailoog,
})

interface NaiCard {
  title: string
  /** Display form of the link, also used to build the https href. */
  link: string
  desc: string
}

const COLLECTIONS: NaiCard[] = [
  { title: "NaiList", link: "nai.amoe.cc", desc: "奶群列表：收录各大奶龙官方群，一键找到组织。" },
  {
    title: "奶龙大学排行榜",
    link: "naiwa.win",
    desc: "全国奶龙大学奶力排行榜：玩奶蛙小游戏给本校加奶力，还收录各校奶龙大学域名和奶龙群。",
  },
  {
    title: "奶龙中心",
    link: "nailong.panini-pigs.cn",
    desc: "奶龙互联网中转站：把散落在互联网里的奶龙、奶蛙主题网站装进一个软乎乎的入口。",
  },
  { title: "奶龙随机跳转", link: "奶龙.link", desc: "手气不错？一键随机传送到奶龙宇宙的某个角落。" },
]

const GAMES: NaiCard[] = [
  { title: "奶蛙狂笑", link: "milkyfrog.com", desc: "奶蛙官方本站：戳一下就开始狂笑的招财金蛙。" },
  { title: "合成大奶蛙", link: "milkyfrog.com/hecheng", desc: "两只一样的奶蛙撞在一起，一路合出究极奶蛙。" },
  { title: "奶蛙神跑", link: "milkyfrog.com/shenpao", desc: "奶蛙主题跑酷，看看你能跑多远。" },
  { title: "奶蛙羽毛球", link: "milkyfrog.com/yumaoqiu", desc: "奶蛙挥拍上阵的羽毛球对决。" },
  { title: "奶蛙jump", link: "milkyfrog.com/jump", desc: "点一下跳一下，躲开危险往前冲。" },
  { title: "召唤神龙", link: "milkyfrog.com/shenlong", desc: "合成进化玩法，集齐奶蛙召唤神龙。" },
  { title: "奶蛙放屁", link: "milkyfrog.com/fangpi", desc: "无厘头整活音效小游戏，慎在自习室打开。" },
  { title: "抓奶蛙", link: "milkyfrog.com/zhua", desc: "手速大考验：抓住四处乱窜的奶蛙。" },
  { title: "奶蛙贪吃蛙", link: "milkyfrog.com/tanchiwa", desc: "奶蛙版贪吃蛇，越吃越长越难拐弯。" },
  { title: "奶蛙2048超级版", link: "milkyfrog.com/2048", desc: "滑动合成数字，冲击超级奶蛙。" },
  { title: "奶蛙五子棋", link: "milkyfrog.com/wuziqi", desc: "和奶蛙下五子棋，别大意。" },
  { title: "奶了个蛙", link: "milkyfrog.com/nailegewa", desc: "三张一样就消除，越到后面越上头。" },
  { title: "奶蛙一跳", link: "milkyfrog.com/tiao", desc: "一跳定胜负的小挑战。" },
  { title: "奶斗罗", link: "milkyfrog.com/douluo", desc: "斗罗大陆风的奶蛙冒险。" },
  { title: "奶蛙颜色大挑战", link: "milkyfrog.com/yanse", desc: "考验眼力和色感的颜色挑战。" },
  { title: "旅行奶蛙", link: "milkyfrog.com/lvxing", desc: "奶蛙出门旅行啦，替它收拾行囊。" },
  { title: "奶蛙快跑", link: "milkyfrog.com/kuaipao", desc: "躲开障碍，带奶蛙一路狂奔。" },
  { title: "奶蛙工厂", link: "milkyfrog.com/gongchang", desc: "经营奶蛙工厂，流水线产出快乐。" },
  { title: "奶蛙街舞", link: "milkyfrog.com/jiewu", desc: "跟着节奏看奶蛙斗舞。" },
  { title: "奶蛙鼓鼓碰", link: "milkyfrog.com/gugupeng", desc: "鼓点节奏小游戏，敲就完事了。" },
  { title: "奶蛙消消乐", link: "milkyfrog.com/xiaoxiaole", desc: "经典消消乐的奶蛙皮肤版。" },
  { title: "奶蛙的小窝", link: "milkyfrog.com/xiaowo", desc: "装扮奶蛙的小窝，怎么可爱怎么来。" },
  { title: "更多奶蛙游戏", link: "milkyfrog.com/games", desc: "奶蛙官网持续收录全网奶蛙小游戏，这里只是其中一部分。" },
  { title: "合成大奶蛙", link: "naiwa.win/games/merge", desc: "两只一样的撞一起，能合出究极奶蛙吗？" },
  { title: "奶了个蛙", link: "naiwa.win/games/stack", desc: "三张一样就消除，第二关通关率 0.1%。" },
  { title: "奶蛙大胃王", link: "naiwa.win/games/eat", desc: "吃掉比你小的，躲开比你大的。" },
  { title: "奶蛙跳跳", link: "naiwa.win/games/jump", desc: "点一下跳一下，躲开奶瓶。" },
  { title: "奶蛙 2048", link: "naiwa.win/games/2048", desc: "滑动合成，养出究极奶蛙。" },
  { title: "打奶蛙", link: "naiwa.win/games/whack", desc: "30 秒能拍到几只？" },
  { title: "奶蛙跳砖", link: "naiwa.win/games/hop", desc: "按住蓄力，松手跳到下一块砖。" },
  { title: "奶蛙火车", link: "naiwa.win/games/train", desc: "捡上小奶蛙排成一列，别撞到自己。" },
  { title: "奶蛙色感", link: "naiwa.win/games/color", desc: "找出颜色不一样的那只，60 秒能过几关。" },
  { title: "奶蛙憋不住", link: "naiwa.win/games/fart", desc: "趁老师不注意偷偷放屁，被看见就完了。" },
]

function NaiCardRow({ title, link, desc }: NaiCard) {
  return (
    <PixelCard className="h-full">
      <div className="flex h-full w-full flex-col gap-1.5 p-5 text-left">
        <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
        <p className="truncate font-sans text-xs text-muted-foreground">{link}</p>
        <p className="mt-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{desc}</p>
        <Button
          asChild
          className="mt-auto h-auto self-start rounded-full bg-sdnu-navy px-5 py-2 text-sm text-white shadow-md shadow-sdnu-navy/20 hover:bg-sdnu-deep"
        >
          <a href={`https://${link}`} target="_blank" rel="noopener noreferrer">
            访问
          </a>
        </Button>
      </div>
    </PixelCard>
  )
}

function Nailoog() {
  return (
    <main id="main" className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
      <header className="max-w-2xl">
        <h1 className="hero-title font-serif text-4xl font-black tracking-tight text-sdnu-navy sm:text-5xl dark:text-slate-50">
          奶<span className="nailong-highlighter mx-1 text-sdnu-navy dark:text-slate-50">家军</span>
        </h1>
        <p className="mt-3 font-serif text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          奶群、奶站与奶龙小游戏大全——奶家人的秘密基地，全都在这里集结。
        </p>
      </header>

      <section className="mt-10">
        <h2 className="font-serif text-2xl font-bold text-sdnu-navy dark:text-slate-100">奶群和奶站合集</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">官方群列表、排行榜与网址导航，一键直达组织。</p>
        <div className="mt-5 grid grid-cols-1 gap-4 landscape:grid-cols-3">
          {COLLECTIONS.map((card) => (
            <NaiCardRow key={card.link} {...card} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-bold text-sdnu-navy dark:text-slate-100">奶龙小游戏</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          由奶家人自发制作、持续收录，浏览器打开就能玩，不用下载。
        </p>
        <div className="mt-5 grid grid-cols-1 gap-4 landscape:grid-cols-3">
          {GAMES.map((card) => (
            <NaiCardRow key={card.link} {...card} />
          ))}
        </div>
      </section>
    </main>
  )
}
