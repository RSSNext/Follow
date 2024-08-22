import { parseHtml } from "@renderer/lib/parse-html"
import type { RemarkOptions } from "@renderer/lib/parse-markdown"
import { parseMarkdown } from "@renderer/lib/parse-markdown"
import { cn } from "@renderer/lib/utils"
import { useMemo, useState } from "react"

export const Markdown: Component<
  {
    children: string
  } & Partial<RemarkOptions>
> = ({ children, components, className }) => {
  const stableRemarkOptions = useState({ components })[0]

  const markdownElement = useMemo(
    () => parseMarkdown(children, { ...stableRemarkOptions }).content,
    [children, stableRemarkOptions],
  )

  return (
    <article
      className={cn(
        "prose relative cursor-auto select-text dark:prose-invert prose-th:text-left",
        className,
      )}
    >
      {markdownElement}
    </article>
  )
}

export const HTML: Component<
  {
    children: string | null | undefined
  } & Partial<{
    renderInlineStyle: boolean
  }>
> = ({ children, renderInlineStyle }) => {
  const stableRemarkOptions = useState({ renderInlineStyle })[0]

  const markdownElement = useMemo(
    () => children && parseHtml(children, { ...stableRemarkOptions }).content,
    [children, stableRemarkOptions],
  )

  return markdownElement
}
