import { cn, getOS } from "@renderer/lib/utils"
import type { FC } from "react"
import { Fragment, memo } from "react"

const SpecialKeys = {
  Windows: {
    meta: "⊞",
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    backspace: "⌫",
    space: "␣",
  },
  macOS: {
    meta: "⌘",
    ctrl: "⌃",
    alt: "⌥",
    shift: "⇧",
    backspace: "⌫",
    space: "␣",
  },
  Linux: {
    meta: "Super",
    ctrl: "Ctrl",
    alt: "Alt",
    shift: "Shift",
    backspace: "⌫",
    space: "␣",
  },
}

export const KbdCombined: FC<{
  children: string
  className?: string
  joint?: boolean
}> = ({ children, joint, className }) => {
  const specialKeys = SpecialKeys[getOS()] as Record<string, string>
  let key = children
  for (const [k, v] of Object.entries(specialKeys)) {
    key = key.replaceAll(new RegExp(k, "gi"), v)
  }

  return (
    <div className="flex items-center gap-1">
      {key.split(",").map((k, i) => (
        <Fragment key={k}>
          {joint ? (
            <Kbd className={className}>{k.replaceAll("+", " ")}</Kbd>
          ) : (
            <div className="flex items-center gap-1">
              {k.split("+").map((key, index) => (
                <Kbd key={index} className={className}>
                  {key}
                </Kbd>
              ))}
            </div>
          )}
          {i !== key.split(",").length - 1 && " / "}
        </Fragment>
      ))}
    </div>
  )
}

export const Kbd: FC<{ children: string, className?: string }> = memo(
  ({ children, className }) => (
    <kbd className={cn("kbd h-4 font-mono text-[0.7rem]", className)}>
      {children}
    </kbd>
  ),
)
