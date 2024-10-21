import * as React from "react"

import { MarkdownRenderActionContext } from "../context"
import { IsInParagraphContext } from "./ctx"

export const MarkdownP: Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = ({ children, ...props }) => {
  const { isAudio, ensureAndRenderTimeStamp } = React.useContext(MarkdownRenderActionContext)
  const parseTimeline = isAudio()
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
