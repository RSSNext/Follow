import * as React from "react"

import { IsInParagraphContext } from "./__internal/ctx"

export const MarkdownP: Component<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
> = ({ children, ...props }) => {
  return (
    <p {...props}>
      <IsInParagraphContext.Provider value={true}>{children}</IsInParagraphContext.Provider>
    </p>
  )
}
