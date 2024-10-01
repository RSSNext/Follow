import { cn } from "~/lib/utils"
import { useEntryContentContext } from "~/modules/entry-content/hooks"
import { useWrappedElementSize } from "~/providers/wrapped-element-provider"
import { useEntry } from "~/store/entry"

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

  const { entryId } = useEntryContentContext()
  const media = useEntry(entryId, (entry) => entry?.entries.media?.find((m) => m.url === props.src))

  return (
    <Media
      type="photo"
      {...props}
      height={media?.height || props.height}
      width={media?.width || props.width}
      blurhash={media?.blurhash}
      mediaContainerClassName={cn(
        "rounded",
        size.w < Number.parseInt(props.width as string) && "w-full",
      )}
      showFallback
      popper
      className="my-8 flex justify-center"
    />
  )
}
