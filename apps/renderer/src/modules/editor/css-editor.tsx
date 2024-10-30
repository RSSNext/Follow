import { useIsDark } from "@follow/hooks"
import { nextFrame } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import { createPlainShiki } from "plain-shiki"
import { useLayoutEffect, useRef } from "react"
import css from "shiki/langs/css.mjs"
import githubDark from "shiki/themes/github-dark.mjs"
import githubLight from "shiki/themes/github-light.mjs"

import { shiki } from "~/components/ui/code-highlighter/shiki/shared"

shiki.loadLanguageSync(css)
shiki.loadThemeSync(githubDark)
shiki.loadThemeSync(githubLight)
export const CSSEditor: Component<{
  onChange: (value: string) => void
  defaultValue?: string
}> = ({ onChange, className, defaultValue }) => {
  const ref = useRef<HTMLDivElement>(null)

  const isDark = useIsDark()
  useLayoutEffect(() => {
    let dispose: () => void
    if (ref.current) {
      ref.current.focus()
      // Move cursor to the end of the content
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(ref.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)

      ref.current.textContent = defaultValue ?? ""
      const { dispose: disposeShiki } = createPlainShiki(shiki).mount(ref.current, {
        lang: "css",
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultTheme: isDark ? "dark" : "light",
      })
      dispose = disposeShiki
    }
    return () => dispose?.()
  }, [isDark])
  return (
    <div
      className={cn("size-full", className)}
      ref={ref}
      contentEditable
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          e.preventDefault()
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const tabNode = document.createTextNode("\u00A0\u00A0\u00A0\u00A0") // Using four non-breaking spaces as a tab
            range.insertNode(tabNode)
            range.setStartAfter(tabNode)
            range.setEndAfter(tabNode)
            selection.removeAllRanges()
            selection.addRange(range)
          }
        }
        nextFrame(() => {
          onChange(ref.current?.textContent ?? "")
        })
      }}
    />
  )
}
