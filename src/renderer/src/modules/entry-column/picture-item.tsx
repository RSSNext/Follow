import { SwipeMedia } from "@renderer/components/ui/media/swipe-media"
import { ReactVirtuosoItemPlaceholder } from "@renderer/components/ui/placeholder"
import { useRouteParamsSelector } from "@renderer/hooks/biz/useRouteParams"
import { cn } from "@renderer/lib/utils"
import { GridItem } from "@renderer/modules/entry-column/grid-item-template"
import { useEntry } from "@renderer/store/entry/hooks"

import { usePreviewMedia } from "../../components/ui/media/hooks"
import type { UniversalItemProps } from "./types"

export function PictureItem({
  entryId,
  entryPreview,
  translation,
}: UniversalItemProps) {
  const entry = useEntry(entryId) || entryPreview

  const isActive = useRouteParamsSelector(
    ({ entryId }) => entryId === entry?.entries.id,
  )

  const previewMedia = usePreviewMedia()
  if (!entry) return <ReactVirtuosoItemPlaceholder />
  return (
    <GridItem
      entryId={entryId}
      entryPreview={entryPreview}
      translation={translation}
    >
      <div className="relative flex gap-2 overflow-x-auto">
        <SwipeMedia
          media={entry.entries.media}
          className={cn(
            "aspect-square w-full shrink-0 rounded-md",
            isActive && "rounded-b-none",
          )}
          imgClassName="object-cover"
          uniqueKey={entryId}
          onPreview={(media, i) => {
            previewMedia(media, i)
          }}
        />
      </div>
    </GridItem>
  )
}
