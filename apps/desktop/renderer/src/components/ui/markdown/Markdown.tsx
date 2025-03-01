import { cn } from "@follow/utils/utils"
import { useMemo, useState } from "react"

import type { RemarkOptions } from "~/lib/parse-markdown"
import { parseMarkdown } from "~/lib/parse-markdown"

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
  const [refElement, setRefElement] = useState<HTMLElement | null>(null)

  return (
    <MarkdownRenderContainerRefContext.Provider value={refElement}>
      <article
        className={cn(
          "prose relative cursor-auto select-text dark:prose-invert prose-th:text-left",
          className,
        )}
        ref={setRefElement}
      >
        {markdownElement}
      </article>
    </MarkdownRenderContainerRefContext.Provider>
  )
}
