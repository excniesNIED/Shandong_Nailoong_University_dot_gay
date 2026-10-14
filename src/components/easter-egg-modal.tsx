import { useState } from "react"
import { Check, Copy, RotateCw, SquareTerminal } from "lucide-react"
import { toast } from "sonner"

import { EasterEggTerminal } from "@/components/easter-egg-terminal"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { EASTER_EGG_COMMAND } from "@/lib/egg"
import { playSound } from "@/lib/sound"
import { cn } from "@/lib/utils"

/**
 * /78 surprise, styled after the shadcnblocks offer-modal4: banner image on
 * top, headline, a copyable command instead of an input, and an 在线执行
 * button. Executing joins an eldoraui-style terminal to the right, same
 * height, the pair centered as one block.
 */
export function EasterEggModal() {
  const [open, setOpen] = useState(true)
  const [executed, setExecuted] = useState(false)
  const [runId, setRunId] = useState(0)
  const [copied, setCopied] = useState(false)

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(EASTER_EGG_COMMAND)
      playSound("chime")
      setCopied(true)
      toast.success("命令已复制，去终端里粘贴吧！")
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.info(`复制失败，手动输入也可以：${EASTER_EGG_COMMAND}`)
    }
  }

  const execute = () => {
    playSound("click")
    setRunId((id) => id + 1) // remount → typewriter reruns
    setExecuted(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "block w-[calc(100%-2rem)] gap-0 overflow-hidden rounded-2xl border-amber-200/70 bg-white p-0 sm:max-w-[380px] dark:border-slate-700 dark:bg-card",
          executed && "sm:max-w-[960px]",
          "[&>[data-slot=dialog-close]]:z-20 [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:bg-white/85 [&>[data-slot=dialog-close]]:shadow-xs dark:[&>[data-slot=dialog-close]]:bg-zinc-800/90",
        )}
      >
        <div className="flex">
          <div
            className={cn(
              "flex shrink-0 flex-col",
              // Portrait: executing hides the offer pane entirely — only the
              // terminal result shows, filling the dialog.
              executed ? "w-[46%] sm:w-[350px] portrait:hidden" : "w-full",
            )}
          >
            <img
              src="/og.jpg"
              alt="山东奶龙大学宣传图：戴学士帽的奶龙与山东师范大学校园"
              className="h-44 w-full object-cover md:h-48"
            />
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="space-y-1.5 text-center">
                <p className="font-sans text-[10px] font-bold tracking-[0.25em] text-amber-600 uppercase dark:text-amber-400">
                  Easter Egg · 彩蛋
                </p>
                <DialogTitle className="font-serif text-xl font-bold text-sdnu-navy dark:text-slate-100">
                  🎉 恭喜你发现了彩蛋
                </DialogTitle>
                <DialogDescription className="font-sans text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  你在网址后多敲了一个{" "}
                  <code className="rounded bg-slate-100 px-1 font-mono dark:bg-slate-800">/78</code>
                  ，正好被护学的奶龙逮个正着。把下面这条命令丢进终端，看看它会打印什么。
                </DialogDescription>
              </div>

              <div className="no-auto-dark flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-950 py-2.5 pr-2 pl-3.5">
                <code className="truncate font-mono text-xs text-zinc-300">
                  <span className="mr-1.5 text-emerald-400">$</span>
                  {EASTER_EGG_COMMAND}
                </code>
                <button
                  type="button"
                  onClick={copyCommand}
                  aria-label="复制命令"
                  className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
              </div>

              <Button
                onClick={execute}
                className="mt-auto h-11 w-full cursor-pointer rounded-full bg-sdnu-navy text-sm tracking-wide text-white shadow-lg shadow-sdnu-navy/25 hover:bg-sdnu-deep"
              >
                {executed ? <RotateCw /> : <SquareTerminal />}
                {executed ? "重新执行" : "在线执行"}
              </Button>
            </div>
          </div>

          {executed && (
            <div className="no-auto-dark min-w-0 flex-1 animate-in fade-in slide-in-from-right-4 border-l border-zinc-800/60 bg-zinc-900/60 p-3 duration-500 sm:p-4">
              <div className="h-full min-w-0">
                <EasterEggTerminal key={runId} />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
