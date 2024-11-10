import { useInputComposition, useIsDark } from "@follow/hooks"
import { nextFrame } from "@follow/utils/dom"
import { cn } from "@follow/utils/utils"
import { createPlainShiki } from "plain-shiki"
import { useLayoutEffect, useRef } from "react"
import css from "shiki/langs/css.mjs"
import githubDark from "shiki/themes/github-dark.mjs"
import githubLight from "shiki/themes/github-light.mjs"
import { useEventCallback } from "usehooks-ts"

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
  const updateFnRef = useRef<() => void>()
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
      const { dispose: disposeShiki, update } = createPlainShiki(shiki).mount(ref.current, {
        lang: "css",
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
        defaultTheme: isDark ? "dark" : "light",
      })
      updateFnRef.current = update
      dispose = disposeShiki
    }
    return () => dispose?.()
  }, [isDark])
  const props = useInputComposition<HTMLInputElement>({
    onKeyDown: (e) => {
      if (e.key === "Escape") {
        e.preventDefault()
      }
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
    },
  })
  const handleCopy = useEventCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.clipboardData.setData("text/plain", ref.current?.textContent ?? "")
  })
  const handlePaste = useEventCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text/plain")

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      // Delete the current selection
      range.deleteContents()
      // Insert the text at the current cursor position
      range.insertNode(document.createTextNode(text))

      range.setStartAfter(range.endContainer)
      range.setEndAfter(range.endContainer)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    updateFnRef.current?.()
    onChange(ref.current?.textContent ?? "")
    // Focus the editor and set cursor to the end
    if (ref.current) {
      ref.current.focus()
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(ref.current)
      range.collapse(false) // collapse to end
      selection?.removeAllRanges()
      selection?.addRange(range)

      // Get selection position
      const rect = range.getBoundingClientRect()
      const containerRect = ref.current.getBoundingClientRect()
      const relativeBottom = rect.bottom - containerRect.top

      // If out of view, scroll to the position
      if (relativeBottom > ref.current.clientHeight) {
        ref.current.scrollTop += relativeBottom - ref.current.clientHeight
      }
    }
  })
  return (
    <div
      className={cn(
        "size-full",

        "ring-accent/20 duration-200 focus:border-accent/80 focus:outline-none focus:ring-2",
        "focus:!bg-accent/5",
        "border border-border",
        "placeholder:text-theme-placeholder-text dark:bg-zinc-700/[0.15] dark:text-zinc-200",
        "overflow-auto whitespace-pre hover:border-accent/60",
        className,
      )}
      ref={ref}
      onCopy={handleCopy}
      onPaste={handlePaste}
      contentEditable
      tabIndex={0}
      {...props}
    />
  )
}
