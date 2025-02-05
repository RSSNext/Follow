import { LazyKateX } from "@follow/components/ui/katex/lazy.js"
import { createElement, useContext } from "react"

import { IsInParagraphContext } from "./__internal/ctx"

export const Math = ({ node }) => {
  const annotation = node.children.at(-1)

  const isInParagraph = useContext(IsInParagraphContext)
  if (!annotation) return null
  const latex = annotation.value

  return createElement(LazyKateX, {
    children: latex,
    mode: isInParagraph ? "inline" : "display",
  })
}
