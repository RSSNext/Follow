import { cn } from "@renderer/lib/utils"
import { useWrappedElementSize } from "@renderer/providers/wrapped-element-provider"

import { Media } from "../../media"

export const MarkdownBlockImage = (
  props: React.ImgHTMLAttributes<HTMLImageElement>,
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
      className="flex justify-center"
    />
  )
}
