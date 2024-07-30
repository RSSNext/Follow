import { cn, getOS } from "@renderer/lib/utils"
import type { FC } from "react"
import { Fragment, memo } from "react"
import * as React from "react"

const SharedKeys = {
  backspace: "⌫",
  space: "␣",
}
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
// @ts-ignore
SpecialKeys.iOS = SpecialKeys.macOS
// @ts-ignore
SpecialKeys.Android = SpecialKeys.Linux

// const allSpecialKeys = new Set(
//   [
//     SpecialKeys.Windows,
//     SpecialKeys.macOS,
//     SpecialKeys.Linux,
//     SharedKeys,
//   ].flatMap((element) => Object.values(element)),
// )

const os = getOS()
export const KbdCombined: FC<{
  children: string
  className?: string
  joint?: boolean
}> = ({ children, joint, className }) => {
  const keys = children.split(",")
  return (
    <div className="flex items-center gap-1">
      {keys.map((k, i) => (
        <Fragment key={k}>
          {joint ? (
            <Kbd className={className}>{k}</Kbd>
          ) : (
            <div className="flex items-center gap-1">
              {k.split("+").map((key) => (
                <Kbd key={key} className={className}>
                  {key}
                </Kbd>
              ))}
            </div>
          )}
          {i !== keys.length - 1 && " / "}
        </Fragment>
      ))}
    </div>
  )
}

export const Kbd: FC<{ children: string, className?: string }> = memo(
  ({ children, className }) => {
    let specialKeys = (SpecialKeys as any)[os] as Record<string, string>
    specialKeys = { ...SharedKeys, ...specialKeys }

    return (
      <kbd
        className={cn("kbd h-4 space-x-1 font-mono text-[0.7rem]", className)}
      >
        {children.split("+").map((key_) => {
          let key: string = key_.toLowerCase()
          for (const [k, v] of Object.entries(specialKeys)) {
            key = key.replace(k, v)
          }

          switch (key) {
            case SharedKeys.space: {
              return <i className="i-mingcute-space-line" key={key} />
            }

            case SharedKeys.backspace: {
              return <i className="i-mingcute-delete-back-line" key={key} />
            }

            default: {
              return (
                <span className="capitalize" key={key}>
                  {key}
                </span>
              )
            }
          }
        })}
      </kbd>
    )
  },
)
