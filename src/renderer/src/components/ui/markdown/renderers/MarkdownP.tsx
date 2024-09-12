import { FeedViewType } from "@renderer/lib/enum"
import { useEntryContentContextSelector } from "@renderer/modules/entry-content/hooks"
import * as React from "react"

import { ensureAndRenderTimeStamp } from "../utils"

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

  return <p {...props}>{children}</p>
}
