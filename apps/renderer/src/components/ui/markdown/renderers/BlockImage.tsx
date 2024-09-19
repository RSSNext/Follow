import { cn } from "~/lib/utils"
import { useWrappedElementSize } from "~/providers/wrapped-element-provider"

import { Media } from "../../media"

export const MarkdownBlockImage = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & {
    proxy?: {
      width: number
      height: number
    }
  },
) => {
  const size = useWrappedElementSize()

  return (
    <Media
      type="photo"
      {...props}
      mediaContainerClassName={cn(
        "rounded",
        size.w < Number.parseInt(props.width as string) && "w-full",
      )}
      popper
      className="inline-flex justify-center"
    />
  )
}
