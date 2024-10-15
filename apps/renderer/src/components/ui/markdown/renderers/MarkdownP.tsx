import * as React from "react"

import { FeedViewType } from "~/lib/enum"
import { useEntryContentContextSelector } from "~/modules/entry-content/hooks"

import { ensureAndRenderTimeStamp } from "../utils"
import { IsInParagraphContext } from "./ctx"

export const MarkdownP: Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = ({ children, ...props }) => {
  const view = useEntryContentContextSelector((s) => s.view)
  const parseTimeline = view === FeedViewType.Audios
  if (parseTimeline && typeof children === "string") {
    const renderer = ensureAndRenderTimeStamp(children)
    if (renderer) return <p>{renderer}</p>
  }

  if (parseTimeline && Array.isArray(children)) {
    return (
      <p>
        {children.map((child) => {
          if (typeof child === "string") {
            const renderer = ensureAndRenderTimeStamp(child)
            if (renderer) return renderer
          }
          return child
        })}
      </p>
    )
  }

  return (
    <p {...props}>
      <IsInParagraphContext.Provider value={true}>{children}</IsInParagraphContext.Provider>
    </p>
  )
}
