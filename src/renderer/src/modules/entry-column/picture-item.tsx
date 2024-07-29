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

export const PictureItemSkeleton = (
  <div className="relative mx-auto w-full max-w-md rounded-md bg-theme-background text-zinc-700 transition-colors dark:text-neutral-400">
    <div className="relative z-[1]">
      <div className="p-1.5">
        <div className="relative flex gap-2 overflow-x-auto">
          <div className="relative flex aspect-square w-full shrink-0 items-center overflow-hidden rounded-md">
            <div className="size-full animate-pulse overflow-hidden rounded-none bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>
        <div className="relative flex-1 px-2 pb-3 pt-1 text-sm">
          <div className="relative mb-1 mt-1.5 truncate font-medium leading-none">
            <div className="h-4 w-3/4 animate-pulse bg-gray-200 dark:bg-neutral-800" />
          </div>
          <div className="mt-1 flex items-center gap-1 truncate text-[13px]">
            <div className="mr-0.5 size-4 animate-pulse rounded-sm bg-gray-200 dark:bg-neutral-800" />
            <div className="h-3 w-1/2 animate-pulse bg-gray-200 dark:bg-neutral-800" />
            <span className="text-zinc-500">·</span>
            <div className="h-3 w-12 animate-pulse bg-gray-200 dark:bg-neutral-800" />
          </div>
        </div>
      </div>
    </div>
  </div>
)
