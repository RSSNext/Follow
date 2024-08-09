import { parseMarkdown } from "@renderer/lib/parse-markdown"
import { cn } from "@renderer/lib/utils"
import { useMemo } from "react"

export const Markdown: Component<{
  children: string
}> = ({ children, className }) => {
  const markdownElement = useMemo(
    () => parseMarkdown(children).content,
    [children],
  )

  return (
    <article className={cn("prose relative cursor-auto select-text dark:prose-invert prose-th:text-left", className)}>
      {markdownElement}
    </article>
  )
}
