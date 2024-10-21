import { useContext } from "react"

import { cn } from "~/lib/utils"

import { Media } from "../../media"
import { MarkdownRenderActionContext } from "../context"

export const MarkdownInlineImage = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    proxy?: {
      width: number
      height: number
    }
  },
) => {
  const { transformUrl } = useContext(MarkdownRenderActionContext)
  const populatedUrl = transformUrl(props.src)
  return (
    <Media
      type="photo"
      {...props}
      loading="lazy"
      src={populatedUrl}
      mediaContainerClassName={cn("inline max-w-full rounded-md")}
      popper
      className="inline"
      showFallback
    />
  )
}
