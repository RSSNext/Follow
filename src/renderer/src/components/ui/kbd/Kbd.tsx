import { cn, getOS } from "@renderer/lib/utils"
import type { FC } from "react"

const SpecialKeys = {
  Windows: {
    meta: "⊞",
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
  },
  macOS: {
    meta: "⌘",
    ctrl: "⌃",
    alt: "⌥",
    shift: "⇧",
  },
  Linux: {
    meta: "Super",
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
  },
}

export const Kbd: FC<{
  children: string
  className?: string
}> = ({ children, className }) => {
  const specialKeys = SpecialKeys[getOS()] as Record<string, string>
  let key = children
  for (const [k, v] of Object.entries(specialKeys)) {
    key = key.replaceAll(new RegExp(k, "gi"), v)
  }

  return (
    <div className="space-x-1">
      {key.split(",").map((k) => (
        <kbd key={k} className={cn("kbd h-4 font-mono text-[0.9em]", className)}>{k}</kbd>
      ))}
    </div>
  )
}
