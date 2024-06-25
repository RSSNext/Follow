import { SwipeImages } from "@renderer/components/ui/image/swipe-images"
import { ReactVirtuosoItemPlaceholder } from "@renderer/components/ui/placeholder"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { cn } from "@renderer/lib/utils"
import { GridItem } from "@renderer/modules/entry-column/grid-item-template"
import { useEntry } from "@renderer/store/entry/hooks"

import { usePreviewImages } from "../../components/ui/image/hooks"
import type { UniversalItemProps } from "./types"

export function PictureItem({ entryId, entryPreview, translation }: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  const isActive = useRouteParamsSelector(({ entryId }) => entryId === entry?.entries.id)

  const previewImage = usePreviewImages()
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <GridItem entryId={entryId} entryPreview={entryPreview} translation={translation}>
      <div className="relative flex gap-2 overflow-x-auto">
        <SwipeImages
          images={entry.entries.images}
          className={cn("aspect-square w-full shrink-0 rounded-md", isActive && "rounded-b-none")}
          imgClassName="object-cover"
          uniqueKey={entryId}
          onPreview={(images, i) => {
            previewImage(images, i)
          }}
        />
      </div>
    </GridItem>
  )
}
