import { useEffect, useMemo, useRef, useState } from "react"
import { TerminalIcon } from "lucide-react"
import { toast } from "sonner"

import { EASTER_EGG_COMMAND, MAMA_ART } from "@/lib/egg"
import { playSound } from "@/lib/sound"

const COMMAND = EASTER_EGG_COMMAND
const ART_LINES = MAMA_ART.split("\n")

/** Command typing cadence (ms/char), then one output line per tick (ms). */
const TYPE_MS = 55
const LINE_MS = 85

function MacControls() {
  return (
    <>
      <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
      <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
    </>
  )
}

/**
 * EldoraUI-style terminal: typewriter types the curl command, then the ASCII
 * art returned by functions/78.js prints line by line. Static simulation —
 * MAMA_ART mirrors the function's CLI response byte for byte.
 */
export function EasterEggTerminal() {
  const reduced = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, [])
  const [typed, setTyped] = useState(() => (reduced ? COMMAND.length : 0))
  const [printed, setPrinted] = useState(() => (reduced ? ART_LINES.length : 0))

  const typing = typed < COMMAND.length
  const printing = !typing && printed < ART_LINES.length
  const done = !typing && !printing

  // Success toast when the output finishes; ref guards StrictMode double-fire.
  const announced = useRef(false)
  useEffect(() => {
    if (!done || announced.current) return
    announced.current = true
    playSound("chime")
    toast.success("山东奶龙大学.gay", { description: "命令执行成功" })
  }, [done])

  useEffect(() => {
    if (!typing) return
    const timer = window.setTimeout(() => setTyped((n) => n + 1), TYPE_MS)
    return () => window.clearTimeout(timer)
  }, [typing, typed])

  useEffect(() => {
    if (!printing) return
    const timer = window.setTimeout(() => setPrinted((n) => n + 1), LINE_MS)
    return () => window.clearTimeout(timer)
  }, [printing, printed])

  return (
    <div className="no-auto-dark h-full min-w-0">
      <pre className="flex h-full max-h-[calc(100dvh-6rem)] min-h-[320px] w-full flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 font-mono text-[11px] leading-[1.6] text-zinc-300 shadow-lg">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 bg-zinc-900 py-2.5 pr-12 pl-3.5">
          <TerminalIcon className="mr-1 size-3.5 text-zinc-500" />
          <MacControls />
          <span className="ml-auto font-mono text-[10px] text-zinc-500">nailong@sdnu: ~</span>
        </div>
        <div className="min-w-0 flex-1 overflow-auto p-4">
          <div className="text-zinc-100">
            <span className="text-zinc-500">nailong@sdnu:</span>{" "}
            <span className="mr-1.5 text-emerald-400">$</span>
            <span className="break-all whitespace-pre-wrap">{COMMAND.slice(0, typed)}</span>
            {typing && (
              <span className="ml-px inline-block h-3.5 w-[7px] animate-pulse bg-zinc-100 align-[-2px]" />
            )}
          </div>
          {!typing && (
            <div className="mt-2 text-zinc-300">
              {ART_LINES.slice(0, printed).map((line, i) => (
                <div key={i} className="whitespace-pre">
                  {line || "\u00A0"}
                </div>
              ))}
              {printing && <span className="inline-block h-3.5 w-[7px] animate-pulse bg-zinc-100" />}
            </div>
          )}
        </div>
      </pre>
    </div>
  )
}
