import { cn } from "~/lib/utils"
import { useEntryContentContext } from "~/modules/entry-content/hooks"

import { Media } from "../../media"
import { usePopulatedFullUrl } from "../utils"

export const MarkdownInlineImage = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    proxy?: {
      width: number
      height: number
    }
  },
) => {
  const { feedId } = useEntryContentContext()
  const populatedUrl = usePopulatedFullUrl(feedId, props.src)
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
