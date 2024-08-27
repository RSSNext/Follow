import { parseHtml } from "@renderer/lib/parse-html"
import type { RemarkOptions } from "@renderer/lib/parse-markdown"
import { parseMarkdown } from "@renderer/lib/parse-markdown"
import { cn } from "@renderer/lib/utils"
import { createElement, useMemo, useRef, useState } from "react"

import { MarkdownRenderContainerRefContext } from "./context"

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

export const HTML = <A extends keyof JSX.IntrinsicElements = "div">(
  props: {
    children: string | null | undefined
    as: A
  } & JSX.IntrinsicElements[A] &
  Partial<{
    renderInlineStyle: boolean
  }>,
) => {
  const { children, renderInlineStyle, as = "div", ...rest } = props
  const stableRemarkOptions = useState({ renderInlineStyle })[0]

  const markdownElement = useMemo(
    () =>
      children &&
      parseHtml(children, {
        ...stableRemarkOptions,
      }).toContent(),
    [children, stableRemarkOptions],
  )
  const ref = useRef<HTMLElement>(null)

  return (
    <MarkdownRenderContainerRefContext.Provider value={ref.current}>
      {createElement(as, { ...rest, ref }, markdownElement)}
    </MarkdownRenderContainerRefContext.Provider>
  )
}
